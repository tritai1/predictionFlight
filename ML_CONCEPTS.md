# 📚 Kiến Thức Machine Learning Nâng Cao - Flight Price Prediction

## Mục Lục
1. [Regression & Forecasting](#regression--forecasting)
2. [Decision Trees & Tree-Based Models](#decision-trees--tree-based-models)
3. [Ensemble Methods](#ensemble-methods)
4. [Feature Engineering Deep Dive](#feature-engineering-deep-dive)
5. [Model Evaluation & Selection](#model-evaluation--selection)
6. [Hyperparameter Tuning](#hyperparameter-tuning)
7. [Practical Considerations](#practical-considerations)

---

## Regression & Forecasting

### 1.1 Supervised Learning: Regression (Hồi Quy)

**Định nghĩa**: Dự đoán giá trị liên tục dựa trên input features.

```
Input Features (X)          Target Variable (y)
┌─────────────────┐         ┌──────────────────┐
│ Airline: VA     │ ────→   │ Price: 1,250,000 │
│ City Pair: HN-HCM        │ (liên tục)        │
│ Days Left: 25   │         └──────────────────┘
│ Duration: 2.5h  │
└─────────────────┘
```

### 1.2 Regression vs Classification

| Aspect | Regression | Classification |
|--------|-----------|------------------|
| **Output** | Liên tục (real numbers) | Rời rạc (categories) |
| **Example** | $1,250,000 | Rẻ / Vừa / Đắt |
| **Functions** | Linear, Polynomial | Logistic, SVM, Trees |
| **Metrics** | MAE, RMSE, R² | Accuracy, Precision, Recall |
| **Loss** | MSE, MAE | Cross-entropy, Hinge loss |

### 1.3 Linear Regression Basics

**Công thức:**
$$\hat{y} = b_0 + b_1 x_1 + b_2 x_2 + ... + b_n x_n$$

**Cost Function (Mean Squared Error):**
$$J = \frac{1}{2m} \sum_{i=1}^{m} (h_\theta(x^{(i)}) - y^{(i)})^2$$

**Limitations:**
- ❌ Giả định quan hệ tuyến tính
- ❌ Không xử lý non-linear patterns tốt
- ❌ Tree-based models thường tốt hơn

**Trong dự án này**: Không sử dụng Linear Regression, thay vào đó dùng tree-based models

### 1.4 Time-Series & Temporal Features

Giá máy bay phụ thuộc vào **thời gian:**

```
Timeline:
├─ t-90 days: Giá rẻ nhất (booking sớm)
├─ t-30 days: Giá bắt đầu tăng
├─ t-7 days:  Giá cao (last-minute surge)
└─ t-1 days:  Giá rất cao → Đỉnh cao
```

**Feature**: `days_left = departure_date - booking_date`

**Signal**: Negative correlation zwischen `days_left` và `price`
- 60 days ahead → ~$800
- 7 days ahead → ~$1,200
- 1 day ahead → ~$1,500

---

## Decision Trees & Tree-Based Models

### 2.1 Decision Tree Regressor

**Cấu trúc:**
```
                    Stops ≤ 0.5?
                   /           \
                 YES             NO
                 /                 \
          Duration ≤ 2?       Duration ≤ 3?
          /        \          /        \
        YES        NO       YES        NO
        /            \      /            \
    Predict       Predict Predict    Predict
    900K          1.1M     950K       1.3M
```

**Cách hoạt động:**
1. Tìm feature & threshold tốt nhất để split
2. Dùng Gini impurity hoặc MSE để đo chất lượng split
3. Tạo child nodes
4. Lặp lại đến khi stopping criteria

**Stopping Criteria:**
- Độ sâu tối đa (max_depth)
- Số sample tối thiểu (min_samples_split)
- Không có improvement thêm nữa

### 2.2 Advantages & Disadvantages

**✅ Ưu điểm:**
- Dễ hiểu & visualize
- Không cần feature scaling
- Xử lý categorical features tốt
- Nhanh (O(n * m * log n))
- Non-parametric (không giả định distribution)

**❌ Nhược điểm:**
- Dễ overfit (quá chuyên biệt)
- Không ổn định (nhạy với data changes)
- Bias cao khi data nhiều
- Có thể tạo biased trees với imbalanced data

### 2.3 Regularization Techniques

**Giảm Overfitting:**

```python
model = DecisionTreeRegressor(
    max_depth=10,              # Hạn chế độ sâu
    min_samples_split=10,      # Tối thiểu 10 samples để split
    min_samples_leaf=5,        # Tối thiểu 5 samples trong leaf
    min_weight_fraction_leaf=0.05  # Weighted fraction
)
```

**Pruning:**
- Cost complexity pruning (post-pruning)
- Xóa subtrees không cải thiện validation score

---

## Ensemble Methods

### 3.1 Why Ensemble Learning?

**Wisdom of Crowds Principle:**
```
             Model 1: 1.2M
             Model 2: 1.25M
             Model 3: 1.18M
             ───────────────
    Average: 1.21M ← More stable!
```

Kết hợp nhiều models yếu → model mạnh

### 3.2 Bagging (Bootstrap Aggregating)

**Concept:**
```
Original Data (n samples)
├─ Sample 1 (with replacement) ──→ Train Tree 1
├─ Sample 2 (with replacement) ──→ Train Tree 2
├─ Sample 3 (with replacement) ──→ Train Tree 3
└─ Sample N (with replacement) ──→ Train Tree N

Predictions:
Tree 1: 1.2M
Tree 2: 1.25M
Tree 3: 1.18M
────────────
Average: 1.21M ← Final prediction
```

**Formulation:**
```
ŷ_bagging = (1/B) * Σ(ŷ_b)  where b = 1 to B
```

**Giảm Variance:**
- Individual trees: High variance, low bias
- Average multiple trees: Low variance, medium bias
- Tradeoff tốt cho minimize error

### 3.3 Random Forest

**Enhancement to Bagging:**

1. **Bootstrap Sampling**: Random samples with replacement
2. **Random Feature Subsets**: Mỗi split chỉ xét `m = √n` features
3. **Multiple Independent Trees**: Train độc lập
4. **Average Predictions**: Final output = mean predictions

**Why Random Subsets?**
- Giảm correlation giữa các trees
- Tăng diversity
- Cảm mà mỗi feature

```python
from sklearn.ensemble import RandomForestRegressor

rf = RandomForestRegressor(
    n_estimators=100,      # Số trees
    max_depth=15,          # Độ sâu tối đa
    min_samples_split=5,   # Split nếu n >= 5
    min_samples_leaf=2,    # Leaf phải có >= 2 samples
    max_features='sqrt',   # √n features/split
    random_state=42,       # Reproducibility
    n_jobs=-1              # Parallel processing
)
```

**Random Forest trong dự án:**
- `n_estimators=100`: 100 trees để voting
- Tunable depth để control overfitting
- Parallel để xử lý nhanh

### 3.4 Stacking Regressor

**Concept - Meta-Learning:**

```
Level 0 (Base Models):
┌─────────────────────────────────┐
│ Random Forest     │ Decision Tree│
│ SVR               │ Gradient...  │
└─────────────────────────────────┘
         ↓ Generate meta-features
┌─────────────────────────────────┐
│ Predictions: [1.2M, 1.15M, ...]│
└─────────────────────────────────┘
         ↓
Level 1 (Meta-Learner):
┌─────────────────────────────────┐
│ Linear Regression / Ridge       │
│ (learns weighted combination)   │
└─────────────────────────────────┘
         ↓
Final Prediction: 1.18M (weighted avg)
```

**Implementation Pattern:**
```python
from sklearn.ensemble import StackingRegressor
from sklearn.linear_model import Ridge

base_models = [
    ('rf', RandomForestRegressor(n_estimators=50)),
    ('dt', DecisionTreeRegressor(max_depth=10)),
    ('svr', SVR(kernel='rbf'))
]

meta_learner = Ridge(alpha=1.0)

stacking = StackingRegressor(
    estimators=base_models,
    final_estimator=meta_learner,
    cv=5  # 5-fold cross-validation
)
```

**Ưu & Nhược:**

| + | - |
|---|---|
| Higher accuracy | Complex, hard to interpret |
| Combines strengths | Slow training |
| Less variance | Risk of overfitting |
| Flexible | Requires tuning |

---

## Feature Engineering Deep Dive

### 4.1 Types of Features

**Numerical Features:**
- Continuous: Duration (2.5h), Price (1.2M)
- Discrete: Stops (0, 1, 2), Days_left (1, 2, 3...)

**Categorical Features:**
- Nominal: Airline (VA, VJ, AA) - no order
- Ordinal: Travel_class (Economy < Business) - has order

### 4.2 Part 1: Feature Creation

**Temporal Features:**
```python
# From booking_date & departure_date
days_left = (departure_date - booking_date).days
weeks_left = days_left // 7
is_weekend = departure_date.weekday() >= 5
is_holiday = departure_date in holidays

# Time categorization
hour = departure_time.hour
time_category = 'Sáng sớm' if 0 <= hour < 6 else ...
```

**Interaction Features:**
```python
# Combine multiple features
is_short_flight_economy = (duration < 2) & (travel_class == 'Economy')
surge_factor = days_left * is_peak_season

# Allows model to capture non-linear relationships
```

**Domain-Specific:**
```python
# Flight characteristics
distance = calculate_distance(departure_city, arrival_city)
is_popular_route = (departure_city, arrival_city) in TOP_ROUTES
seasonal_demand = get_season_multiplier(departure_date)
```

### 4.3 One-Hot Encoding for Categorical

**Problem:** Trees không hiểu strings

```
Original:
Airline: 'VA', 'VJ', 'BA'

After One-Hot Encoding:
Airline_VA | Airline_VJ | Airline_BA
    1      |     0      |     0
    0      |     1      |     0
    0      |     0      |     1
```

**Implementation:**
```python
from sklearn.preprocessing import OneHotEncoder

encoder = OneHotEncoder(
    sparse=False,           # Dense array
    drop='first',           # Avoid multicollinearity
    handle_unknown='ignore' # New categories → all zeros
)

X_encoded = encoder.fit_transform(X_categorical)
```

**In Pipeline:**
```python
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

preprocessor = ColumnTransformer(
    transformers=[
        ('cat', OneHotEncoder(drop='first'), 
         ['Airline', 'Departure City', 'Arrival City']),
        ('num', StandardScaler(), 
         ['Duration', 'Stops', 'days_left'])
    ]
)

pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('model', RandomForestRegressor())
])
```

### 4.4 Feature Selection

**Importance dari Tree Models:**
```python
# After training
importances = model.feature_importances_

feature_importance = pd.DataFrame({
    'Feature': X.columns,
    'Importance': importances
}).sort_values('Importance', ascending=False)

# Top features:
# - days_left (0.35)
# - Departure_City (0.25)
# - Duration (0.20)
# - Travel_Class (0.15)
# - Others (0.05)
```

**Remove Low-Importance Features:**
```python
threshold = 0.01
important_features = feature_importance[
    feature_importance['Importance'] > threshold
]['Feature'].tolist()

X_selected = X[important_features]
```

---

## Model Evaluation & Selection

### 5.1 Evaluation Metrics

#### **MAE (Mean Absolute Error)**
$$MAE = \frac{1}{m} \sum_{i=1}^{m} |y^{(i)} - \hat{y}^{(i)}|$$

**Interpretation**: Average error in VND
- MAE = 50,000 → Model off by ~50K on average
- **Advantage**: Easy to interpret
- **Disadvantage**: Doesn't penalize large errors more

#### **MSE & RMSE**
$$MSE = \frac{1}{m} \sum_{i=1}^{m} (y^{(i)} - \hat{y}^{(i)})^2$$

$$RMSE = \sqrt{MSE}$$

- **Penalizes larger errors more** (quadratic)
- RMSE = 75,000 → typical error around 75K
- **Advantage**: Differentiable, used in optimization
- **Disadvantage**: Outliers influence heavily

#### **R² (Coefficient of Determination)**
$$R^2 = 1 - \frac{SS_{res}}{SS_{tot}} = 1 - \frac{\sum(y^{(i)} - \hat{y}^{(i)})^2}{\sum(y^{(i)} - \bar{y})^2}$$

- Range: [0, 1] or even negative for bad models
- **Interpretation**: 
  - R² = 0.85 → Model explains 85% of variance
  - R² < 0 → Worse than using mean!

#### **MAPE (Mean Absolute Percentage Error)**
$$MAPE = \frac{100\%}{m} \sum_{i=1}^{m} \left|\frac{y^{(i)} - \hat{y}^{(i)}}{y^{(i)}}\right|$$

- Percentage error, scale-independent
- MAPE = 5% → Model off by 5% on average
- **Problem**: Undefined when y=0

### 5.2 Cross-Validation

**Why CV?** Estimate model performance on unseen data

```
Original Data (1000 samples)
│
├─ Fold 1:  Train on [2,3,4,5], Test on [1]
├─ Fold 2:  Train on [1,3,4,5], Test on [2]
├─ Fold 3:  Train on [1,2,4,5], Test on [3]
├─ Fold 4:  Train on [1,2,3,5], Test on [4]
└─ Fold 5:  Train on [1,2,3,4], Test on [5]

Average CV Score = (Score1 + Score2 + ... + Score5) / 5
```

**k-Fold Cross-Validation:**
```python
from sklearn.model_selection import cross_val_score

scores = cross_val_score(
    RandomForestRegressor(n_estimators=100),
    X, y,
    cv=5,
    scoring='neg_mean_squared_error'
)
print(f"CV Score: {-scores.mean():.4f} (+/- {scores.std():.4f})")
```

### 5.3 Train-Test Split Strategy

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,      # 80-20 split
    random_state=42     # Reproducibility
)

# Train phase
model.fit(X_train, y_train)

# Evaluation phase (unseen data)
train_score = model.score(X_train, y_train)  # ~0.95
test_score = model.score(X_test, y_test)     # ~0.87

# Gap indicates overfitting
if train_score - test_score > 0.10:
    print("⚠️ Model is overfitting")
```

---

## Hyperparameter Tuning

### 6.1 What are Hyperparameters?

| Hyperparameter | Effect | Range |
|----------------|--------|-------|
| `n_estimators` | Số trees | [50, 200, 500] |
| `max_depth` | Độ sâu tối đa | [10, 20, None] |
| `min_samples_split` | Min để split | [2, 5, 10] |
| `min_samples_leaf` | Min trong leaf | [1, 2, 5] |
| `max_features` | Features per split | ['sqrt', 'log2', None] |
| `learning_rate` | Boost rate (XGBoost) | [0.01, 0.1, 1.0] |

### 6.2 Grid Search

**Exhaustive search over parameter spaces:**

```python
from sklearn.model_selection import GridSearchCV

param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [10, 20, None],
    'min_samples_split': [2, 5, 10],
    'max_features': ['sqrt', 'log2']
}

grid_search = GridSearchCV(
    RandomForestRegressor(),
    param_grid,
    cv=5,
    scoring='neg_mean_squared_error',
    n_jobs=-1  # Parallel
)

grid_search.fit(X_train, y_train)

print(f"Best params: {grid_search.best_params_}")
print(f"Best CV score: {-grid_search.best_score_:.4f}")

# Use best model
best_model = grid_search.best_estimator_
test_score = best_model.score(X_test, y_test)
```

### 6.3 Random Search

**Более efficient untuk large param spaces:**

```python
from sklearn.model_selection import RandomizedSearchCV
from scipy.stats import randint, uniform

param_dist = {
    'n_estimators': randint(50, 500),
    'max_depth': randint(5, 50),
    'min_samples_split': randint(2, 20),
    'max_features': ['sqrt', 'log2']
}

random_search = RandomizedSearchCV(
    RandomForestRegressor(),
    param_dist,
    n_iter=20,  # Try 20 random combinations
    cv=5,
    random_state=42,
    n_jobs=-1
)

random_search.fit(X_train, y_train)
```

### 6.4 Tuning Strategy

**Workflow:**
```
1. Baseline model
2. Cross-validate
3. Identify bottleneck
4. Tune relevant params
5. Re-validate
6. Iterate
```

---

## Practical Considerations

### 7.1 Data Quality Issues

**Missing Values:**
```python
# Count missing
print(df.isnull().sum())

# Strategies:
# 1. Drop rows with missing values (if < 5%)
df_clean = df.dropna()

# 2. Imputation - Mean/Median (numerical)
from sklearn.impute import SimpleImputer
imputer = SimpleImputer(strategy='median')
X_imputed = imputer.fit_transform(X)

# 3. Imputation - Mode (categorical)
imputer_cat = SimpleImputer(strategy='most_frequent')

# 4. Forward-fill (temporal data)
df['price'] = df['price'].fillna(method='ffill')
```

**Outliers:**
```python
# IQR method
Q1 = data.quantile(0.25)
Q3 = data.quantile(0.75)
IQR = Q3 - Q1

outliers = (data < Q1 - 1.5*IQR) | (data > Q3 + 1.5*IQR)
data_clean = data[~outliers]

# Z-score method
from scipy import stats
z_scores = np.abs(stats.zscore(data))
data_clean = data[z_scores < 3]  # Keep if |z| < 3
```

### 7.2 Model Persistence

**Save/Load Models:**
```python
import joblib

# Save after training
joblib.dump(model, 'model.pkl')

# Load for prediction
model = joblib.load('model.pkl')

# Save with preprocessing pipeline
pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('model', trained_model)
])
joblib.dump(pipeline, 'full_pipeline.pkl')
```

### 7.3 Avoiding Common Mistakes

| Mistake | Problem | Solution |
|---------|---------|----------|
| **Data Leakage** | Test data info leaks to training | Split BEFORE preprocessing |
| **Scaling Trees** | Waste of computation | Trees don't need scaling |
| **Wrong Evaluation** | Misleading performance | Use proper test set |
| **Hypertuning on Test** | Inflated scores | Use CV, separate test set |
| **Class Imbalance** (if classification) | Model biased to majority | Use stratified split, weights |
| **No Baseline** | Can't judge model quality | Compare to mean/simple model |

### 7.4 Deployment Checklist

- ✅ Model trained on full training data
- ✅ Saved with same version of libraries
- ✅ Preprocessor included with model
- ✅ Input validation implemented
- ✅ Error handling for edge cases
- ✅ Monitoring & logging setup
- ✅ Documented features & constraints
- ✅ Tested with real-world data

---

## 🎯 Áp Dụng cho Flight Price Prediction

### Workflow Hoàn Chỉnh:

```
1. PREPARATION
   ├─ Load data
   ├─ Handle missing values
   └─ Initial exploration

2. FEATURE ENGINEERING
   ├─ Create temporal features (days_left, time_cat)
   ├─ One-hot encode categorical cols
   ├─ Feature scaling (if needed)
   └─ Feature selection

3. TRAIN-TEST SPLIT
   └─ 80-20 random split

4. MODEL TRAINING
   ├─ Random Forest
   ├─ Decision Tree
   ├─ Stacking (combining above)
   └─ Hyperparameter tuning

5. EVALUATION
   ├─ Calculate RMSE, MAE, R²
   ├─ Cross-validation check
   └─ Comparison between models

6. OPTIMIZATION
   ├─ GridSearch for best params
   ├─ Re-train with best params
   └─ Final test set evaluation

7. DEPLOYMENT
   ├─ Save models
   ├─ Create preprocessing pipeline
   ├─ Integrate with Node.js API
   └─ Monitor performance
```

### Key Insights for Flight Pricing:

1. **days_left is crucial**: Strong negative correlation with price
2. **Route matters**: Popular routes have different pricing
3. **Seasonal effects**: Holiday periods spike prices
4. **Non-linear relationships**: Ensemble models capture better
5. **Ensemble > Single model**: Stacking performs best

---

**Đây là kiến thức cốt lõi về ML models sử dụng trong dự án!** 🎓
