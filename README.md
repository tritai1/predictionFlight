# Flight Price Prediction System 🛫

## Tổng Quan Dự Án

Hệ thống dự đoán giá vé máy bay phát triển dựa trên machine learning, cho phép người dùng dự đoán giá vé máy bay dựa trên các yếu tố khác nhau như:
- Hãng bay
- Thành phố khởi hành/đến
- Quãng đường, số điểm dừng
- Thời gian chuyến bay
- Hạng vé (Economy, Business, etc.)
- Số ngày còn lại trước chuyến bay

### Mục Tiêu
- **Cung cấp dự đoán giá vé chính xác**: Giúp người dùng dự đoán giá vé để lên kế hoạch chi phí
- **So sánh giữa các model**: Cung cấp dự đoán từ nhiều model khác nhau để có cái nhìn toàn diện
- **Lưu lịch sử**: Theo dõi các lợi nhuận dự đoán trước đó

---

## 🎯 Tính Năng Chính

### 1. **Dự Đoán Giá Vé**
- Nhập thông tin chuyến bay và nhận dự đoán giá từ 3 model khác nhau
- So sánh kết quả giữa các model
- Xem giá cao nhất, thấp nhất và chênh lệch

### 2. **Hỗ Trợ Nhiều Model**
- **Random Forest Regressor**: Model dựa trên ensemble learning
- **Decision Tree Regressor**: Model dựa trên cây quyết định
- **Stacking Regressor**: Mô hình tổng hợp kết hợp nhiều model cơ bản

### 3. **Lịch Sử Dự Đoán**
- Tự động lưu lịch sử các dự đoán (tối đa 100 bản ghi)
- Xem lại các dự đoán trước đó
- Xóa lịch sử khi cần

### 4. **Giao Diện Web Thân Thiện**
- Sử dụng template Pug
- CSS tùy chỉnh cho trải nghiệm tốt
- Form nhập liệu dễ sử dụng

---

## 📚 Tech Stack

### Backend
- **Node.js + Express.js**: Framework web server
- **Python 3.x**: Machine learning & data processing
- **python-shell**: Bridge giữa Node.js và Python

### Frontend
- **Pug (Jade)**: Template engine
- **CSS**: Styling
- **HTML5**: Markup

### Machine Learning
- **scikit-learn**: Các model dự đoán
- **pandas**: Xử lý dữ liệu
- **numpy**: Tính toán số học
- **joblib**: Lưu/tải model

### Tools & Dependencies
- **nodemon**: Auto-reload server khi code thay đổi
- **JSON**: Lưu trữ lịch sử dự đoán

---

## 📁 Cấu Trúc Dự Án

```
predictionFlight/
├── app.js                           # Khởi tạo Express server
├── package.json                     # Dependencies Node.js
├── predictor.py                     # Python script dự đoán
├── prediction_history.json          # Lịch sử dự đoán
│
├── controller/
│   └── home.controller.js           # Logic xử lý request/response
│
├── router/
│   ├── app.route.js                # Routing chính
│   └── home.route.js               # Routes liên quan đến home
│
├── model/                           # Thư mục chứa model đã train
│   ├── RandomForestRegressor.pkl   # Model Random Forest
│   ├── DecisionTreeRegressor.pkl   # Model Decision Tree
│   └── StackingRegressor.pkl       # Model Stacking
│
├── view/
│   └── page/
│       ├── home/
│       │   └── home.pug            # Trang chủ - form nhập liệu
│       ├── result/
│       │   └── result.pug          # Trang kết quả dự đoán
│       └── history/
│           └── history.pug         # Trang lịch sử dự đoán
│
├── public/
│   └── style.css                   # CSS styling
│
├── pridictFlight/
│   ├── README.md
│   └── .gitattributes
│
├── predicFlight.ipynb              # Jupyter notebook - EDA & training
│
└── Dataset Files/
    ├── dataPriceFlight.csv         # Dataset gốc
    ├── Clean_Dataset.csv           # Dataset đã làm sạch
    ├── economy.csv                 # Data vé Economy
    ├── business.csv                # Data vé Business
    └── *.csv                       # Các file dữ liệu khác
```

