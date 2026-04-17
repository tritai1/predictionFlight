# 🛠️ Troubleshooting & Optimization Guide

## Mục Lục
1. [Lỗi Thường Gặp & Cách Khắc Phục](#lỗi-thường-gặp--cách-khắc-phục)
2. [Performance Optimization](#performance-optimization)
3. [Model Improvement Strategies](#model-improvement-strategies)
4. [Monitoring & Logging](#monitoring--logging)
5. [Advanced Techniques](#advanced-techniques)

---

## Lỗi Thường Gặp & Cách Khắc Phục

### 1. Backend Errors

#### **Lỗi 1: `Model {name} không tồn tại`**

**Nguyên nhân:**
```python
if not os.path.exists(model_path):
    return {'success': False, 'error': f'Model {model_name} không tồn tại'}
```

**Cách khắc phục:**

```bash
# 1. Kiểm tra xem folder model/ tồn tại không
ls -la model/

# 2. Kiểm tra file model
ls -la model/*.pkl
# Expected:
# -rw-r--r-- 1 user group  5234567 Apr 17 10:30 DecisionTreeRegressor.pkl
# -rw-r--r-- 1 user group  7234567 Apr 17 10:35 RandomForestRegressor.pkl
# -rw-r--r-- 1 user group  8234567 Apr 17 10:40 StackingRegressor.pkl

# 3. Verify file integrity
python3 << EOF
import joblib
try:
    model = joblib.load('model/RandomForestRegressor.pkl')
    print("✓ Model loaded successfully")
    print(f"  - Model type: {type(model['model'])}")
    print(f"  - Preprocessor type: {type(model['preprocessor'])}")
except Exception as e:
    print(f"✗ Error loading model: {e}")
EOF
```

---

#### **Lỗi 2: `No module named 'scikit-learn'`**

**Nguyên nhân:** Thiếu Python package

**Cách khắc phục:**

```bash
# 1. Cài đặt từng package
pip install scikit-learn pandas numpy joblib

# 2. Hoặc cài từ requirements file
pip install -r requirements.txt

# 3. Verify installation
python3 -c "import sklearn; print(sklearn.__version__)"
# Output: 1.0.2
```

**requirements.txt mẫu:**
```
pandas==1.3.5
numpy==1.21.6
scikit-learn==1.0.2
joblib==1.1.1
python-shell==1.0.1
```

---

#### **Lỗi 3: `TypeError: object is not iterable`**

**Nguyên nhân:** Dữ liệu JSON không đúng format

**Debug:**

```python
# predictor.py
try:
    input_data = json.loads(raw_input)
    print(f"Type: {type(input_data)}")
    print(f"Keys: {input_data.keys() if isinstance(input_data, dict) else 'Not a dict'}")
except json.JSONDecodeError as e:
    print(f"JSON Parse Error: {e}")
    print(f"Raw input: {raw_input[:200]}")  # First 200 chars
```

**Kiểm tra Node.js side:**

```javascript
// home.controller.js
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

// Debug: In ra JSON
console.log('Sending data:', JSON.stringify(flightData, null, 2));

// Verify all fields present
const requiredFields = ['airline', 'departureCity', 'arrivalCity', 'duration', 'stops'];
for (const field of requiredFields) {
    if (!flightData[field]) {
        console.error(`Missing required field: ${field}`);
    }
}
```

---

#### **Lỗi 4: `Server hangs / Timeout`**

**Nguyên nhân:** Python subprocess bị stuck

**Cơ chế:**

```javascript
// home.controller.js
function runPython(flightData) {
    return new Promise((resolve, reject) => {
        const PythonShell = require('python-shell').PythonShell;
        
        const pythonScript = path.join(__dirname, '..', 'predictor.py');
        
        // Set timeout: 30 seconds
        const options = {
            scriptPath: path.dirname(pythonScript),
            pythonPath: 'python',
            args: [JSON.stringify(flightData)],
            timeout: 30000  // 30 seconds ← KEY
        };
        
        PythonShell.run(path.basename(pythonScript), options, (err, results) => {
            if (err) {
                console.error('Python execution error:', err);
                reject(err);
                return;
            }
            
            // Process results
            const output = results.join('');
            const prediction = JSON.parse(output);
            resolve(prediction);
        });
    });
}
```

**Cách khắc phục:**

```javascript
// Thêm error handler
.on('error', (err) => {
    console.error('Python process error:', err);
    // Send timeout response
    res.json({
        success: false,
        error: 'Model prediction timeout'
    });
})
.on('close', () => {
    console.log('Python process closed');
});
```

---

### 2. Data Issues

#### **Lỗi 5: `RMSE quá cao` (Model không chính xác)**

**Kiểm tra:**

```python
# EDA
print(f"Price range: {y.min()} - {y.max()}")
print(f"Price mean: {y.mean():.0f}")
print(f"Price std: {y.std():.0f}")

# Test MAE
baseline_mae = np.mean(np.abs(y_test - y_test.mean()))
model_mae = mean_absolute_error(y_test, y_pred)

print(f"Baseline MAE (mean): {baseline_mae:,.0f}")
print(f"Model MAE: {model_mae:,.0f}")
print(f"Improvement: {(1 - model_mae/baseline_mae)*100:.1f}%")

# If model_mae close to baseline → model is poor
```

**Giải pháp:**

```python
# 1. Kiểm tra features
print("Feature distributions:")
print(X.describe())

# 2. Check training score
train_score = model.score(X_train, y_train)
test_score = model.score(X_test, y_test)
print(f"Train R²: {train_score:.4f}")
print(f"Test R²: {test_score:.4f}")

if train_score > 0.95 and test_score < 0.70:
    print("⚠️ Overfitting detected!")
    # Solutions: reduce max_depth, add regularization
    
# 3. Collect more/better data
# 4. Better feature engineering
# 5. Try different models
# 6. Hyperparameter tuning
```

---

#### **Lỗi 6: `Features không matching` (New data format khác)**

**Nguyên nhân:** Airline/City không nằm trong training data

```python
# predictor.py - Validation
def validate_input(flight_data):
    """Validate input data"""
    
    # Load training features
    valid_airlines = ['Vietnam Airlines', 'Vietjet', 'Bamboo Airways', ...]
    valid_cities = ['Hà Nội', 'TP.HCM', 'Đà Nẵng', ...]
    valid_classes = ['Economy', 'Business', 'First Class']
    
    # Validation
    if flight_data['airline'] not in valid_airlines:
        return {
            'valid': False,
            'error': f"Airline '{flight_data['airline']}' not in training data"
        }
    
    if flight_data['departureCity'] not in valid_cities:
        return {
            'valid': False,
            'error': f"City '{flight_data['departureCity']}' not in training data"
        }
    
    return {'valid': True}
```

---

### 3. Integration Issues

#### **Lỗi 7: `Python path error` - Script không tìm thấy**

**Cách khắc phục:**

```javascript
// home.controller.js
const path = require('path');

// SAIIII ❌
const pythonScript = 'predictor.py';  // Relative, sẽ lỗi

// ĐÚNG ✅
const pythonScript = path.join(__dirname, '..', 'predictor.py');

console.log(`Python path: ${pythonScript}`);
// Debug: In ra full path

// Verify file exists
const fs = require('fs');
if (!fs.existsSync(pythonScript)) {
    console.error(`File not found: ${pythonScript}`);
}
```

---

#### **Lỗi 8: `Datetime parsing error`**

**Nguyên nhân:** Format datetime không consistent

```python
# predictor.py
from datetime import datetime

def parse_datetime(date_string):
    """Parse datetime từ nhiều format khác nhau"""
    
    formats = [
        '%Y-%m-%dT%H:%M:%S',        # ISO: 2024-05-15T10:30:00
        '%Y-%m-%d %H:%M:%S',        # Space: 2024-05-15 10:30:00
        '%d/%m/%Y %H:%M',           # DD/MM: 15/05/2024 10:30
        '%Y-%m-%d',                 # Date only: 2024-05-15
    ]
    
    for fmt in formats:
        try:
            return datetime.strptime(date_string, fmt)
        except ValueError:
            continue
    
    # Fallback: try fromisoformat
    try:
        return datetime.fromisoformat(date_string)
    except:
        raise ValueError(f"Unable to parse: {date_string}")

# Use
try:
    dt = parse_datetime(flight_data['departureFullTime'])
except ValueError as e:
    return {'success': False, 'error': str(e)}
```

---

## Performance Optimization

### 1. Python Execution Speed

**Optimization 1: Model Caching**

```python
# Avoid reloading models for every prediction
import joblib

class ModelCache:
    _cache = {}
    
    @classmethod
    def load_model(cls, model_name):
        if model_name not in cls._cache:
            path = f'model/{model_name}.pkl'
            cls._cache[model_name] = joblib.load(path)
        return cls._cache[model_name]

# Usage
def predict_with_model(data, model_name):
    model_data = ModelCache.load_model(model_name)
    # Use model_data
```

**Optimization 2: Batch Prediction**

```python
# Instead of predicting 1 at a time
# Collect predictions and do batch

def predict_multiple(list_of_flights):
    """Predict for multiple flights at once"""
    
    # Convert all to DataFrame
    df_list = [flight_to_dataframe(f) for f in list_of_flights]
    df_combined = pd.concat(df_list, ignore_index=True)
    
    # Preprocess once
    X_processed = preprocessor.transform(df_combined)
    
    # Predict all
    predictions = model.predict(X_processed)
    
    return predictions
```

**Optimization 3: Vectorization**

```python
# SLOW - Loop ❌
predictions = []
for i in range(len(X)):
    pred = model.predict(X[i:i+1])
    predictions.append(pred)

# FAST - Vectorized ✅
predictions = model.predict(X)  # All at once
```

### 2. Node.js Server Optimization

**Connection Pooling:**

```javascript
// Instead of creating new Python process each time
const { PythonShell } = require('python-shell');

// Create pool
const pool = [];
const POOL_SIZE = 3;

function initPythonPool() {
    for (let i = 0; i < POOL_SIZE; i++) {
        // Create Python processes
    }
}

// Use from pool
function executePython(data) {
    const pythonProcess = pool.pop() || createNewProcess();
    // Execute
    pool.push(pythonProcess);  // Return to pool
}
```

**Async Processing:**

```javascript
// Use async/await
module.exports.predict = async (req, res) => {
    try {
        // Don't block - use Promise
        const prediction = await runPython(flightData);
        res.json(prediction);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
```

### 3. Database Optimization (History)

**Current:**
```javascript
// Load entire history file every time
function getPredictionHistory() {
    const data = fs.readFileSync(HISTORY_FILE, 'utf8');
    return JSON.parse(data);  // Entire file loaded
}
```

**Optimized:**
```javascript
// Cache history in memory
class HistoryManager {
    constructor() {
        this.history = [];
        this.maxSize = 100;
        this.lastUpdate = 0;
    }
    
    load() {
        if (fs.existsSync(HISTORY_FILE)) {
            this.history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
        }
    }
    
    add(prediction) {
        this.history.unshift(prediction);  // Add to front
        if (this.history.length > this.maxSize) {
            this.history.pop();
        }
        this.save();
    }
    
    save() {
        fs.writeFileSync(HISTORY_FILE, JSON.stringify(this.history, null, 2));
    }
    
    getAll() {
        return this.history;  // Return cached copy
    }
}

const history = new HistoryManager();
history.load();
```

---

## Model Improvement Strategies

### 1. Data Collection

```python
# Collect more data
print(f"Current data size: {len(X)}")

# Ideal: 
# - Regression: 10,000+ samples
# - Per category: 100+ samples minimum

# Example
target_size = 50000
if len(X) < target_size:
    print(f"⚠️ Current: {len(X)} samples")
    print(f"← Recommended: {target_size} samples")
    print("Collect more data to improve model")
```

### 2. Feature Engineering Improvements

```python
# Add more features
advanced_features = {
    # Temporal
    'is_holiday': is_holiday_feature(departure_date),
    'is_season_high': is_high_season(departure_date),
    'is_weekend': departure_date.weekday() >= 5,
    
    # Route
    'distance': calculate_distance(dep_city, arr_city),
    'is_popular_route': (dep_city, arr_city) in top_routes,
    
    # Interaction
    'days_left_squared': days_left ** 2,
    'is_long_flight_premium': (duration > 4) & (travel_class == 'Business'),
    
    # Aggregates
    'avg_price_same_route': group_by_route['price'].mean(),
}

# Add to X
for feature_name, values in advanced_features.items():
    X[feature_name] = values
```

### 3. Hyperparameter Fine-Tuning

```python
from sklearn.model_selection import GridSearchCV

# Comprehensive tuning
param_grid = {
    'n_estimators': [100, 200, 300, 500],
    'max_depth': [10, 15, 20, 25, None],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4],
    'max_features': ['sqrt', 'log2', None],
    'bootstrap': [True, False]
}

grid = GridSearchCV(
    RandomForestRegressor(random_state=42),
    param_grid,
    cv=5,
    scoring='neg_mean_squared_error',
    n_jobs=-1,
    verbose=1
)

grid.fit(X_train, y_train)

print(f"Best params: {grid.best_params_}")
print(f"Best CV score: {-grid.best_score_:.0f}")

# Test
best_model = grid.best_estimator_
test_score = best_model.score(X_test, y_test)
print(f"Test R²: {test_score:.4f}")
```

### 4. Ensemble Enhancement

```python
# Add more diverse base models
from sklearn.svm import SVR
from xgboost import XGBRegressor  # Nếu cài đặt

base_models = [
    ('dt', DecisionTreeRegressor(max_depth=10)),
    ('rf', RandomForestRegressor(n_estimators=100)),
    ('svr', SVR(kernel='rbf', C=100)),
    ('xgb', XGBRegressor(n_estimators=100))
]

stacking = StackingRegressor(
    estimators=base_models,
    final_estimator=Ridge(alpha=1.0)
)

stacking.fit(X_train, y_train)
print(f"Enhanced Stacking R²: {stacking.score(X_test, y_test):.4f}")
```

---

## Monitoring & Logging

### 1. Server Logging

```javascript
// Comprehensive logging
const logger = {
    info: (message) => console.log(`[INFO] ${new Date().toISOString()}: ${message}`),
    error: (message) => console.error(`[ERROR] ${new Date().toISOString()}: ${message}`),
    debug: (message) => console.log(`[DEBUG] ${new Date().toISOString()}: ${message}`)
};

// Usage in controller
module.exports.predict = async (req, res) => {
    logger.info(`Prediction request: ${JSON.stringify(req.body)}`);
    
    try {
        const prediction = await runPython(flightData);
        logger.info(`Prediction successful: ${prediction.results[0].price}`);
        res.json(prediction);
    } catch (error) {
        logger.error(`Prediction failed: ${error.message}`);
        res.status(500).json({ success: false, error: error.message });
    }
};
```

### 2. Model Performance Monitoring

```python
# Log predictions for monitoring
import json
from datetime import datetime

def log_prediction(prediction_data, predicted_price):
    """Log để monitoring"""
    log_entry = {
        'timestamp': datetime.now().isoformat(),
        'input': prediction_data,
        'predicted_price': predicted_price,
        'model_version': '1.0'
    }
    
    with open('prediction_logs.jsonl', 'a') as f:
        f.write(json.dumps(log_entry) + '\n')

# Analysis
def analyze_predictions(days=7):
    """Analyze recent predictions"""
    cutoff = pd.Timestamp.now() - pd.Timedelta(days=days)
    
    logs = []
    with open('prediction_logs.jsonl', 'r') as f:
        for line in f:
            log = json.loads(line)
            if pd.Timestamp(log['timestamp']) > cutoff:
                logs.append(log)
    
    df = pd.DataFrame(logs)
    print(f"Recent predictions (last {days} days): {len(df)}")
    print(f"Avg predicted price: {df['predicted_price'].mean():,.0f}")
    print(f"Price range: {df['predicted_price'].min():,.0f} - {df['predicted_price'].max():,.0f}")
```

---

## Advanced Techniques

### 1. Model Versioning

```python
import time

MODEL_VERSION = '1.0'
DEPLOYMENT_DATE = '2024-04-17'

# Save with version info
model_info = {
    'version': MODEL_VERSION,
    'deployment_date': DEPLOYMENT_DATE,
    'performance': {
        'train_r2': 0.92,
        'test_r2': 0.88,
        'test_rmse': 71234
    },
    'model': trained_model,
    'preprocessor': preprocessor
}

joblib.dump(model_info, f'model/RandomForestRegressor_v{MODEL_VERSION}.pkl')
```

### 2. A/B Testing

```python
# Test new model vs old
def predict_ab_test(flight_data):
    """A/B test between models"""
    
    # Load models
    model_a = joblib.load('model/RandomForestRegressor_v1.0.pkl')
    model_b = joblib.load('model/RandomForestRegressor_v1.1.pkl')
    
    # Preprocess
    X_processed = preprocessor.transform(flight_data)
    
    # Predict both
    pred_a = model_a['model'].predict(X_processed)
    pred_b = model_b['model'].predict(X_processed)
    
    # Select based on test group
    import random
    if random.random() < 0.5:  # 50% A, 50% B
        return {'prediction': pred_a, 'model': 'A'}
    else:
        return {'prediction': pred_b, 'model': 'B'}
```

### 3. Online Learning (Update Model Over Time)

```python
# Collect feedback
def collect_feedback(prediction_id, actual_price):
    """Collect actual prices to retrain"""
    feedback = {
        'id': prediction_id,
        'actual_price': actual_price,
        'timestamp': datetime.now().isoformat()
    }
    
    with open('feedback.jsonl', 'a') as f:
        f.write(json.dumps(feedback) + '\n')

# Periodic retraining
def retrain_model_weekly():
    """Retrain model with new data"""
    
    # Load old training data
    X_old, y_old = load_training_data()
    
    # Load feedback
    feedback = load_feedback()
    X_new = feedback[['features']]
    y_new = feedback[['actual_price']]
    
    # Combine
    X_combined = pd.concat([X_old, X_new])
    y_combined = pd.concat([y_old, y_new])
    
    # Retrain
    model_new = RandomForestRegressor(n_estimators=100)
    model_new.fit(X_combined, y_combined)
    
    # Save
    joblib.dump(model_new, f'model/RandomForestRegressor_v{new_version}.pkl')
```

---

## 📋 Debugging Checklist

- [ ] Check model files exist: `ls -la model/*.pkl`
- [ ] Verify file corruption: `python3 -c "import joblib; joblib.load(...)"`
- [ ] Check Python packages: `pip list | grep scikit`
- [ ] Validate input JSON: Print raw input in Python
- [ ] Check datetime parsing: Test with sample datetime strings
- [ ] Monitor server logs: Check console output
- [ ] Test Python script separately: `python3 predictor.py`
- [ ] Check API timeout: Monitor request duration
- [ ] Validate prediction output: Check if reasonable values
- [ ] Monitor memory usage: Resource profiling
- [ ] Check model versions: Ensure updated models in production

---

**Quyết tâm khắc phục vấn đề! 💪**
