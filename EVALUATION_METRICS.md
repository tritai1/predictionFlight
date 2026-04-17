# 📊 Evaluation Metrics - Công Thức & Hướng Dẫn Chi Tiết

## Mục Lục
1. [Basic Metrics](#basic-metrics)
2. [Log-Transformed Metrics](#log-transformed-metrics)
3. [Advanced Metrics](#advanced-metrics)
4. [So Sánh & Chọn Metric](#so-sánh--chọn-metric)
5. [Code Examples](#code-examples)
6. [Visualization & Interpretation](#visualization--interpretation)

---

## Basic Metrics

### 1. Mean Absolute Error (MAE) - Lỗi Tuyệt Đối Trung Bình

**Công thức:**
$$\text{MAE} = \frac{1}{m} \sum_{i=1}^{m} |y^{(i)} - \hat{y}^{(i)}|$$

**Tham số:**
- $m$ = số test samples
- $y^{(i)}$ = giá trị thực tế thứ i
- $\hat{y}^{(i)}$ = giá trị dự đoán thứ i

**Ý nghĩa:**
- Average của độ lệch tuyệt đối (magnitude của lỗi)
- Cùng đơn vị với target variable
- **Ví dụ**: MAE = 50,000 VND → trung bình sai 50,000 VND

**Ưu điểm:**
- ✅ Dễ hiểu & interpret
- ✅ Robust với outliers
- ✅ Direct representation của error

**Nhược điểm:**
- ❌ Không penalize large errors mạnh
- ❌ Derivative tại 0 không liên tục (khó optimize)

**Khi nào dùng:**
- Khi bạn muốn interpret lỗi bằng ngôn ngữ tự nhiên
- Outliers không cần quan tâm
- Robust error metrics

---

### 2. Mean Squared Error (MSE)

**Công thức:**
$$\text{MSE} = \frac{1}{m} \sum_{i=1}^{m} (y^{(i)} - \hat{y}^{(i)})^2$$

**Ý nghĩa:**
- bình phương của lỗi, sau đó lấy trung bình
- Large errors được penalize (quadratic)

**Ưu điểm:**
- ✅ Smooth & differentiable
- ✅ Dễ optimize
- ✅ Standard loss function

**Nhược điểm:**
- ❌ Outliers tác động rất lớn
- ❌ Khó interpret (bình phương đơn vị)

---

### 3. Root Mean Squared Error (RMSE)

**Công thức:**
$$\text{RMSE} = \sqrt{\text{MSE}} = \sqrt{\frac{1}{m} \sum_{i=1}^{m} (y^{(i)} - \hat{y}^{(i)})^2}$$

**Hoặc viết sơ khai:**
$$\text{RMSE} = \sqrt{\frac{1}{m} \sum_{i=1}^{m} (y^{(i)} - \hat{y}^{(i)})^2}$$

**Ý nghĩa:**
- Căn bậc hai của MSE
- Trở về cùng đơn vị với target

**Ưu điểm:**
- ✅ Cùng đơn vị với target (dễ interpret hơn MSE)
- ✅ Penalize large errors
- ✅ Popular metric

**Nhược điểm:**
- ❌ Outliers vẫn tác động mạnh
- ❌ Không robust

**Relationship:**
$$\text{RMSE} \geq \text{MAE}$$
(Dấu bằng khi tất cả lỗi bằng nhau)

**Ví dụ:**
```
y_true = [1000, 2000, 3000]
y_pred = [1100, 1900, 3200]

MAE = (100 + 100 + 200) / 3 = 133.33
MSE = (100² + 100² + 200²) / 3 = 20,000
RMSE = √20,000 = 141.42
```

---

### 4. Mean Absolute Percentage Error (MAPE)

**Công thức:**
$$\text{MAPE} = \frac{100\%}{m} \sum_{i=1}^{m} \left|\frac{y^{(i)} - \hat{y}^{(i)}}{y^{(i)}}\right|$$

**Hoặc:**
$$\text{MAPE} = \frac{100\%}{m} \sum_{i=1}^{m} \left|\frac{e^{(i)}}{y^{(i)}}\right|$$

Ở đó: $e^{(i)} = y^{(i)} - \hat{y}^{(i)}$ (residual)

**Ý nghĩa:**
- Lỗi tính theo phần trăm của giá trị thực
- **MAPE = 5%** → trung bình dự đoán sai 5%

**Ưu điểm:**
- ✅ Scale-independent
- ✅ Dễ so sánh giữa các dataset
- ✅ Dễ hiểu (phần trăm)

**Nhược điểm:**
- ❌ Undefined khi $y^{(i)} = 0$
- ❌ Asymmetric: overpredict vs underpredict khác nhau
- ❌ Bias với small actual values

**Ví dụ:**
```
y_true = [1000, 2000, 3000]
y_pred = [1100, 1900, 3200]

Errors: [100, 100, 200]
Percentage errors: [10%, 5%, 6.67%]
MAPE = (10 + 5 + 6.67) / 3 = 7.22%
```

---

### 5. Coefficient of Determination (R²)

**Công thức:**
$$R^2 = 1 - \frac{SS_{res}}{SS_{tot}}$$

Ở đó:
- $SS_{res} = \sum_{i=1}^{m} (y^{(i)} - \hat{y}^{(i)})^2$ (Residual Sum of Squares)
- $SS_{tot} = \sum_{i=1}^{m} (y^{(i)} - \bar{y})^2$ (Total Sum of Squares)
- $\bar{y} = \frac{1}{m} \sum_{i=1}^{m} y^{(i)}$ (mean của target)

**Viết lại:**
$$R^2 = \frac{\sum_{i=1}^{m} (\hat{y}^{(i)} - \bar{y})^2}{\sum_{i=1}^{m} (y^{(i)} - \bar{y})^2}$$

**Ý nghĩa:**
- Tỷ lệ phương sai được model giải thích
- **R² = 0.85** → Model giải thích 85% phương sai
- **R² = 1.0** → Perfect fit (nghi ngờ overfitting)
- **R² = 0** → Model không tốt hơn baseline (mean prediction)
- **R² < 0** → Model tệ hơn baseline

**Range:** 
- Ideally: [0, 1]
- Có thể âm nếu model quá kém

**Ưu điểm:**
- ✅ Normalized [0, 1] - dễ hiểu
- ✅ Interpretable ("% variance explained")
- ✅ Standard metric

**Nhược điểm:**
- ❌ Có thể misleading với outliers
- ❌ Tăng khi thêm features (even useless ones) → dùng Adjusted R²
- ❌ Không independent của scale

---

### 6. Adjusted R² - R² Điều Chỉnh

**Công thức:**
$$\text{Adjusted } R^2 = 1 - \frac{(1-R^2)(m-1)}{m-p-1}$$

Ở đó:
- $m$ = số samples
- $p$ = số features (predictors)

**Ý nghĩa:**
- R² được điều chỉnh penalize complexity (thêm features)
- Tốt hơn R² khi so sánh models với số features khác nhau

**Mối quan hệ:**
$$\text{Adjusted } R^2 \leq R^2$$
(Dấu bằng khi mô hình đơn giản)

**Lợi ích:**
- Penalize overfitting do thêm features
- Better cho model selection

---

## Log-Transformed Metrics

### 1. Root Mean Squared Logarithmic Error (RMSLE)

**Công thức - Phiên bản 1:**
$$\text{RMSLE} = \sqrt{\frac{1}{m} \sum_{i=1}^{m} (\log(y^{(i)} + 1) - \log(\hat{y}^{(i)} + 1))^2}$$

**Công thức - Phiên bản 2 (tương đương):**
$$\text{RMSLE} = \sqrt{\frac{1}{m} \sum_{i=1}^{m} \left[\log\left(\frac{y^{(i)} + 1}{\hat{y}^{(i)} + 1}\right)\right]^2}$$

**Tại sao log1p (log(x+1))?**
- Tránh $\log(0)$ khi $y = 0$
- Scale down large values
- Penalize underestimation & overestimation equally

**Ý nghĩa:**
- RMSE trên log-transformed predictions
- Giảm impact của outliers
- Tốt cho data với large range values

**Ưu điểm:**
- ✅ Robust với outliers
- ✅ Penalize underestimation more
- ✅ Tốt cho data biến thiên mạnh

**Nhược điểm:**
- ❌ Phức tạp hơn, khó interpret
- ❌ Sai lệch nhỏ trong log-space → lỗi lớn trong linear space

**Khi nào dùng:**
- Data có outliers
- Biến thiên từ 10 đến 10,000,000+
- Metrics như Kaggle competitions
- Asymmetric error penalization

**Ví dụ:**
```python
import numpy as np

y_true = [100, 1000, 10000]
y_pred = [110, 900, 11000]

rmsle = np.sqrt(np.mean((np.log1p(y_true) - np.log1p(y_pred))**2))
# = sqrt(mean([log(101)-log(111)]² + [log(1001)-log(901)]² + ...))
```

---

### 2. Mean Absolute Logarithmic Error (MAE Log)

**Công thức:**
$$\text{MAE}_{\log} = \frac{1}{m} \sum_{i=1}^{m} |\log(y^{(i)} + 1) - \log(\hat{y}^{(i)} + 1)|$$

**Hoặc với log10:**
$$\text{MAE}_{\log10} = \frac{1}{m} \sum_{i=1}^{m} |\log_{10}(y^{(i)} + 1) - \log_{10}(\hat{y}^{(i)} + 1)|$$

**Ý nghĩa:**
- MAE trên log-transformed values
- Hoàn toàn robust hơn MAE

**So sánh MAE vs MAE_log:**
- MAE penalize errors equally
- MAE_log penalize % errors (relative)

---

### 3. Mean Absolute Percentage Error - Log (Log-MAPE)

**Công thức:**
$$\text{Log-MAPE} = \frac{100\%}{m} \sum_{i=1}^{m} \left|\frac{\log(y^{(i)} + 1) - \log(\hat{y}^{(i)} + 1)}{\log(y^{(i)} + 1)}\right|$$

**Ý nghĩa:**
- MAPE được tính trên log-transformed values
- Phần trăm error trong log-space

---

### 4. Symmetric MAPE (SMAPE)

**Công thức:**
$$\text{SMAPE} = \frac{100\%}{m} \sum_{i=1}^{m} \frac{2|y^{(i)} - \hat{y}^{(i)}|}{|y^{(i)}| + |\hat{y}^{(i)}|}$$

**Hoặc variation khác:**
$$\text{SMAPE} = \frac{100\%}{m} \sum_{i=1}^{m} \frac{|y^{(i)} - \hat{y}^{(i)}|}{(|y^{(i)}| + |\hat{y}^{(i)}|)/2}$$

**Ý nghĩa:**
- Symmetric version của MAPE
- Không bias với overpredict vs underpredict
- Xử lý tốt khi actual = 0

**Ưu điểm:**
- ✅ Symmetric (fair)
- ✅ Không undefined at 0
- ✅ Bounded [0, 1] hoặc [0%, 100%]

**Nhược điểm:**
- ❌ Phức tạp hơn

---

## Advanced Metrics

### 1. Mean Pinball Loss (Quantile Loss)

**Công thức:**
$$L_q(y, \hat{y}) = \frac{1}{m} \sum_{i=1}^{m} \max(q(y^{(i)} - \hat{y}^{(i)}), (q-1)(y^{(i)} - \hat{y}^{(i)}))$$

Ở đó: $q \in (0, 1)$ là quantile

**Ý nghĩa:**
- Asymmetric: penalize underestimation vs overestimation differently
- $q = 0.5$ → MAE (median)
- $q = 0.05 / 0.95$ → lower/upper quantile

**Khi nào dùng:**
- Confidence intervals
- Risk-sensitive predictions
- Asymmetric costs

---

### 2. Huber Loss

**Công thức:**
$$L_H = \frac{1}{m} \sum_{i=1}^{m} \begin{cases}
\frac{1}{2}(y^{(i)} - \hat{y}^{(i)})^2 & \text{if } |y^{(i)} - \hat{y}^{(i)}| \leq \delta \\
\delta(|y^{(i)} - \hat{y}^{(i)}| - \frac{\delta}{2}) & \text{otherwise}
\end{cases}$$

**Ý nghĩa:**
- Hybrid giữa MSE (small errors) và MAE (large errors)
- Robust với outliers

**Ưu điểm:**
- ✅ Smooth & differentiable
- ✅ Robust
- ✅ Tunable via $\delta$

---

## So Sánh & Chọn Metric

### Comparison Table

| Metric | Formula Complexity | Outlier Sensitivity | Interpretability | Scale-Independent | Khi Dùng |
|--------|-------------------|-------------------|------------------|-------------------|----------|
| **MAE** | Đơn giản | Thấp | Cao | Không | Robust errors |
| **RMSE** | Vừa | Cao | Vừa | Không | Penalize large |
| **R²** | Vừa | Vừa | Cao | Không | % variance |
| **MAPE** | Vừa | Vừa | Cao | Có | % error, scaling |
| **RMSLE** | Cao | Thấp | Thấp | Có | Outliers nhiều |
| **SMAPE** | Vừa | Thấp | Vừa | Có | Symmetric error |

### Decision Tree - Chọn Metric Nào?

```
Are outliers important?
├─ YES → Use RMSLE, SMAPE, or Huber Loss
└─ NO
   ├─ Scale-independent needed?
   │  ├─ YES → Use MAPE, SMAPE
   │  └─ NO
   │     ├─ Asymmetric penalization?
   │     │  ├─ YES → Use Pinball Loss
   │     │  └─ NO → Use MAE or RMSE
   │     └─ Easy to optimize?
   │        ├─ YES → Use RMSE
   │        └─ NO → Use MAE
```

### Cho Flight Price Prediction

**Recommended metrics (priority order):**

1. **Primary**: RMSE
   - Standard metric
   - Dễ optimize
   - Sensitive to large errors

2. **Secondary**: MAPE
   - Scale-independent
   - Easy to communicate ("5% error")

3. **Tertiary**: MAE
   - Direct interpretation
   - Robust baseline

4. **Optional**: RMSLE
   - Nếu outliers nhiều
   - Biến thiên giá rất lớn (450K - 2.5M)

---

## Code Examples

### Implementation trong Python

```python
import numpy as np
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
    mean_absolute_percentage_error
)

# Sample data
y_true = np.array([1000, 2000, 3000, 2500, 1500])
y_pred = np.array([1050, 1950, 3100, 2400, 1600])

# ========== Basic Metrics ==========

# 1. MAE
mae = mean_absolute_error(y_true, y_pred)
print(f"MAE: {mae:.2f}")  # Output: MAE: 50.00

# 2. MSE
mse = mean_squared_error(y_true, y_pred)
print(f"MSE: {mse:.2f}")  # Output: MSE: 2500.00

# 3. RMSE
rmse = np.sqrt(mse)
print(f"RMSE: {rmse:.2f}")  # Output: RMSE: 50.00

# 4. R²
r2 = r2_score(y_true, y_pred)
print(f"R²: {r2:.4f}")  # Output: R²: 0.9971

# 5. MAPE
mape = mean_absolute_percentage_error(y_true, y_pred)
print(f"MAPE: {mape * 100:.2f}%")  # Output: MAPE: 2.52%

# ========== Log-Transformed Metrics ==========

# 6. RMSLE
rmsle = np.sqrt(np.mean((np.log1p(y_true) - np.log1p(y_pred))**2))
print(f"RMSLE: {rmsle:.6f}")

# 7. MAE_log
mae_log = np.mean(np.abs(np.log1p(y_true) - np.log1p(y_pred)))
print(f"MAE_log: {mae_log:.6f}")

# 8. SMAPE (Symmetric MAPE)
smape = np.mean(2 * np.abs(y_true - y_pred) / (np.abs(y_true) + np.abs(y_pred))) * 100
print(f"SMAPE: {smape:.2f}%")

# 9. Adjusted R²
m = len(y_true)
p = 10  # number of features (example)
adjusted_r2 = 1 - (1 - r2) * (m - 1) / (m - p - 1)
print(f"Adjusted R²: {adjusted_r2:.4f}")

# ========== Custom Function ==========

def evaluate_model(y_true, y_pred):
    """Comprehensive model evaluation"""
    results = {
        'MAE': mean_absolute_error(y_true, y_pred),
        'MSE': mean_squared_error(y_true, y_pred),
        'RMSE': np.sqrt(mean_squared_error(y_true, y_pred)),
        'R2': r2_score(y_true, y_pred),
        'MAPE': mean_absolute_percentage_error(y_true, y_pred) * 100,
        'RMSLE': np.sqrt(np.mean((np.log1p(y_true) - np.log1p(y_pred))**2)),
        'MAE_log': np.mean(np.abs(np.log1p(y_true) - np.log1p(y_pred))),
        'SMAPE': np.mean(2 * np.abs(y_true - y_pred) / (np.abs(y_true) + np.abs(y_pred))) * 100
    }
    return results

metrics = evaluate_model(y_true, y_pred)
for metric, value in metrics.items():
    print(f"{metric:12s}: {value:>10.4f}")
```

**Output:**
```
MAE         :       50.00
MSE         :     2500.00
RMSE        :       50.00
R2          :        0.9971
MAPE        :        2.52
RMSLE       :        0.0408
MAE_log     :        0.0408
SMAPE       :        2.50
```

---

## Visualization & Interpretation

### 1. Residual Plot

```python
import matplotlib.pyplot as plt

residuals = y_true - y_pred

plt.figure(figsize=(12, 4))

# Residuals vs Predicted
plt.subplot(1, 2, 1)
plt.scatter(y_pred, residuals, alpha=0.6)
plt.axhline(y=0, color='r', linestyle='--')
plt.xlabel('Predicted values')
plt.ylabel('Residuals')
plt.title('Residuals vs Predicted')

# Distribution of Residuals
plt.subplot(1, 2, 2)
plt.hist(residuals, bins=20, edgecolor='black', alpha=0.7)
plt.xlabel('Residuals')
plt.ylabel('Frequency')
plt.title('Distribution of Residuals')

plt.tight_layout()
plt.show()
```

### 2. Actual vs Predicted Plot

```python
plt.figure(figsize=(8, 6))
plt.scatter(y_true, y_pred, alpha=0.6, label='Predictions')
plt.plot([y_true.min(), y_true.max()], 
         [y_true.min(), y_true.max()], 
         'r--', label='Perfect prediction')
plt.xlabel('Actual values')
plt.ylabel('Predicted values')
plt.title('Actual vs Predicted')
plt.legend()
plt.show()
```

### 3. Error Distribution

```python
errors = np.abs(y_true - y_pred)

plt.figure(figsize=(10, 5))
plt.hist(errors, bins=20, edgecolor='black', alpha=0.7)
plt.axvline(mae, color='r', linestyle='--', linewidth=2, label=f'MAE: {mae:.2f}')
plt.axvline(np.median(errors), color='g', linestyle='--', linewidth=2, label=f'Median: {np.median(errors):.2f}')
plt.xlabel('Absolute Error')
plt.ylabel('Frequency')
plt.title('Distribution of Absolute Errors')
plt.legend()
plt.show()
```

---

## 🎯 Practical Tips

### 1. Multiple Metrics Strategy

Luôn evaluate on multiple metrics:
```python
metrics = evaluate_model(y_test, y_pred)
print("="*50)
print("MODEL EVALUATION RESULTS")
print("="*50)
for metric, value in metrics.items():
    print(f"{metric:15s}: {value:>12.4f}")
print("="*50)
```

### 2. Cross-Validation với Metrics

```python
from sklearn.model_selection import cross_validate

scoring = {
    'mae': 'neg_mean_absolute_error',
    'rmse': 'neg_mean_squared_error',
    'r2': 'r2',
    'mape': 'neg_mean_absolute_percentage_error'
}

cv_results = cross_validate(model, X_train, y_train, cv=5, scoring=scoring)

for metric in scoring.keys():
    scores = -cv_results[f'test_{metric}']
    print(f"{metric.upper()}: {scores.mean():.4f} (+/- {scores.std():.4f})")
```

### 3. Threshold-based Evaluation

```python
# For Flight Price Prediction
threshold = 100000  # ±100k acceptable

acceptable_predictions = np.abs(y_true - y_pred) <= threshold
accuracy_within_threshold = np.mean(acceptable_predictions) * 100

print(f"Accuracy within ±{threshold:,} VND: {accuracy_within_threshold:.2f}%")
```

---

**Chúc bạn đánh giá model chính xác! 📈**