---

## 🚀 Cài Đặt & Cấu Hình

### 1. **Yêu Cầu Hệ Thống**
- **Node.js**: >= 14.x
- **Python**: >= 3.7
- **npm hoặc yarn**

### 2. **Cài Đặt Dependencies**

#### Node.js Dependencies:
```bash
cd predictionFlight
npm install
```

#### Python Dependencies:
```bash
pip install pandas numpy scikit-learn joblib
```

**Hoặc dùng requirements file (nếu có):**
```bash
pip install -r requirements.txt
```

### 3. **Cấu Hình Model**
Đảm bảo các file model đã được train và lưu trong thư mục `model/`:
- `model/RandomForestRegressor.pkl`
- `model/DecisionTreeRegressor.pkl`
- `model/StackingRegressor.pkl`

Mỗi model file phải chứa:
```python
{
    'model': trained_model_object,
    'preprocessor': preprocessor_object  # ColumnTransformer hoặc Pipeline
}
```

### 4. **Chạy Ứng Dụng**

**Development Mode** (với auto-reload):
```bash
npm start
```

**Production Mode**:
```bash
node app.js
```

Server sẽ chạy trên `http://localhost:9000`

---

## 📖 Hướng Dẫn Sử Dụng

### Dự Đoán Giá Vé

#### **Step 1: Truy Cập Trang Chủ**
- Mở browser, navigate tới: `http://localhost:9000/`
- Bạn sẽ thấy form nhập liệu

#### **Step 2: Điền Thông Tin Chuyến Bay**

**Các trường cần nhập:**

| Trường | Kiểu Dữ Liệu | Mô Tả | Ví Dụ |
|--------|-------------|-------|-------|
| **Airline** | String | Tên hãng bay | Vietnam Airlines, Vietjet |
| **Departure City** | String | Thành phố khởi hành | Hà Nội, TP.HCM |
| **Arrival City** | String | Thành phố đến | Đà Nẵng, Bangkok |
| **Travel Class** | Select | Hạng vé | Economy, Business |
| **Stops** | Number | Số điểm dừng | 0, 1, 2 |
| **Duration** | Number | Thời lượng chuyến bay (giờ) | 2.5, 3.0 |
| **Departure Time** | DateTime | Thời gian khởi hành | 2024-05-15T10:30 |
| **Arrival Time** | DateTime | Thời gian đến | 2024-05-15T12:30 |
| **Prediction Date** | Date | Ngày dự đoán | 2024-04-20 |

#### **Step 3: Chọn Model (Tuỳ Chọn)**
- Mặc định sẽ sử dụng tất cả 3 model
- Bạn có thể chọn các model cụ thể để dự đoán

#### **Step 4: Xem Kết Quả**
Kết quả sẽ bao gồm:
- Dự đoán từ 3 model
- Giá cao nhất, thấp nhất
- Chênh lệch giá so với giá thấp nhất
- Thông tin chuyến bay được nhập

### Xem Lịch Sử Dự Đoán
- Truy cập: `http://localhost:9000/history`
- Xem danh sách 100 dự đoán gần nhất
- Xóa lịch sử nếu cần: click nút "Xóa Lịch Sử"

---

## 🤖 Thông Tin Model & Machine Learning

### 3 Model Được Sử Dụng

#### **1. Random Forest Regressor**
**Đặc điểm:**
- Ensemble learning model từ nhiều decision tree
- Giảm overfitting so với decision tree đơn lẻ
- Xử lý tốt với dữ liệu không cân bằng

**Ưu điểm:**
- ✅ Chính xác cao
- ✅ Khởi tạo nhanh
- ✅ Tính năng chọn lựa tự động

**Nhược điểm:**
- ❌ Chậm với dataset lớn
- ❌ Khó diễn giải

**Tham số:**
- n_estimators: Số tree sử dụng
- max_depth: Độ sâu tối đa của tree
- min_samples_split: Số sample tối thiểu để split

#### **2. Decision Tree Regressor**
**Đặc điểm:**
- Model dựa trên cây quyết định
- Chia dataset thành các nhánh dựa trên features

