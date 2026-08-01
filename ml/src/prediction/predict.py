import joblib
import numpy as np


def predict_fund(model_path, historical_volumes, reference_price):
    model_package = joblib.load(model_path)
    model = model_package.get("model")
    
    if not model:
        raise ValueError("Model tidak ditemukan dalam file joblib")
    
    n = len(historical_volumes)
    next_time_index = n + 1
    
    predicted_volume = model.predict([[next_time_index]])[0]
    predicted_volume = max(0, int(round(predicted_volume)))
    
    predicted_fund = predicted_volume * reference_price
    
    return {
        "predicted_volume": predicted_volume,
        "predicted_fund": predicted_fund,
    }
