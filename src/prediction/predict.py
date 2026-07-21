import joblib
import pandas as pd
import numpy as np


def load_model(model_path):
    return joblib.load(model_path)


def predict_next_volume(model_package):
    model_name = model_package.get("model_name")
    next_time_index = model_package.get("next_time_index", None)

    if model_name == "Linear Regression":
        model = model_package.get("model")
        next_volume = model.predict(pd.DataFrame({"time_index": [next_time_index]}))[0]

    elif model_name == "Moving Average":
        window = model_package.get("window", 3)
        recent_values = model_package.get("recent_values", [])
        next_volume = np.mean(recent_values)

    elif model_name == "Exponential Smoothing":
        alpha = model_package.get("alpha", 0.5)
        level = model_package.get("level", 0)
        next_volume = level

    else:
        raise ValueError(f"Unknown model: {model_name}")

    return max(0, int(round(next_volume)))


def calculate_predicted_fund(predicted_volume, reference_price):
    return predicted_volume * reference_price


def predict_fund(model_path, reference_price):
    model_package = load_model(model_path)
    predicted_volume = predict_next_volume(model_package)
    predicted_fund = calculate_predicted_fund(predicted_volume, reference_price)

    return {
        "predicted_volume": predicted_volume,
        "predicted_fund": predicted_fund,
    }


def predict_and_update_model(model_path, actual_volume, reference_price):
    model_package = load_model(model_path)
    model_name = model_package.get("model_name")

    current_prediction = predict_fund(model_path, reference_price)

    if model_name == "Moving Average":
        window = model_package.get("window", 3)
        recent_values = model_package.get("recent_values", [])
        recent_values.append(actual_volume)
        recent_values = recent_values[-window:]
        model_package["recent_values"] = recent_values

    elif model_name == "Exponential Smoothing":
        alpha = model_package.get("alpha", 0.5)
        level = model_package.get("level", 0)
        level = alpha * actual_volume + (1 - alpha) * level
        model_package["level"] = level

    model_package["next_time_index"] = model_package.get("next_time_index", 0) + 1

    return current_prediction, model_package
