# 📚 Flight Price Prediction - Documentation Index

## Chào Mừng! 👋

Dây là hệ thống dự đoán giá vé máy bay sử dụng Machine Learning. Dự án này kết hợp:
- **Data Science**: Xử lý dữ liệu, phân tích, feature engineering
- **Machine Learning**: 3 models khác nhau (Decision Tree, Random Forest, Stacking)
- **Web Development**: Node.js backend + Pug frontend
- **Integration**: Python + JavaScript seamless integration

---

## 📖 Tài Liệu Chi Tiết

### **1. [README.md](./README.md)** - Bắt Đầu Tại Đây! 🚀
**Nội dung chính:**
- 📋 Tổng quan dự án & tính năng
- 🛠️ Tech stack (Node.js, Express, Python, scikit-learn)
- 📁 Cấu trúc folder
- ⚙️ Cài đặt và chạy ứng dụng
- 📖 Hướng dẫn sử dụng
- 🤖 Giải thích 3 models
- 📊 Xử lý dữ liệu overview
- 🔌 API endpoints
- 📚 Khái niệm ML cơ bản

**Nên đọc khi:**
- Bắt đầu với dự án
- Setup lần đầu
- Hiểu overview kiến trúc

---

### **2. [ML_CONCEPTS.md](./ML_CONCEPTS.md)** - Kiến Thức ML Nâng Cao 📚
**Nội dung chính:**
- 🔍 Regression vs Classification
- 🌳 Decision Trees & Tree-based Models  
- 🏕️ Ensemble Methods (Bagging, Random Forest, Stacking)
- 🎯 Feature Engineering Deep Dive
- 📊 Model Evaluation Metrics (MAE, RMSE, R²)
- ✔️ Cross-Validation & Train-Test Strategy
- 🔧 Hyperparameter Tuning (Grid Search, Random Search)
- ⚠️ Overfitting vs Underfitting

**Phần công thức & toán học:**
- $$\text{MAE} = \frac{1}{m} \sum_{i=1}^{m} |y^{(i)} - \hat{y}^{(i)}|$$
- $$R^2 = 1 - \frac{\sum(y^{(i)} - \hat{y}^{(i)})^2}{\sum(y^{(i)} - \bar{y})^2}$$

**Nên đọc khi:**
- Muốn hiểu sâu về các models
- Cải thiện kỹ năng ML
- Tối ưu hóa models
- Phỏng vấn công việc 💼

---

### **3. [DATA_PROCESSING_GUIDE.md](./DATA_PROCESSING_GUIDE.md)** - Hướng Dẫn Xử Lý Dữ Liệu 🔧
**Nội dung chi tiết:**
- 📥 Data Loading & Inspection
- 🧹 Data Cleaning (handling missing values)
- 📊 Exploratory Data Analysis (EDA) với code
- ⚙️ Feature Engineering Step-by-Step
- 🏋️ Model Training (Decision Tree, Random Forest, Stacking)
- 📈 Evaluation & Comparison
- 💾 Model Deployment & Saving

**Bao gồm:**
- Code examples hoàn chỉnh
- Pandas operations
- Visualization examples
- Before/after comparisons

**Nên đọc khi:**
- Muốn hiểu cách train model
- Cần copy-paste code examples
- Thực hành xử lý dữ liệu
- Debugging preprocessing issues

---

### **4. [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Khắc Phục Sự Cố 🛠️
**Nội dung chính:**
- 🐛 Lỗi Backend & cách khắc phục
  - Model not found
  - Missing packages
  - Type errors
  - Timeouts
- 📊 Data Issues
  - High RMSE / model không chính xác
  - Feature mismatching
- 🔗 Integration Issues
  - Path errors
  - Datetime parsing
- ⚡ Performance Optimization
  - Model caching
  - Batch prediction
  - Vectorization
- 📈 Model Improvement Strategies
- 👁️ Monitoring & Logging
- 🚀 Advanced Techniques (A/B testing, online learning)

**Nên đọc khi:**
- Gặp lỗi ❌
- Application chạy chậm 🐢
- Muốn optimize ⚡
- Deployment issues 🚀