**Ưu điểm:**
- ✅ Dễ hiểu và diễn giải
- ✅ Xử lý nhanh
- ✅ Không cần chuẩn hóa dữ liệu

**Nhược điểm:**
- ❌ Dễ overfit
- ❌ Độ chính xác có thể thấp hơn ensemble model
- ❌ Nhạy cảm với thay đổi dữ liệu

**Tham số:**
- max_depth: Độ sâu tối đa
- min_samples_split: Số sample tối thiểu để split
- min_samples_leaf: Số sample tối thiểu trong leaf

#### **3. Stacking Regressor**
**Đặc điểm:**
- Meta-learning model kết hợp nhiều model cơ bản
- Sử dụng "meta-learner" để tổng hợp dự đoán các model cơ bản

**Ưu điểm:**
- ✅ Chính xác cao (kết hợp ưu điểm của các model khác)
- ✅ Linh hoạt với các model khác nhau
- ✅ Giảm bias và variance

**Nhược điểm:**
- ❌ Phức tạp, khó diễn giải
- ❌ Thời gian training dài
- ❌ Dễ overfit nếu không cấu hình tốt

**Cấu trúc:**
```
Base Models: [RandomForest, DecisionTree, ...]
       ↓
    Features
       ↓
   Meta-Learner (e.g., Linear Regression)
       ↓
   Final Prediction
```

---

## 📊 Xử Lý Dữ Liệu

### 1. **Nguồn Dữ Liệu**
- **File chính**: `dataPriceFlight.csv`
- **Dữ liệu**: Thông tin các chuyến bay và giá vé
- **Kích thước**: Hàng nghìn records

### 2. **Các Bước Làm Sạch Dữ Liệu** (Data Wrangling)

**a) Loại bỏ Features Không Cần Thiết:**
```python
# Xóa các cột không sử dụng
features_to_drop = ["Flight Code", "Date of Travel"]
```

**b) Xử Lý Giá Trị Thiếu (Missing Values):**
- Kiểm tra cột nào có dữ liệu thiếu
- Sử dụng `SimpleImputer` để điền giá trị:
  - Mean/Median cho numerical columns
  - Most frequent value cho categorical columns

**c) Xử Lý Thời Gian (Temporal Feature Engineering):**

```python
def categorize_time(time_obj):
    hour = time_obj.hour
    if 0 <= hour < 6:
        return 'Sáng sớm'      # Early morning
    elif 6 <= hour < 12:
        return 'Sáng'          # Morning
    elif 12 <= hour < 17:
        return 'Trưa'          # Afternoon
    elif 17 <= hour < 20:
        return 'Chiều'         # Evening
    else:
        return 'Tối'           # Night
```

**d) Tính Toán Feature Mới:**
```python
# Tính days_left - số ngày còn lại trước chuyến bay
days_left = (departure_date - prediction_date).days

# Ảnh hưởng: Chuyến bay sắp tới thường đắt hơn
```

### 3. **Features (Đặc Trưng) Sử Dụng**

| Feature | Kiểu | Mô Tả | Ảnh Hưởng |
|---------|------|-------|----------|
| Airline Name | Categorical | Tên hãng bay | Hãng khác nhau giá khác |
| Departure City | Categorical | Thành phố khởi hành | Ảnh hưởng cung cầu |
| Arrival City | Categorical | Thành phố đến | Ảnh hưởng cung cầu |
| Travel Class | Categorical | Hạng vé | Premium vé đắt hơn |
| Stops | Numerical | Số điểm dừng | Nhiều dừng → giá thấp |
| Departure Time | Categorical | Thời gian khởi hành | Peak hours → giá cao |
| Arrival Time | Categorical | Thời gian đến | Ảnh hưởng chọn lọc |
| Duration | Numerical | Thời lượng chuyến bay | Quãng đường xa → giá cao |
| days_left | Numerical | Số ngày đến ngày khởi hành | Booking sớm → giá rẻ |

### 4. **Preprocessing**
- **Encoding Categorical**: Sử dụng `OneHotEncoder` cho categorical features
- **Scaling Numerical**: Không cần scaling cho tree-based models (Random Forest, Decision Tree)
- **Pipeline**: Sử dụng `ColumnTransformer` để apply preprocessing tự động

