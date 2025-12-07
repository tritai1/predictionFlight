const { PythonShell } = require('python-shell');
const fs = require('fs');
const path = require('path');

const HISTORY_FILE = path.join(__dirname, '..', 'prediction_history.json');

// Danh sách model hợp lệ (phù hợp với predictor.py)
const AVAILABLE_MODELS = [
  'RandomForestRegressor',
  'DecisionTreeRegressor',
  'StackingRegressor'
];

// Hàm lưu lịch sử dự đoán
function savePredictionHistory(predictionData) {
    try {
        let history = [];
        if (fs.existsSync(HISTORY_FILE)) {
            const data = fs.readFileSync(HISTORY_FILE, 'utf8');
            history = JSON.parse(data);
        }

        // Thêm dự đoán mới với timestamp
        const historyEntry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...predictionData
        };

        history.unshift(historyEntry); // Thêm vào đầu mảng

        // Giới hạn 100 bản ghi gần nhất
        if (history.length > 100) {
            history = history.slice(0, 100);
        }

        fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
        console.log('Lịch sử dự đoán đã được lưu');
    } catch (error) {
        console.error('Lỗi khi lưu lịch sử:', error);
    }
}

// Hàm đọc lịch sử dự đoán
function getPredictionHistory() {
    try {
        if (fs.existsSync(HISTORY_FILE)) {
            const data = fs.readFileSync(HISTORY_FILE, 'utf8');
            return JSON.parse(data);
        }
        return [];
    } catch (error) {
        console.error('Lỗi khi đọc lịch sử:', error);
        return [];
    }
}

module.exports.home = (req, res)=>{
    res.render('page/home/home');
}

module.exports.history = (req, res)=>{
    const history = getPredictionHistory();
    res.render('page/history/history', {
        history: history
    });
}

module.exports.clearHistory = (req, res)=>{
    try {
        if (fs.existsSync(HISTORY_FILE)) {
            fs.unlinkSync(HISTORY_FILE);
        }
        res.json({ success: true, message: 'Lịch sử đã được xóa' });
    } catch (error) {
        console.error('Lỗi khi xóa lịch sử:', error);
        res.json({ success: false, message: 'Có lỗi xảy ra khi xóa lịch sử' });
    }
}

const runPython = async (userData) => {
    const options = {
        mode: 'text',
        pythonPath: 'C:\\Users\\trita\\AppData\\Local\\Programs\\Python\\Python313\\python.exe',  // đảm bảo đây là python có joblib
        pythonOptions: ['-u'],                    // unbuffered output
        scriptPath: path.join(__dirname, '..'),  // thư mục chứa predictor.py (ở root dự án)
        args: [JSON.stringify(userData)]
    };

    return new Promise((resolve, reject) => {
        const pyshell = new PythonShell('predictor.py', options); // TÊN file Python: predictor.py
        let stderrLines = [];
        let messages = [];

        pyshell.on('stderr', (data) => {
            const s = String(data).trim();
            if (s) {
                stderrLines.push(s);
                console.error('PY STDERR:', s);
            }
        });

        pyshell.on('message', (message) => {
            // PythonShell emits each stdout line as 'message'
            messages.push(message);
        });

        pyshell.end((err) => {
            if (err) {
                const stderr = stderrLines.join('\n');
                return reject(new Error(`Python execution error: ${err.message || err}\nStderr:\n${stderr}`));
            }

            if (!messages || messages.length === 0) {
                const stderr = stderrLines.join('\n');
                return reject(new Error(`Python returned no output. Stderr:\n${stderr}`));
            }

            // Expect JSON in the first/non-empty stdout line
            const first = messages.find(m => String(m).trim().length > 0);
            if (!first) {
                const stderr = stderrLines.join('\n');
                return reject(new Error(`Python returned empty output. Stderr:\n${stderr}`));
            }

            try {
                const parsed = JSON.parse(first);
                resolve(parsed);
            } catch (parseErr) {
                const stderr = stderrLines.join('\n');
                reject(new Error(`Failed to parse JSON from Python: ${parseErr.message}\nRaw output:\n${first}\nStderr:\n${stderr}`));
            }
        });
    });
};

module.exports.predict = async (req, res) => {
    try {
        // Lấy model được chọn và xác thực với danh sách có sẵn
        let selectedModels = req.body.models || [];
        if (!Array.isArray(selectedModels)) {
            // Có thể form gửi 1 giá trị string
            selectedModels = selectedModels ? [selectedModels] : [];
        }

        // Chỉ giữ các model hợp lệ, nếu không có model hợp lệ thì dùng default (RandomForestRegressor)
        selectedModels = selectedModels.filter(m => AVAILABLE_MODELS.includes(m));
        if (selectedModels.length === 0) {
            selectedModels = ['RandomForestRegressor'];
        }

        // Chuẩn hoá và validate các input cần thiết
        const airline = String(req.body.airline || '').trim();
        const departureCity = String(req.body.departureCity || '').trim();
        const arrivalCity = String(req.body.arrivalCity || '').trim();
        const travelClass = String(req.body.travelClass || '').trim() || 'Economy';
        const stops = Number.isFinite(Number(req.body.stops)) ? parseInt(req.body.stops, 10) : 0;
        const duration = req.body.duration ? parseFloat(req.body.duration) : null;
        const departureFullTimeRaw = req.body.departureFullTime || '';
        const arrivalFullTimeRaw = req.body.arrivalFullTime || '';
        const predictionDateRaw = req.body.predictionDate || '';

        // Kiểm tra các trường bắt buộc
        if (!airline || !departureCity || !arrivalCity || !departureFullTimeRaw || !arrivalFullTimeRaw || !predictionDateRaw || duration === null) {
            return res.render('page/result/result', {
                success: false,
                error: 'Vui lòng điền đầy đủ dữ liệu: hãng, thành phố đi/đến, thời gian khởi hành/đến, ngày dự đoán và thời lượng.',
                flightData: req.body,
                selectedModels: selectedModels
            });
        }

        // Chuẩn hoá datetime sang ISO (nếu người dùng gửi ở dạng local datetime)
        function toIsoIfPossible(s) {
            try {
                const d = new Date(s);
                if (isNaN(d.getTime())) return s; // trả về nguyên bản nếu không parse được
                return d.toISOString();
            } catch {
                return s;
            }
        }

        const departureFullTime = toIsoIfPossible(departureFullTimeRaw);
        const arrivalFullTime = toIsoIfPossible(arrivalFullTimeRaw);
        const predictionDate = toIsoIfPossible(predictionDateRaw);

        const flightData = {
            airline,
            departureCity,
            arrivalCity,
            travelClass,
            stops,
            departureFullTime,
            arrivalFullTime,
            predictionDate,
            duration,
            models: selectedModels
        };

        // Chạy Python script
        const prediction = await runPython(flightData);

        if (prediction && prediction.success) {
            // Lưu lịch sử dự đoán
            const historyData = {
                flightData: flightData,
                prediction: prediction,
                selectedModels: selectedModels
            };
            savePredictionHistory(historyData);

            res.render('page/result/result', {
                success: true,
                prediction: prediction,
                flightData: flightData,
                selectedModels: selectedModels
            });
        } else {
            res.render('page/result/result', {
                success: false,
                error: (prediction && prediction.error) ? prediction.error : 'Có lỗi xảy ra khi dự đoán',
                flightData: flightData,
                selectedModels: selectedModels
            });
        }
    } catch (error) {
        console.error('Lỗi server:', error);
        res.render('page/result/result', {
            success: false,
            error: 'Lỗi máy chủ nội bộ',
            flightData: req.body
        });
    }
}