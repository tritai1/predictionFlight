# 🔧 Hướng Dẫn Chi Tiết: Data Processing & Model Training

## Mục Lục
1. [Data Processing Pipeline](#data-processing-pipeline)
2. [Exploratory Data Analysis (EDA)](#exploratory-data-analysis-eda)
3. [Feature Engineering Step-by-Step](#feature-engineering-step-by-step)
4. [Model Training Process](#model-training-process)
5. [Evaluation & Selection](#evaluation--selection)
6. [Deployment Checklist](#deployment-checklist)

---

## Data Processing Pipeline

### Bước 1: Data Loading & Inspection

**Tải dữ liệu:**
```python
import pandas as pd
import numpy as np

# Load CSV file
flight_df = pd.read_csv('dataPriceFlight.csv')

# Kiểm tra kích thước
print(f"Shape: {flight_df.shape}")  # (rows, columns)
# Output: Shape: (10000, 9)

# Xem đầu file
print(flight_df.head(10))
```

**Columns trong dataset:**
```python
# Kiểm tra tên các cột
print(flight_df.columns.tolist())
# ['Flight Code', 'Airline Name', 'Departure City', 'Arrival City',
#  'Departure Time', 'Arrival Time', 'Duration', 'Stops', 'Travel Class', 
#  'Price', 'Date of Travel']

# Kiểu dữ liệu
print(flight_df.dtypes)
```

### Bước 2: Lằng Dữ Liệu - Remove Unnecessary Columns

**Xóa columns không dùng:**
```python
columns_to_drop = ['Flight Code', 'Date of Travel']
flight_df = flight_df.drop(columns=columns_to_drop, errors='ignore')

print(f"Shape sau khi xóa: {flight_df.shape}")
# Shape sau khi xóa: (10000, 7)
```

**Lý do:**
- **Flight Code**: Unique identifier, không có predictive power
- **Date of Travel**: Sẽ được xử lý thành features khác

### Bước 3: Kiểm Tra Missing Values

**Kiểm tra null values:**
```python
def check_missing_values(df):
    """Kiểm tra giá trị thiếu trong dataframe"""
    missing_stats = pd.DataFrame({
        'Column': df.columns,
        'Missing_Count': df.isnull().sum(),
        'Missing_Percent': (df.isnull().sum() / len(df) * 100).round(2)
    })
    return missing_stats.sort_values('Missing_Count', ascending=False)

print(check_missing_values(flight_df))
```

**Output Example:**
```
          Column  Missing_Count  Missing_Percent
0   Arrival Time             50             0.50%
1   Departure Time            30             0.30%
2        Duration             20             0.20%
3   Airline Name              0             0.00%
...
```

**Xử lý missing values:**
```python
from sklearn.impute import SimpleImputer

# Define features
features_required = ['Airline Name', 'Departure Time', 'Arrival Time',
                     'Duration', 'Stops', 'Price', 'Departure City', 
                     'Arrival City', 'Travel Class']

# Separate numerical and categorical
numerical_cols = ['Duration', 'Stops']
categorical_cols = ['Airline Name', 'Departure City', 'Arrival City', 'Travel Class']

# Impute numerical: lấy median
imputer_num = SimpleImputer(strategy='median')
flight_df[numerical_cols] = imputer_num.fit_transform(flight_df[numerical_cols])

# Impute categorical: lấy mode (most frequent)
imputer_cat = SimpleImputer(strategy='most_frequent')
flight_df[categorical_cols] = imputer_cat.fit_transform(flight_df[categorical_cols])

# Verify
print(flight_df.isnull().sum().sum())  # Should be 0
```

---

## Exploratory Data Analysis (EDA)

### Statistical Summary

```python
# Tóm tắt thống kê
print(flight_df.describe())
```

**Output:**
```
          Duration       Stops       Price
count    10000.000   10000.000    10000.000
mean        2.856      0.523    1187543.2
std         1.234      0.789     245321.5
min         1.000      0.000     450000.0
25%         2.000      0.000     980000.0
50%         3.000      0.500    1200000.0
75%         4.000      1.000    1380000.0
max         8.000      3.000    2500000.0
```

### Distribution Analysis

**Histogram - Phân phối giá:**
```python
import matplotlib.pyplot as plt

plt.figure(figsize=(12, 4))

# Histogram giá vé
plt.subplot(1, 3, 1)
plt.hist(flight_df['Price'], bins=50, edgecolor='black', alpha=0.7)
plt.xlabel('Price (VND)')
plt.ylabel('Frequency')
plt.title('Distribution of Flight Prices')

# Histogram duration
plt.subplot(1, 3, 2)
plt.hist(flight_df['Duration'], bins=30, edgecolor='black', alpha=0.7)
plt.xlabel('Duration (hours)')
plt.ylabel('Frequency')
plt.title('Distribution of Flight Duration')

# Bar plot - Airline
plt.subplot(1, 3, 3)
airline_counts = flight_df['Airline Name'].value_counts()
airline_counts.head(5).plot(kind='bar')
plt.xlabel('Airline')
plt.ylabel('Count')
plt.title('Top 5 Airlines')

plt.tight_layout()
plt.show()
```

### Correlation Analysis

```python
# Tính correlation với target variable (Price)
correlation_with_price = flight_df[numerical_cols + ['Price']].corr()['Price'].sort_values(ascending=False)

print("Correlation with Price:")
print(correlation_with_price)
```

**Output:**
```
Price         1.000000
Duration      0.654321  ← Strong positive
Stops        -0.423456  ← Negative (many stops → lower price)
Name: Price
```

**Heatmap:**
```python
import seaborn as sns

plt.figure(figsize=(8, 6))
correlation_matrix = flight_df[numerical_cols + ['Price']].corr()
sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0)
plt.title('Correlation Matrix')
plt.show()
```

---

## Feature Engineering Step-by-Step

### Bước 1: Temporal Features

**Parse datetime columns:**
```python
from datetime import datetime

# Convert to datetime
flight_df['Departure Time'] = pd.to_datetime(flight_df['Departure Time'])
flight_df['Arrival Time'] = pd.to_datetime(flight_df['Arrival Time'])

print(flight_df['Departure Time'].dtype)
# datetime64[ns]
```

**Extract time attributes:**
```python
def categorize_time(time_obj):
    """Phân loại thời gian thành 5 khoảng"""
    hour = time_obj.hour
    
    if 0 <= hour < 6:
        return 'Sáng sớm'      # 00:00 - 05:59
    elif 6 <= hour < 12:
        return 'Sáng'          # 06:00 - 11:59
    elif 12 <= hour < 17:
        return 'Trưa'          # 12:00 - 16:59
    elif 17 <= hour < 20:
        return 'Chiều'         # 17:00 - 19:59
    else:
        return 'Tối'           # 20:00 - 23:59

# Create new categorical features
flight_df['Departure_Time_Cat'] = flight_df['Departure Time'].apply(categorize_time)
flight_df['Arrival_Time_Cat'] = flight_df['Arrival Time'].apply(categorize_time)

# Example
print(flight_df[['Departure Time', 'Departure_Time_Cat']].head())
```

### Bước 2: Days Left Feature

```python
# Giả sử có prediction_date trong dataset (khi book)
# Hoặc tạo feature tương đương: ngày trước chuyến bay

# Nếu có date mệnh trong dataset:
flight_df['Date of Travel'] = pd.to_datetime(flight_df['Date of Travel'])

# Days left = khoàng cách thời gian
# (Ở đây chúng ta lấy departure date từ 'Departure Time')
flight_df['Departure_Date'] = flight_df['Departure Time'].dt.date

# Giả sử booking date khác với departure date
# Hoặc sử dụng một booking date cụ thể
booking_date = pd.Timestamp('2024-04-20')

flight_df['Days_Left'] = (
    flight_df['Departure_Date'] - booking_date.date()
).apply(lambda x: max(x.days, 0))  # Ensure non-negative

# Analysis
print(flight_df['Days_Left'].describe())
```

**Tương quan giữa Days_Left và Price:**
```python
correlation = flight_df[['Days_Left', 'Price']].corr()
print(correlation)

# Ploting
plt.figure(figsize=(10, 6))
plt.scatter(flight_df['Days_Left'], flight_df['Price'], alpha=0.5)
plt.xlabel('Days Left')
plt.ylabel('Price')
plt.title('Price vs Days Ahead (Booking)')
plt.show()
```

### Bước 3: Categorical Encoding

**One-Hot Encoding:**
```python
from sklearn.preprocessing import OneHotEncoder

# Columns để encode
categorical_features = ['Airline Name', 'Departure City', 'Arrival City', 
                       'Travel Class', 'Departure_Time_Cat', 'Arrival_Time_Cat']

# Create encoder
encoder = OneHotEncoder(
    sparse=False,            # Output dense array
    drop='first',            # Avoid dummy variable trap
    handle_unknown='ignore'  # New values → all zeros
)

# Fit và transform
flight_df_encoded = encoder.fit_transform(flight_df[categorical_features])

# Get feature names
feature_names = encoder.get_feature_names_out(categorical_features)

# Create new dataframe
X_categorical = pd.DataFrame(flight_df_encoded, columns=feature_names)

print(f"Shape after encoding: {X_categorical.shape}")
# Shape after encoding: (10000, 45)
```

**Combine with numerical features:**
```python
# Select numerical features
numerical_features = ['Duration', 'Stops', 'Days_Left']
X_numerical = flight_df[numerical_features]

# Combine
X = pd.concat([X_numerical, X_categorical], axis=1)
y = flight_df['Price']

print(f"Final shape: X={X.shape}, y={y.shape}")
# Final shape: X=(10000, 48), y=(10000,)
```

---

## Model Training Process

### Bước 1: Train-Test Split

```python
from sklearn.model_selection import train_test_split

# 80-20 split
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42  # Reproducibility
)

print(f"Training set: {X_train.shape}")  # (8000, 48)
print(f"Test set: {X_test.shape}")       # (2000, 48)
```

### Bước 2: Train Decision Tree

```python
from sklearn.tree import DecisionTreeRegressor

dt_model = DecisionTreeRegressor(
    max_depth=10,            # Hạn chế độ sâu
    min_samples_split=5,     # Min samples để split
    min_samples_leaf=2,      # Min samples trong leaf
    random_state=42
)

# Train
dt_model.fit(X_train, y_train)

# Predictions
y_train_pred_dt = dt_model.predict(X_train)
y_test_pred_dt = dt_model.predict(X_test)

print(f"Train Score (R²): {dt_model.score(X_train, y_train):.4f}")
print(f"Test Score (R²): {dt_model.score(X_test, y_test):.4f}")
```

### Bước 3: Train Random Forest

```python
from sklearn.ensemble import RandomForestRegressor

rf_model = RandomForestRegressor(
    n_estimators=100,        # Số trees
    max_depth=15,            # Độ sâu
    min_samples_split=5,
    min_samples_leaf=2,
    max_features='sqrt',     # √n features/split
    random_state=42,
    n_jobs=-1                # Parallel processing
)

# Train
rf_model.fit(X_train, y_train)

# Predictions
y_train_pred_rf = rf_model.predict(X_train)
y_test_pred_rf = rf_model.predict(X_test)

print(f"Train Score (R²): {rf_model.score(X_train, y_train):.4f}")
print(f"Test Score (R²): {rf_model.score(X_test, y_test):.4f}")
```

### Bước 4: Train Stacking Regressor

```python
from sklearn.ensemble import StackingRegressor
from sklearn.linear_model import Ridge

# Base models
base_models = [
    ('dt', DecisionTreeRegressor(max_depth=10, random_state=42)),
    ('rf', RandomForestRegressor(n_estimators=50, max_depth=15, random_state=42))
]

# Meta-learner
meta_learner = Ridge(alpha=1.0)

# Create stacking model
stacking_model = StackingRegressor(
    estimators=base_models,
    final_estimator=meta_learner,
    cv=5  # 5-fold cross-validation
)

# Train
stacking_model.fit(X_train, y_train)

# Predictions
y_train_pred_st = stacking_model.predict(X_train)
y_test_pred_st = stacking_model.predict(X_test)

print(f"Train Score (R²): {stacking_model.score(X_train, y_train):.4f}")
print(f"Test Score (R²): {stacking_model.score(X_test, y_test):.4f}")
```

---

## Evaluation & Selection

### Evaluation Metrics

```python
from sklearn.metrics import mean_squared_error, mean_absolute_error

def evaluate_model(y_true, y_pred, model_name):
    """Tính toán các metrics"""
    mae = mean_absolute_error(y_true, y_pred)
    mse = mean_squared_error(y_true, y_pred)
    rmse = np.sqrt(mse)
    r2 = 1 - (mse / np.var(y_true))
    
    # MAPE
    mape = np.mean(np.abs((y_true - y_pred) / y_true)) * 100
    
    print(f"\n{model_name} Evaluation:")
    print(f"  MAE:  {mae:,.0f} VND")
    print(f"  RMSE: {rmse:,.0f} VND")
    print(f"  R²:   {r2:.4f}")
    print(f"  MAPE: {mape:.2f}%")
    
    return {'mae': mae, 'rmse': rmse, 'r2': r2, 'mape': mape}

# Evaluate all models
results = {}
results['Decision Tree'] = evaluate_model(y_test, y_test_pred_dt, "Decision Tree")
results['Random Forest'] = evaluate_model(y_test, y_test_pred_rf, "Random Forest")
results['Stacking'] = evaluate_model(y_test, y_test_pred_st, "Stacking")
```

**Output Example:**
```
Decision Tree Evaluation:
  MAE:  85,432 VND
  RMSE: 123,456 VND
  R²:   0.7823
  MAPE: 7.23%

Random Forest Evaluation:
  MAE:  52,341 VND
  RMSE: 78,923 VND
  R²:   0.8645
  MAPE: 4.42%

Stacking Evaluation:
  MAE:  48,765 VND
  RMSE: 71,234 VND
  R²:   0.8821
  MAPE: 4.11%
```

### Cross-Validation

```python
from sklearn.model_selection import cross_val_score

# Define models
models = {
    'Decision Tree': DecisionTreeRegressor(max_depth=10, random_state=42),
    'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42),
    'Stacking': StackingRegressor(
        estimators=[
            ('dt', DecisionTreeRegressor(max_depth=10, random_state=42)),
            ('rf', RandomForestRegressor(n_estimators=50, random_state=42))
        ],
        final_estimator=Ridge(),
        cv=5
    )
}

# 5-fold CV
for name, model in models.items():
    scores = cross_val_score(
        model, X_train, y_train,
        cv=5,
        scoring='neg_mean_squared_error',
        n_jobs=-1
    )
    
    rmse_scores = np.sqrt(-scores)
    print(f"{name}:")
    print(f"  CV RMSE: {rmse_scores.mean():,.0f} (+/- {rmse_scores.std():,.0f})")
```

### Feature Importance

```python
# Random Forest feature importance
feature_importance = pd.DataFrame({
    'Feature': X.columns,
    'Importance': rf_model.feature_importances_
}).sort_values('Importance', ascending=False)

print("\nTop 10 Important Features:")
print(feature_importance.head(10))

# Plot
plt.figure(figsize=(10, 6))
top_features = feature_importance.head(10)
plt.barh(top_features['Feature'], top_features['Importance'])
plt.xlabel('Importance')
plt.title('Top 10 Feature Importance (Random Forest)')
plt.tight_layout()
plt.show()
```

---

## Deployment Checklist

### Bước 1: Prepare Preprocessing Pipeline

```python
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

# Define transformers
numeric_features = ['Duration', 'Stops', 'Days_Left']
categorical_features = ['Airline Name', 'Departure City', 'Arrival City', 
                       'Travel Class', 'Departure_Time_Cat', 'Arrival_Time_Cat']

from sklearn.preprocessing import StandardScaler, OneHotEncoder

preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numeric_features),  # Optional for trees
        ('cat', OneHotEncoder(sparse=False, drop='first', 
                            handle_unknown='ignore'), categorical_features)
    ]
)

# Create full pipeline
full_pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('model', rf_model)  # or stacking_model
])

# Test
X_test_processed = full_pipeline.predict(X_test)
```

### Bước 2: Save Models

```python
import joblib

# Save best model
best_model = stacking_model

# Save model with preprocessor
model_data = {
    'model': best_model,
    'preprocessor': preprocessor,
    'feature_names': list(X.columns),
    'training_date': pd.Timestamp.now()
}

joblib.dump(model_data, 'model/StackingRegressor.pkl')
joblib.dump(model_data, 'model/RandomForestRegressor.pkl')
joblib.dump(model_data, 'model/DecisionTreeRegressor.pkl')
```

### Bước 3: Create Prediction Function

```python
def predict_price(flight_info):
    """
    flight_info = {
        'airline': 'Vietnam Airlines',
        'departureCity': 'Hà Nội',
        'arrivalCity': 'TP.HCM',
        'travelClass': 'Economy',
        'stops': 0,
        'duration': 2.5,
        'departureFullTime': '2024-05-15T10:30:00',
        'arrivalFullTime': '2024-05-15T12:30:00',
        'predictionDate': '2024-04-20T00:00:00'
    }
    """
    
    # Parse data
    departure_dt = pd.to_datetime(flight_info['departureFullTime'])
    arrival_dt = pd.to_datetime(flight_info['arrivalFullTime'])
    prediction_date = pd.to_datetime(flight_info['predictionDate'])
    
    # Calculate features
    days_left = (departure_dt.date() - prediction_date.date()).days
    departure_time_cat = categorize_time(departure_dt)
    arrival_time_cat = categorize_time(arrival_dt)
    
    # Create input dataframe
    input_df = pd.DataFrame({
        'Duration': [flight_info['duration']],
        'Stops': [flight_info['stops']],
        'Days_Left': [days_left],
        'Airline Name': [flight_info['airline']],
        'Departure City': [flight_info['departureCity']],
        'Arrival City': [flight_info['arrivalCity']],
        'Travel Class': [flight_info['travelClass']],
        'Departure_Time_Cat': [departure_time_cat],
        'Arrival_Time_Cat': [arrival_time_cat]
    })
    
    # Predict
    prediction = model.predict(input_df)[0]
    return {
        'predicted_price': round(prediction),
        'formatted_price': f"{round(prediction):,}".replace(",", ".")
    }
```

### Bước 4: Production Testing

```python
# Test with sample data
test_flight = {
    'airline': 'Vietnam Airlines',
    'departureCity': 'Hà Nội',
    'arrivalCity': 'TP.HCM',
    'travelClass': 'Economy',
    'stops': 0,
    'duration': 2.5,
    'departureFullTime': '2024-05-15T10:30:00',
    'arrivalFullTime': '2024-05-15T12:30:00',
    'predictionDate': '2024-04-20T00:00:00'
}

result = predict_price(test_flight)
print(result)
# {'predicted_price': 1250000, 'formatted_price': '1.250.000'}
```

---

## 📋 Checklist Triển Khai

- ✅ Data loading & preprocessing
- ✅ EDA & visualization
- ✅ Feature engineering
- ✅ Train-test split
- ✅ Model training (all 3 models)
- ✅ Evaluation & comparison
- ✅ Hyperparameter tuning (optional)
- ✅ Cross-validation
- ✅ Preprocessing pipeline created
- ✅ Models saved
- ✅ Prediction function tested
- ✅ Integration with Node.js app
- ✅ API testing with sample data
- ✅ Production monitoring setup

---

**Đây là workflow hoàn chỉnh cho dự án Flight Price Prediction!** ✨