---

## 🔧 API Endpoints

### **POST /predict**
**Mục đích**: Dự đoán giá vé máy bay

**Request Body:**
```json
{
  "airline": "Vietnam Airlines",
  "departureCity": "Hà Nội",
  "arrivalCity": "TP.HCM",
  "travelClass": "Economy",
  "stops": 0,
  "duration": 2.5,
  "departureFullTime": "2024-05-15T10:30:00",
  "arrivalFullTime": "2024-05-15T12:30:00",
  "predictionDate": "2024-04-20T00:00:00",
  "models": ["RandomForestRegressor", "DecisionTreeRegressor", "StackingRegressor"]
}
```

**Response (Success):**
```json
{
  "success": true,
  "results": [
    {
      "success": true,
      "model": "RandomForestRegressor",
      "price": 1250000,
      "formatted_price": "1.250.000 VND",
      "selected": true,
      "is_lowest": false,
      "price_diff": 50000
    },
    {
      "success": true,
      "model": "DecisionTreeRegressor",
      "price": 1200000,
      "formatted_price": "1.200.000 VND",
      "selected": true,
      "is_lowest": true,
      "price_diff": 0
    },
    {
      "success": true,
      "model": "StackingRegressor",
      "price": 1300000,
      "formatted_price": "1.300.000 VND",
      "selected": true,
      "is_lowest": false,
      "price_diff": 100000
    }
  ],
  "summary": {
    "total_models": 3,
    "successful_predictions": 3,
    "price_range": "1.200.000 - 1.300.000 VND"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Vui lòng điền đầy đủ dữ liệu"
}
```

### **GET /**
Trang chủ - form dự đoán

### **GET /history**
Xem lịch sử dự đoán

### **POST /clear-history**
Xóa lịch sử dự đoán

---

## 📈 Kiến Thức Machine Learning Liên Quan

### 1. **Regression (Hồi Quy)**
- **Định nghĩa**: Dự đoán giá trị liên tục (giá vé)
- **Vs Classification**: 
  - Regression → Giá trị liên tục (1250000 VND)
  - Classification → Phân loại rời rạc (rẻ, vừa, đắt)

**Metrics Đánh Giá:**

Basic Metrics:
- **MAE**: $\text{MAE} = \frac{1}{m} \sum_{i=1}^{m} |y^{(i)} - \hat{y}^{(i)}|$
  - Average absolute error (dễ hiểu, cùng đơn vị với target)

- **RMSE**: $\text{RMSE} = \sqrt{\frac{1}{m} \sum_{i=1}^{m} (y^{(i)} - \hat{y}^{(i)})^2}$
  - Root mean squared error (penalize large errors)

- **R² Score**: $R^2 = 1 - \frac{\sum(y^{(i)} - \hat{y}^{(i)})^2}{\sum(y^{(i)} - \bar{y})^2}$
  - Ratio of explained variance (0-1, higher is better)

- **MAPE**: $\text{MAPE} = \frac{100\%}{m} \sum_{i=1}^{m} \left|\frac{y^{(i)} - \hat{y}^{(i)}}{y^{(i)}}\right|$
  - Mean absolute percentage error (scale-independent)

Advanced Metrics (Log Transform):
- **RMSLE**: $\text{RMSLE} = \sqrt{\frac{1}{m} \sum_{i=1}^{m} (\log(y^{(i)}+1) - \log(\hat{y}^{(i)}+1))^2}$
  - Using log1p to reduce outlier impact

- **Log-MAE**: $\text{MAE}_{\log} = \frac{1}{m} \sum_{i=1}^{m} |\log(y^{(i)}+1) - \log(\hat{y}^{(i)}+1)|$
  - MAE on log-transformed values

### 2. **Decision Tree (Cây Quyết Định)**
```
                   Airline?
                   /      \
            Vietnam       Other
             /               \
           Price?            Price?
           /  \              /  \
        1M-   +2M         500K- +1M
```
- **Pros**: Dễ hiểu, không cần scaling
- **Cons**: Dễ overfit, độ chính xác thấp

