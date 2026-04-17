# 📐 Quick Reference - Evaluation Metrics Formulas

## All Formulas at a Glance

### Basic Regression Metrics

**Mean Absolute Error (MAE):**
$$\text{MAE} = \frac{1}{m} \sum_{i=1}^{m} |y_i - \hat{y}_i|$$

**Mean Squared Error (MSE):**
$$\text{MSE} = \frac{1}{m} \sum_{i=1}^{m} (y_i - \hat{y}_i)^2$$

**Root Mean Squared Error (RMSE):**
$$\text{RMSE} = \sqrt{\frac{1}{m} \sum_{i=1}^{m} (y_i - \hat{y}_i)^2}$$

**Mean Absolute Percentage Error (MAPE):**
$$\text{MAPE} = \frac{100}{m} \sum_{i=1}^{m} \left|\frac{y_i - \hat{y}_i}{y_i}\right|$$

**R-Squared (Coefficient of Determination):**
$$R^2 = 1 - \frac{\sum(y_i - \hat{y}_i)^2}{\sum(y_i - \bar{y})^2}$$

**Adjusted R-Squared:**
$$\text{Adj } R^2 = 1 - \frac{(1-R^2)(n-1)}{n-p-1}$$

---

### Log-Transformed Metrics (Using log1p)

**Root Mean Squared Logarithmic Error (RMSLE):**
$$\text{RMSLE} = \sqrt{\frac{1}{m} \sum_{i=1}^{m} \left[\ln(y_i + 1) - \ln(\hat{y}_i + 1)\right]^2}$$

**Mean Absolute Logarithmic Error (MAE_log):**
$$\text{MAE}_{\log} = \frac{1}{m} \sum_{i=1}^{m} \left|\ln(y_i + 1) - \ln(\hat{y}_i + 1)\right|$$

**Symmetric Mean Absolute Percentage Error (SMAPE):**
$$\text{SMAPE} = \frac{100}{m} \sum_{i=1}^{m} \frac{2|y_i - \hat{y}_i|}{|y_i| + |\hat{y}_i|}$$

**Log-Transformed MAPE:**
$$\text{MAPE}_{\log} = \frac{100}{m} \sum_{i=1}^{m} \left|\frac{\ln(y_i + 1) - \ln(\hat{y}_i + 1)}{\ln(y_i + 1)}\right|$$

---

### Advanced Loss Functions

**Quantile Loss (Pinball Loss):**
$$L_q = \frac{1}{m} \sum_{i=1}^{m} \max(q(y_i - \hat{y}_i), (q-1)(y_i - \hat{y}_i))$$

**Huber Loss:**
$$L_H = \frac{1}{m} \sum_{i=1}^{m} \begin{cases}
\frac{1}{2}(y_i - \hat{y}_i)^2 & \text{if } |y_i - \hat{y}_i| \leq \delta \\
\delta(|y_i - \hat{y}_i| - \frac{\delta}{2}) & \text{otherwise}
\end{cases}$$

---

## Python Code - Copy & Paste

```python
import numpy as np
from sklearn.metrics import (
    mean_absolute_error, 
    mean_squared_error, 
    r2_score,
    mean_absolute_percentage_error
)

# Sample predictions
y_true = np.array([1000, 2000, 3000, 2500, 1500])
y_pred = np.array([1050, 1950, 3100, 2400, 1600])

# ===== BASIC METRICS =====
mae = mean_absolute_error(y_true, y_pred)
mse = mean_squared_error(y_true, y_pred)
rmse = np.sqrt(mse)
mape = mean_absolute_percentage_error(y_true, y_pred) * 100
r2 = r2_score(y_true, y_pred)

print(f"MAE:  {mae:.2f}")
print(f"RMSE: {rmse:.2f}")
print(f"MAPE: {mape:.2f}%")
print(f"R²:   {r2:.4f}")

# ===== LOG-TRANSFORMED METRICS =====
rmsle = np.sqrt(np.mean((np.log1p(y_true) - np.log1p(y_pred))**2))
mae_log = np.mean(np.abs(np.log1p(y_true) - np.log1p(y_pred)))
smape = np.mean(2 * np.abs(y_true - y_pred) / (np.abs(y_true) + np.abs(y_pred))) * 100

print(f"\nRMSLE:  {rmsle:.6f}")
print(f"MAE_log: {mae_log:.6f}")
print(f"SMAPE:  {smape:.2f}%")

# ===== ADJUSTED R² =====
n = len(y_true)
p = 10  # number of features
adj_r2 = 1 - (1 - r2) * (n - 1) / (n - p - 1)
print(f"Adj R²: {adj_r2:.4f}")
```

---

## When to Use Each Metric

| Metric | Best For | When NOT to Use |
|--------|----------|-----------------|
| MAE | Robust, easy to interpret | Outliers important |
| RMSE | Optimization, penalize large errors | Too sensitive to outliers |
| R² | % variance explained | Comparing different datasets |
| MAPE | Percentage errors, scaling | When y=0 is possible |
| RMSLE | Outliers, large range values | When errors are small |
| SMAPE | Symmetric error penalization | Small values close to 0 |