### **5. [EVALUATION_METRICS.md](./EVALUATION_METRICS.md)** - Công Thức Đánh Giá 📊 **⭐ NEW**
**Nội dung chính:**
- 📐 **Basic Metrics** với công thức đầy đủ
  - MAE: $\text{MAE} = \frac{1}{m} \sum |y^{(i)} - \hat{y}^{(i)}|$
  - RMSE: $\text{RMSE} = \sqrt{\frac{1}{m} \sum (y^{(i)} - \hat{y}^{(i)})^2}$
  - R²: $R^2 = 1 - \frac{SS_{res}}{SS_{tot}}$
  - MAPE: $\text{MAPE} = \frac{100\%}{m} \sum |\frac{y^{(i)} - \hat{y}^{(i)}}{y^{(i)}}|$

- 🔬 **Log-Transformed Metrics** (log1p & variations)
  - RMSLE: $\text{RMSLE} = \sqrt{\frac{1}{m} \sum (\log(y+1) - \log(\hat{y}+1))^2}$
  - SMAPE (Symmetric): $\text{SMAPE} = \frac{100\%}{m} \sum \frac{2|y - \hat{y}|}{|y| + |\hat{y}|}$
  - MAE_log: $\text{MAE}_{log} = \frac{1}{m} \sum |\log(y+1) - \log(\hat{y}+1)|$

- 🚀 **Advanced Metrics**
  - Quantile Loss
  - Huber Loss

- 📋 **So Sánh & Chọn Metric**
  - Decision tree cho việc lựa chọn
  - Pro/cons từng metric
  - Recommendation cho Flight Price Prediction

- 💻 **Code Examples**
  - Tất cả metrics implementation
  - Custom evaluation function
  - Cross-validation scoring

- 📈 **Visualization**
  - Residual plots
  - Actual vs Predicted
  - Error distribution

**Nên đọc khi:**
- Muốn hiểu sâu về evaluation metrics
- Cần log-transformed variants (RMSLE, SMAPE)
- Chọn metric phù hợp cho project
- Tìm code examples cho evaluation

---

## 🎯 Quick Navigation by Use Case

### 🆕 **Người Mới - Bắt Đầu Từ Đâu?**
```
1. README.md          (toàn diện overview)
   ↓
2. ML_CONCEPTS.md     (hiểu cơ bản models)
   ↓
3. DATA_PROCESSING_GUIDE.md  (thực hành code)
   ↓
4. Run app locally & test
```

### 👨‍💻 **Developer - Setup & Integration**
```
1. README.md (Section: Cài Đặt & Cấu Hình)
   ↓
2. DATA_PROCESSING_GUIDE.md (Model Training)
   ↓
3. Integrate models
   ↓
4. TROUBLESHOOTING.md (if issues)
```

### 🤖 **ML Engineer - Optimize Models**
```
1. ML_CONCEPTS.md (Deep dive)
   ↓
2. DATA_PROCESSING_GUIDE.md (Feature Engineering)
   ↓
3. TROUBLESHOOTING.md (Performance Optimization)
   ↓
4. Experiment & improve
```

### 🐛 **Debugging Issues**
```
TROUBLESHOOTING.md
├─ Look for specific error
├─ Follow recommended fixes
├─ Check checklist
└─ Test solution
```

---

## 📋 Document Quick Reference

| Document | Purpose | Best For | Formulas |
|----------|---------|----------|----------|
| [README.md](./README.md) | Overview & setup | Everyone | Basic concepts |
| [ML_CONCEPTS.md](./ML_CONCEPTS.md) | Theory & algorithms | Data scientists | 8+ formulas |
| [DATA_PROCESSING_GUIDE.md](./DATA_PROCESSING_GUIDE.md) | Practical guide | Developers | Implementation |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | Problem solving | All | Debug patterns |
| [EVALUATION_METRICS.md](./EVALUATION_METRICS.md) **NEW** | Detailed metrics | ML Engineers | 15+ formulas |

---