### 3. **Random Forest (Rừng Ngẫu Nhiên)**
- Kết hợp nhiều Decision Tree
- Mỗi tree được train trên subset dữ liệu ngẫu nhiên
- Kết quả cuối = trung bình/vote từ tất cả trees
- **Giảm overfit** thông qua voting mechanism

### 4. **Ensemble Learning (Học Tập Tập Hợp)**
- Kết hợp nhiều model yếu để tạo model mạnh
- **Bagging**: Random Forest, Bagging Regressor
- **Boosting**: Gradient Boosting, AdaBoost
- **Stacking**: Kết hợp với meta-learner

### 5. **Feature Engineering (Kỹ Thuật Tạo Features)**
- **Domain Knowledge**: Hiểu dữ liệu
- **Feature Creation**: Tạo feature mới từ features cũ
  - `days_left` = khoảng cách thời gian
  - `time_category` = binning thời gian
- **Feature Selection**: Chọn features quan trọng
- **Feature Scaling**: Chuẩn hóa range

### 6. **Data Preprocessing (Xử Lý Dữ Liệu)**
- **Handling Missing Values**: Imputation, deletion
- **Categorical Encoding**: One-Hot, Label Encoding
- **Outlier Detection**: Statistical methods, IQR
- **Train-Test Split**: Chia dữ liệu 80-20

### 7. **Model Evaluation (Đánh Giá Model)**

#### **7.1 Các Công Thức Đánh Giá Chi Tiết**

**a) Mean Absolute Error (MAE) - Lỗi Tuyệt Đối Trung Bình:**
$$\text{MAE} = \frac{1}{m} \sum_{i=1}^{m} |y^{(i)} - \hat{y}^{(i)}|$$

Ý nghĩa: Average của lỗi dự đoán tuyệt đối (không phân biệt dấu)
- **Ưu**: Dễ hiểu, cùng đơn vị với dữ liệu
- **Nhược**: Không nhạy cảm với lỗi lớn

**b) Mean Squared Error (MSE) & Root Mean Squared Error (RMSE):**
$$\text{MSE} = \frac{1}{m} \sum_{i=1}^{m} (y^{(i)} - \hat{y}^{(i)})^2$$

$$\text{RMSE} = \sqrt{\text{MSE}} = \sqrt{\frac{1}{m} \sum_{i=1}^{m} (y^{(i)} - \hat{y}^{(i)})^2}$$

Ý nghĩa: Căn bậc hai của trung bình bình phương lỗi
- **Ưu**: Nhạy cảm với lỗi lớn (penalize outliers), dễ optimize
- **Nhược**: Bị ảnh hưởng nhiều bởi outliers, rất lớn khi có lỗi bất thường

**c) Mean Absolute Percentage Error (MAPE) - Lỗi Phần Trăm:**
$$\text{MAPE} = \frac{100\%}{m} \sum_{i=1}^{m} \left|\frac{y^{(i)} - \hat{y}^{(i)}}{y^{(i)}}\right|$$

Ý nghĩa: Lỗi trung bình tính theo phần trăm của giá trị thực tế
- **Ưu**: Scale-independent, dễ so sánh giữa các dataset khác nhau
- **Nhược**: Undefined khi $y^{(i)} = 0$, không symmetric

**d) Root Mean Squared Logarithmic Error (RMSLE) - Log Transform:**
$$\text{RMSLE} = \sqrt{\frac{1}{m} \sum_{i=1}^{m} (\log(y^{(i)} + 1) - \log(\hat{y}^{(i)} + 1))^2}$$

Công thức chi tiết:
$$\text{RMSLE} = \sqrt{\frac{1}{m} \sum_{i=1}^{m} \left[\log\left(\frac{y^{(i)} + 1}{\hat{y}^{(i)} + 1}\right)\right]^2}$$

Ý nghĩa: RMSE trên log-transformed values (sử dụng log1p)
- **Ưu**: Giảm penalize của outliers, tốt cho dữ liệu biến thiên mạnh
- **Nhược**: Phức tạp hơn, khó interpret

