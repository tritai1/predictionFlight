import sys
import json
import joblib
import pandas as pd
import numpy as np
import os
from datetime import datetime

# Hàm phân loại thời gian thành các khoảng, giống như trong notebook
def categorize_time(time_obj):
    if not isinstance(time_obj, datetime):
        # Nếu không phải đối tượng datetime, cố gắng parse
        try:
            time_obj = datetime.fromisoformat(time_obj) # Format từ datetime-local
        except ValueError:
            return 'Unknown' # Hoặc xử lý lỗi khác

    hour = time_obj.hour
    if 0 <= hour < 6:
        return 'Sáng sớm'
    elif 6 <= hour < 12:
        return 'Sáng'
    elif 12 <= hour < 17:
        return 'Trưa'
    elif 17 <= hour < 20:
        return 'Chiều'
    else:
        return 'Tối'

def predict_with_model(data, model_name):
    """Dự đoán giá vé với một model cụ thể"""
    try:
        # Đường dẫn đến model
        model_path = os.path.join(os.path.dirname(__file__), 'model', f'{model_name}.pkl')

        if not os.path.exists(model_path):
            return {
                'success': False,
                'error': f'Model {model_name} không tồn tại',
                'model': model_name
            }

        # Load model và preprocessor
        model_data = joblib.load(model_path)
        preprocessor = model_data['preprocessor']
        model = model_data['model']

        # --- Xử lý dữ liệu input mới ---
        # Chuyển đổi chuỗi ngày giờ đầy đủ thành đối tượng datetime
        departure_dt = datetime.fromisoformat(data['departureFullTime'])
        arrival_dt = datetime.fromisoformat(data['arrivalFullTime'])
        prediction_date = datetime.fromisoformat(data['predictionDate'])

        # Tính toán days_left
        days_left = (departure_dt.date() - prediction_date.date()).days

        # Tính toán Arrival Time và Departure Time (categorical)
        departure_time_cat = categorize_time(departure_dt)
        arrival_time_cat = categorize_time(arrival_dt)

        # Tạo DataFrame từ input data với các giá trị đã xử lý
        input_data_df = pd.DataFrame({
            'Airline Name': [data['airline']],
            'Departure City': [data['departureCity']],
            'Arrival City': [data['arrivalCity']],
            'Travel Class': [data['travelClass']],
            'Stops': [int(data['stops'])],
            'Departure Time': [departure_time_cat],
            'Arrival Time': [arrival_time_cat],
            'Duration': [float(data['duration'])],
            'days_left': [int(days_left)]
        })

        # Ép kiểu category như trong training
        cat_cols = ['Airline Name', 'Arrival City', 'Travel Class', 'Arrival Time', 'Departure Time', 'Stops', 'Departure City']
        for c in cat_cols:
            input_data_df[c] = input_data_df[c].astype("category")

        # Transform data
        input_encoded = preprocessor.transform(input_data_df)
        # Chuyển đổi csr_matrix thành mảng numpy dày đặc
        if hasattr(input_encoded, 'toarray'):
            input_encoded = input_encoded.toarray()

        # Dự đoán
        prediction = model.predict(input_encoded)[0]

        # Trả về kết quả làm tròn
        return {
            'success': True,
            'model': model_name,
            'price': round(prediction),
            'formatted_price': f"{round(prediction):,}".replace(",", ".") + " VND"
        }

    except Exception as e:
        # Ghi lỗi vào stderr để Node.js có thể bắt được
        sys.stderr.write(f"ERROR: Exception in predict_with_model for {model_name}: {str(e)}\n")
        return {
            'success': False,
            'model': model_name,
            'error': str(e)
        }

def predict_flight_price(data, selected_models=None):
    """Dự đoán giá vé với tất cả model, highlight model được chọn"""
    # Luôn dự đoán với tất cả model có sẵn
    all_models = ['RandomForestRegressor', 'DecisionTreeRegressor', 'StackingRegressor']

    results = []

    for model_name in all_models:
        result = predict_with_model(data, model_name)
        # Đánh dấu model nào được người dùng chọn
        result['selected'] = selected_models is not None and model_name in selected_models
        results.append(result)

    # Tìm model có giá dự đoán thấp nhất và cao nhất
    successful_predictions = [r for r in results if r['success']]
    if successful_predictions:
        prices = [r['price'] for r in successful_predictions]
        min_price = min(prices)
        max_price = max(prices)

        # Thêm thông tin so sánh
        for result in results:
            if result['success']:
                result['is_lowest'] = result['price'] == min_price
                result['is_highest'] = result['price'] == max_price
                result['price_diff'] = result['price'] - min_price if result['price'] != min_price else 0

    return {
        'success': True,
        'results': results,
        'summary': {
            'total_models': len(all_models),
            'selected_models': selected_models or [],
            'successful_predictions': len(successful_predictions),
            'price_range': f"{min_price:,} - {max_price:,} VND" if successful_predictions else None
        }
    }

if __name__ == "__main__":
    try:
        # Nếu Node.js truyền JSON qua args (pythonShell args), dùng argv,
        # ngược lại đọc từ stdin (tương thích khi chạy trực tiếp).
        if len(sys.argv) > 1:
            raw_input = " ".join(sys.argv[1:]).strip()
        else:
            raw_input = sys.stdin.read().strip()

        if not raw_input:
            raise ValueError("No input received from Node.js or input is empty.")

        input_data = json.loads(raw_input)

        if not isinstance(input_data, dict):
            raise TypeError("Input data is not a dictionary after JSON parsing. Received type: " + str(type(input_data)))

        # Lấy danh sách model được chọn (mặc định là tất cả nếu không có)
        selected_models = input_data.get('models', ['RandomForestRegressor', 'DecisionTreeRegressor', 'StackingRegressor'])

        # Tách data dự đoán và models
        flight_data = {k: v for k, v in input_data.items() if k != 'models'}

        result = predict_flight_price(flight_data, selected_models)

        # Trả về kết quả qua stdout
        print(json.dumps(result), file=sys.stdout)

    except Exception as e:
        error_result = {
            'success': False,
            'error': str(e)
        }
        # Ghi lỗi vào stderr để Node.js có thể bắt được
        sys.stderr.write(f"ERROR: Exception in __main__: {str(e)}\n")
        print(json.dumps(error_result), file=sys.stdout)