---

## Relationship Between Metrics

**Mathematical Relationships:**
- $\text{RMSE} \geq \text{MAE}$ (always, equality when all errors equal)
- $\text{RMSLE} \approx \text{log}(\text{RMSE})$ (logarithmic transformation)
- $R^2 = 1 - \frac{\text{MSE}}{\text{Var}(y)}$ (connected via variance)
- $\text{Adj } R^2 < R^2$ (always, due to complexity penalty)

**Ordering Relationship:**
$$\text{MAPE (\%)} \approx 100 \times \frac{\text{MAE}}{\text{mean}(y)}$$

---

## Common Thresholds for Flight Price Prediction

Given price range: **450,000 - 2,500,000 VND**

**Acceptable Error Ranges:**

| Metric | Excellent | Good | Acceptable | Poor |
|--------|-----------|------|-----------|------|
| MAE | <30K | <50K | <75K | >100K |
| RMSE | <40K | <65K | <100K | >150K |
| MAPE | <2% | <3.5% | <5% | >7% |
| R² | >0.95 | >0.90 | >0.80 | <0.70 |
| RMSLE | <0.03 | <0.05 | <0.08 | >0.10 |

---

## Implementation Tips

### 1. Custom Evaluation Function
```python
def full_evaluation(y_true, y_pred):
    return {
        'MAE': mean_absolute_error(y_true, y_pred),
        'RMSE': np.sqrt(mean_squared_error(y_true, y_pred)),
        'MAPE': mean_absolute_percentage_error(y_true, y_pred) * 100,
        'R2': r2_score(y_true, y_pred),
        'RMSLE': np.sqrt(np.mean((np.log1p(y_true) - np.log1p(y_pred))**2)),
    }

metrics = full_evaluation(y_test, y_pred)
for name, value in metrics.items():
    print(f"{name:6s}: {value:10.4f}")
```

### 2. Compare Multiple Models
```python
models = {
    'Model A': y_pred_a,
    'Model B': y_pred_b,
    'Model C': y_pred_c
}

comparison = {}
for name, y_pred in models.items():
    comparison[name] = full_evaluation(y_test, y_pred)

# Find best model by RMSE
best_model = min(comparison, key=lambda x: comparison[x]['RMSE'])
print(f"Best model: {best_model}")
```

### 3. Cross-Validation with Metrics
```python
from sklearn.model_selection import cross_validate

scoring = {
    'mae': 'neg_mean_absolute_error',
    'rmse': 'neg_mean_squared_error',
    'r2': 'r2'
}

cv_results = cross_validate(model, X, y, cv=5, scoring=scoring)

for metric in scoring:
    scores = -cv_results[f'test_{metric}']
    print(f"{metric}: {scores.mean():.4f} ± {scores.std():.4f}")
```

---

## Visualization Quick Code

```python
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# Residuals vs Predicted
axes[0, 0].scatter(y_pred, y_true - y_pred)
axes[0, 0].axhline(y=0, color='r', ls='--')
axes[0, 0].set_ylabel('Residuals')
axes[0, 0].set_title('Residuals vs Predicted')

# Actual vs Predicted
axes[0, 1].scatter(y_true, y_pred)
axes[0, 1].plot([y_true.min(), y_true.max()], [y_true.min(), y_true.max()], 'r--')
axes[0, 1].set_xlabel('Actual')
axes[0, 1].set_ylabel('Predicted')
axes[0, 1].set_title('Actual vs Predicted')

# Distribution of Errors
errors = np.abs(y_true - y_pred)
axes[1, 0].hist(errors, bins=20, edgecolor='black')
axes[1, 0].set_xlabel('Absolute Error')
axes[1, 0].set_title('Error Distribution')

# Q-Q Plot for Residuals
from scipy import stats
residuals = y_true - y_pred
stats.probplot(residuals, dist="norm", plot=axes[1, 1])
axes[1, 1].set_title('Q-Q Plot (Residuals)')

plt.tight_layout()
plt.show()
```

---

## Quick Metrics Cheat Sheet

```
┌─────────────────────────────────────────────────┐
│          EVALUATION METRICS GUIDE               │
├─────────────────────────────────────────────────┤
│ Use MAE when:           Simple interpretation   │
│ Use RMSE when:          Penalize large errors   │
│ Use R² when:            % variance explained    │
│ Use MAPE when:          % error comparison      │
│ Use RMSLE when:         Outliers important      │
│ Use SMAPE when:         Symmetric errors        │
└─────────────────────────────────────────────────┘
```

---

## Related Documentation

- **Full Details**: [EVALUATION_METRICS.md](./EVALUATION_METRICS.md)
- **ML Concepts**: [ML_CONCEPTS.md](./ML_CONCEPTS.md#51-evaluation-metrics)
- **README**: [README.md](./README.md#7-model-evaluation-đánh-giá-model)
- **Troubleshooting**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

**Last Updated**: April 17, 2026  
**Keep this for quick reference!** 📋