**e) Mean Absolute Percentage Error với Log (Log-MAPE):**
$$\text{Log-MAPE} = \frac{100\%}{m} \sum_{i=1}^{m} \left|\frac{\log(y^{(i)} + 1) - \log(\hat{y}^{(i)} + 1)}{\log(y^{(i)} + 1)}\right|$$

Ý nghĩa: MAPE được tính trên log-transformed values

**f) Coefficient of Determination (R²) - Hệ Số Xác Định:**
$$R^2 = 1 - \frac{SS_{res}}{SS_{tot}} = 1 - \frac{\sum_{i=1}^{m}(y^{(i)} - \hat{y}^{(i)})^2}{\sum_{i=1}^{m}(y^{(i)} - \bar{y})^2}$$

Hay viết cách khác:
$$R^2 = \frac{\sum_{i=1}^{m}(\hat{y}^{(i)} - \bar{y})^2}{\sum_{i=1}^{m}(y^{(i)} - \bar{y})^2}$$

Ý nghĩa: Tỷ lệ phương sai được model giải thích
- Range: [0, 1] (hoặc âm nếu model quá kém)
- **R² = 0.85** → Model giải thích 85% phương sai
- **R² = 1.0** → Perfect fit (nghi ngờ overfitting)
- **R² < 0** → Tệ hơn cả baseline (mean prediction)

**g) Adjusted R² - R² Điều Chỉnh:**
$$\text{Adjusted } R^2 = 1 - \frac{(1-R^2)(m-1)}{m-p-1}$$

Ở đó:
- $m$ = số samples
- $p$ = số features

Ý nghĩa: R² được điều chỉnh theo số features (penalize model complexity)
- Tốt hơn R² khi có nhiều features

#### **7.2 Biến Thể với Log1p Transformation**

**MAE với Log Transform:**
$$\text{MAE}_{\log} = \frac{1}{m} \sum_{i=1}^{m} |\log_10(y^{(i)}) - \log_10(\hat{y}^{(i)})|$$

Hoặc sử dụng log1p (để tránh log(0)):
$$\text{MAE}_{\log1p} = \frac{1}{m} \sum_{i=1}^{m} |\log(y^{(i)} + 1) - \log(\hat{y}^{(i)} + 1)|$$

**RMSE với Log Transform:**
$$\text{RMSE}_{\log} = \sqrt{\frac{1}{m} \sum_{i=1}^{m} (\log(y^{(i)} + 1) - \log(\hat{y}^{(i)} + 1))^2}$$

**Symmetric MAPE (SMAPE) - Cải Tiến MAPE:**
$$\text{SMAPE} = \frac{100\%}{m} \sum_{i=1}^{m} \frac{|y^{(i)} - \hat{y}^{(i)}|}{(|y^{(i)}| + |\hat{y}^{(i)}|)/2}$$

Ý nghĩa: MAPE được cân bằng, không bị bias khi có giá trị 0

#### **7.3 Khi Nào Sử Dụng Từng Metric?**

| Metric | Khi Nào Dùng | Ưu Điểm | Nhược Điểm |
|--------|-------------|---------|-----------|
| **MAE** | Lỗi trung bình đơn giản | Dễ hiểu, robust | Không penalize lỗi lớn |
| **RMSE** | Cost function optimization | Differentiable, penalize outliers | Sensitive to outliers |
| **R²** | So sánh % variance explained | Normalized [0,1] | Có thể misleading |
| **MAPE** | % error comparison | Scale-independent | Undefined at 0 |
| **RMSLE** | Outliers nhiều, biến thiên mạnh | Giảm outlier impact | Phức tạp, khó interpret |
| **Log-MAE** | Data skewed, heteroskedastic | Giảm large error penalize | Khó interpret |

#### **7.4 Áp Dụng cho Flight Price Prediction**

Cho dự án này, khoảng giá: **450,000 - 2,500,000 VND**

**Metrics được sử dụng:**
- **RMSE**: Chính thức, sensitive to outliers
- **MAE**: Secondary, dễ hiểu (lỗi trung bình VND)
- **R²**: Đánh giá % variance
- **MAPE**: So sánh % error
- **RMSLE** (tuỳ chọn): Nếu data có outliers