## 🎓 Learning Path (Recommended)

### **Week 1: Understanding**
- [ ] Read README.md (全体 overview)
- [ ] Understand project structure  
- [ ] Setup environment locally
- [ ] Run application

### **Week 2: ML Concepts**
- [ ] Read ML_CONCEPTS.md
- [ ] Understand regression basics
- [ ] Learn about Decision Trees
- [ ] Study Random Forest & Stacking

### **Week 3: Data & Training**
- [ ] Follow DATA_PROCESSING_GUIDE.md
- [ ] Practice EDA
- [ ] Implement feature engineering
- [ ] Train models

### **Week 4: Optimization & Deployment**
- [ ] Learn from TROUBLESHOOTING.md
- [ ] Optimize model performance
- [ ] Handle edge cases
- [ ] Deploy to production

---

## 🔗 Inter-Document References

### README.md links to:
- ML_CONCEPTS.md - Detailed model explanations
- DATA_PROCESSING_GUIDE.md - Data pipeline details
- TROUBLESHOOTING.md - Common issues

### ML_CONCEPTS.md links to:
- Data ensemble methods concepts
- Hyperparameter tuning theory
- Related to DATA_PROCESSING_GUIDE

### DATA_PROCESSING_GUIDE.md links to:
- ML_CONCEPTS.md - Why certain techniques
- TROUBLESHOOTING.md - Handling errors
- Step-by-step implementation

### TROUBLESHOOTING.md links to:
- All documents - Problem solutions
- Error-specific sections
- Best practices

---

## 📱 File Structure

```
predictionFlight/
├── README.md                     # ← Start here
├── ML_CONCEPTS.md               # Advanced theory
├── DATA_PROCESSING_GUIDE.md     # Practical guide  
├── TROUBLESHOOTING.md           # Problem solving
├── DOCUMENTATION_INDEX.md       # This file
│
├── app.js                       # Express server
├── predictor.py                 # Python script
├── package.json
│
├── model/                       # Trained models
│   ├── DecisionTreeRegressor.pkl
│   ├── RandomForestRegressor.pkl
│   └── StackingRegressor.pkl
│
├── controller/
├── router/
├── view/
└── public/
```

---

## 🎯 Key Concepts Across Documents

### Mentioned in Multiple Docs:
- **Feature Engineering**: README → ML_CONCEPTS → DATA_PROCESSING_GUIDE
- **Model Training**: README → ML_CONCEPTS → DATA_PROCESSING_GUIDE → TROUBLESHOOTING
- **Evaluation Metrics**: README (basic) → ML_CONCEPTS (detailed) → DATA_PROCESSING_GUIDE (implementation)
- **Optimization**: README (overview) → TROUBLESHOOTING (detailed) → ML_CONCEPTS (theory)

### Cross-References:
- Section in README → Full explanation in ML_CONCEPTS
- Example in DATA_PROCESSING_GUIDE → Troubleshooting in TROUBLESHOOTING
- Concept in ML_CONCEPTS → Implementation in DATA_PROCESSING_GUIDE

---

## 📞 When to Check Each Document