**Công thức đánh giá cụ thể:**
```python
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import numpy as np

# RMSE
rmse = np.sqrt(mean_squared_error(y_test, y_pred))

# MAE
mae = mean_absolute_error(y_test, y_pred)

# R²
r2 = r2_score(y_test, y_pred)

# MAPE
mape = np.mean(np.abs((y_test - y_pred) / y_test)) * 100

# RMSLE (với log1p)
rmsle = np.sqrt(np.mean((np.log1p(y_test) - np.log1p(y_pred))**2))

# Log-MAE
log_mae = np.mean(np.abs(np.log1p(y_test) - np.log1p(y_pred)))

print(f"RMSE: {rmse:,.0f} VND")
print(f"MAE: {mae:,.0f} VND")
print(f"R²: {r2:.4f}")
print(f"MAPE: {mape:.2f}%")
print(f"RMSLE: {rmsle:.6f}")
print(f"Log-MAE: {log_mae:.6f}")
```

**Cross-Validation:**
```
Data → [Fold1 | Fold2 | Fold3 | Fold4 | Fold5]
Train → [2,3,4,5] → Test [1]
Train → [1,3,4,5] → Test [2]
...
```

**Metrics:**
- So sánh model sử dụng tất cả các metrics trên
- Chọn model dựa trên RMSE + MAPE kết hợp

### 8. **Hyperparameter Tuning (Điều Chỉnh Siêu Tham Số)**

**Grid Search / Random Search:**
```python
params = {
    'n_estimators': [100, 200, 300],
    'max_depth': [10, 20, None],
    'min_samples_split': [2, 5, 10]
}
# Thử tất cả kết hợp → chọn tốt nhất
```

### 9. **Overfitting vs Underfitting**
- **Overfitting**: Model quá phức tạp, fit quá tốt training set, kém trên test set
  - Giải pháp: Regularization, early stopping, pruning
- **Underfitting**: Model quá đơn giản, không fit training set tốt
  - Giải pháp: Model phức tạp hơn, feature engineering

### 10. **Production Deployment (Triển Khai Sản Xuất)**
- Lưu model: `joblib.dump(model, 'model.pkl')`
- Load model: `joblib.load('model.pkl')`
- API wrapper: Node.js → Python subprocess
- Monitoring: Theo dõi performance model

---

## 📊 Phân Tích Dữ Liệu (EDA)

### Exploratory Data Analysis trong Notebook
Notebook `predicFlight.ipynb` bao gồm:

1. **Data Loading & Inspection**
   - Load CSV file
   - Kiểm tra shape, datatypes, missing values

2. **Statistical Analysis**
   - Describe(): Min, max, mean, std
   - Correlation matrix
   - Distribution analysis

3. **Visualization**
   - Histograms: Phân phối giá vé
   - Box plots: Outliers detection
   - Scatter plots: Mối quan hệ features-price
   - Heatmap: Correlation

4. **Data Cleaning**
   - Handling missing values
   - Removing duplicates
   - Outlier treatment

5. **Feature Engineering**
   - Tạo new features
   - Encoding categorical
   - Feature importance

6. **Model Training**
   - Split train-test
   - Train 3 models
   - Hyperparameter tuning
   - Model evaluation
   - Save models

---

## 🔍 Ví Dụ Workflow Hoàn Chỉnh

### Scenario: Dự đoán giá vé Hà Nội → TP.HCM

```
1. User từ homepage → nhập thông tin:
   - Airline: Vietnam Airlines
   - From: Hà Nội
   - To: TP.HCM
   - Class: Economy
   - Stops: 0
   - Duration: 2.5 giờ
   - Departure: 15/05/2024 10:30
   - Arrival: 15/05/2024 12:30
   - Prediction Date: 20/04/2024

2. Frontend → gửi POST request tới /predict
   - JSON payload với above data

3. Backend Controller → validate data
   - Kiểm tra required fields
   - Chuẩn hóa datetime

4. Controller → gọi Python script
   - subprocess.Popen() hoặc python-shell
   - Pass data qua stdin/args

5. predictor.py → xử lý data
   - Parse datetime
   - Categorize time (10:30 → 'Sáng')
   - Calculate days_left (25 days)
   - Create DataFrame

6. predictor.py → load 3 models
   - Load model.pkl files từ folder model/
   - Get preprocessor & trained model

7. predictor.py → preprocess & predict
   - Apply preprocessor (encoding)
   - predict() for each model
   - Format output

8. Backend → nhận output JSON
   - Parse kết quả
   - Lưu lịch sử
   - Render result.pug

9. Frontend → display results
   - Show 3 predictions
   - Highlight min, max, differences
   - Display flight info
```

---

## 📝 Lưu Ý & Best Practices

### Khi Sử Dụng:
- ✅ Model đủ tốt khi |RMSE/Mean_Price| < 10%
- ✅ Predictions tốt nhất khi features nằm trong train data range
- ⚠️ Nếu airline/city không trong training → model có thể không chính xác
- ⚠️ Data quá cũ (>1 năm) có thể không chính xác với giá hiện tại

### Cải Thiện Model:
1. **Thêm dữ liệu training**: Nhiều data → model tốt hơn
2. **Feature engineering tốt hơn**: Thêm seasonal features, trend data
3. **Hyperparameter tuning**: GridSearch để tìm best params
4. **Model diversification**: Thêm XGBoost, LGBM, Neural Networks
5. **Regular retraining**: Retrain model định kỳ với new data

### Performance Optimization:
1. **Cache model**: Load model lần đầu, reuse cho requests sau
2. **Batch prediction**: Dự đoán nhiều records cùng lúc
3. **Async processing**: Non-blocking I/O cho React-like frontend
4. **API rate limiting**: Ngăn spam requests

---

## 🐛 Troubleshooting

### Lỗi Thường Gặp

| Lỗi | Nguyên Nhân | Giải Pháp |
|-----|------------|----------|
| `Model {name} không tồn tại` | Model file không tìm thấy | Check thư mục model/, tên file |
| `No module named 'joblib'` | Thiếu Python package | `pip install joblib` |
| `TypeError: object is not iterable` | Data format sai | Check JSON structure |
| `RMSE quá cao` | Model kém hoặc feature không phù hợp | Retrain model, improve features |
| `Server hangs` | Python subprocess bị stuck | Timeout handling, restart server |

### Debug Tips:
1. Kiểm tra logs: Console & stderr
2. Test Python script separately: `python predictor.py`
3. Validate input JSON: Use online JSON validator
4. Check model files: `joblib.load('model.pkl')` in Python
5. Network monitoring: Check request/response payload

---

## 📚 Tài Liệu & Resources

### Machine Learning Libraries
- [scikit-learn Documentation](https://scikit-learn.org/stable/)
- [Pandas Documentation](https://pandas.pydata.org/docs/)
- [NumPy Documentation](https://numpy.org/doc/)

### Node.js & Express
- [Express.js Documentation](https://expressjs.com/)
- [python-shell on npm](https://www.npmjs.com/package/python-shell)

### Tools & IDE
- [Visual Studio Code](https://code.visualstudio.com/)
- [Jupyter Notebook](https://jupyter.org/)
- [Git & GitHub](https://github.com/)

### Learning Resources
- [Kaggle - Machine Learning Datasets](https://www.kaggle.com/)
- [Andrew Ng's ML Course](https://www.coursera.org/learn/machine-learning)
- [Scikit-learn Tutorials](https://scikit-learn.org/stable/modules/tree.html)

---

## 🎓 Kết Luận

Dự án này kết hợp:
- **Data Science**: EDA, preprocessing, feature engineering
- **Machine Learning**: Regression models, ensemble methods
- **Web Development**: Backend API, frontend interface
- **DevOps**: Model deployment, Python-JS integration

Qua dự án này, bạn học được:
1. Quy trình ML hoàn chỉnh: từ dữ liệu đến production
2. Multiple models & ensemble learning
3. Web application development
4. Integration giữa Python & JavaScript
5. Industry best practices

---

**Last Updated**: April 2026  
**Version**: 1.0.0  
**Status**: Production Ready