**"How do I install the project?"**
→ [README.md - Cài Đặt & Cấu Hình](./README.md#-cài-đặt--cấu-hình)

**"What is Random Forest?"**
→ [ML_CONCEPTS.md - Random Forest](./ML_CONCEPTS.md#32-random-forest)

**"How do I train a model?"**
→ [DATA_PROCESSING_GUIDE.md - Model Training](./DATA_PROCESSING_GUIDE.md#model-training-process)

**"What evaluation metrics should I use?"** ⭐ **NEW**
→ [EVALUATION_METRICS.md - Choosing Metrics](./EVALUATION_METRICS.md#so-sánh--chọn-metric)

**"What is RMSLE and when to use log1p?"** ⭐ **NEW**
→ [EVALUATION_METRICS.md - RMSLE](./EVALUATION_METRICS.md#1-root-mean-squared-logarithmic-error-rmsle)

**"Why is RMSE high?"**
→ [TROUBLESHOOTING.md - RMSE quá cao](./TROUBLESHOOTING.md#lỗi-5-rmse-quá-cao-model-không-chính-xác)

**"I got 'Model not found' error"**
→ [TROUBLESHOOTING.md - Model không tồn tại](./TROUBLESHOOTING.md#lỗi-1-model-name-không-tồn-tại)

**"I need MAE, RMSE, MAPE code examples"** ⭐ **NEW**
→ [EVALUATION_METRICS.md - Code Examples](./EVALUATION_METRICS.md#implementation-trong-python)

**"How do I visualize model performance?"** ⭐ **NEW**
→ [EVALUATION_METRICS.md - Visualization](./EVALUATION_METRICS.md#visualization--interpretation)

**"How do I optimize predictions?"**
→ [TROUBLESHOOTING.md - Performance Optimization](./TROUBLESHOOTING.md#performance-optimization)

---

## 🎓 Knowledge Progression

```
BEGINNER ─→ INTERMEDIATE ─→ ADVANCED

README.md
  ├─ Overview
  └─ Basic concepts
     ↓
ML_CONCEPTS.md
  ├─ Regression theory
  ├─ Tree models
  └─ Ensemble methods
     ↓
DATA_PROCESSING_GUIDE.md
  ├─ Feature engineering
  ├─ Model training
  └─ Optimization
     ↓
TROUBLESHOOTING.md
  ├─ Problem solving
  ├─ Performance tuning
  └─ Production deployment
```

---

## 💡 Pro Tips

1. **Use Ctrl+F** to search within documents
2. **Bookmark important sections** you refer to often
3. **Keep README.md open** while reading others
4. **Code examples in DATA_PROCESSING_GUIDE** can be copy-pasted
5. **TROUBLESHOOTING section** covers 80% of common issues
6. **ML_CONCEPTS has formulas** - great for explaining to others

---

## 🚀 Ready to Get Started?

### Option 1: Just Run It
1. [Setup environment](./README.md#-cài-đặt--cấu-hình)
2. `npm install && npm start`
3. Visit http://localhost:9000

### Option 2: Learn First
1. Read [README.md](./README.md)
2. Read [ML_CONCEPTS.md](./ML_CONCEPTS.md)
3. Then run it

### Option 3: Deep Dive
1. [README.md](./README.md) - Overview
2. [ML_CONCEPTS.md](./ML_CONCEPTS.md) - Theory
3. [DATA_PROCESSING_GUIDE.md](./DATA_PROCESSING_GUIDE.md) - Practice
4. [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Production

---

## 📊 Documentation Stats

| Document | Sections | Code Examples | Formulas | Pages* |
|----------|----------|---------------|----------|--------|
| README.md | 17+ | 12+ | 8 | ~18 |
| ML_CONCEPTS.md | 10+ | 20+ | 8 | ~12 |
| DATA_PROCESSING_GUIDE.md | 12+ | 30+ | 0 | ~14 |
| TROUBLESHOOTING.md | 15+ | 25+ | 0 | ~13 |
| EVALUATION_METRICS.md **NEW** | 12+ | 15+ | 15+ | ~16 |
| **TOTAL** | **66+** | **102+** | **31+** | **~73** |

*Rough estimate (A4 @ 11pt font)

---

## 🎯 Documentation Coverage

```
✓ Project Overview
✓ Setup & Installation
✓ Architecture & Structure
✓ API Documentation
✓ ML Theory & Concepts
✓ Model Explanations
✓ Data Processing Step-by-Step
✓ Code Examples
✓ Best Practices
✓ Troubleshooting
✓ Performance Optimization
✓ Deployment Guide
✓ Monitoring & Logging
✓ Advanced Techniques
```

---

## 📝 Last Updated
- **Date**: April 17, 2026
- **Version**: 1.1
- **Status**: Complete & Production Ready ✅
- **Latest Addition**: EVALUATION_METRICS.md (15+ formulas with log1p variants)

---

**Hãy chọn tài liệu mà bạn cần và bắt đầu nào! 🚀**

Questions? Check the appropriate document above! 📚
