from pathlib import Path
import json

import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error


def calculate_metrics(actual, predicted):
    actual = np.asarray(actual, dtype=float)
    predicted = np.asarray(predicted, dtype=float)

    mae = mean_absolute_error(actual, predicted)
    rmse = np.sqrt(mean_squared_error(actual, predicted))
    mape = np.mean(np.abs((actual - predicted) / actual)) * 100

    return {"MAE": mae, "RMSE": rmse, "MAPE": mape}


def simple_exponential_smoothing(values, alpha):
    level = float(values[0])
    for value in values[1:]:
        level = alpha * float(value) + (1 - alpha) * level
    return level


def load_data(data_path):
    df = pd.read_csv(data_path)
    df["date"] = pd.to_datetime(df["period"], format="%Y-%m")
    df = df.sort_values("date").reset_index(drop=True)
    df["time_index"] = np.arange(1, len(df) + 1)
    return df


def train_models(df, target_column="total_accepted_application_volume", test_size=6):
    train_df = df.iloc[:-test_size].copy()
    test_df = df.iloc[-test_size:].copy()

    # Linear Regression
    linear_model = LinearRegression()
    linear_model.fit(train_df[["time_index"]], train_df[target_column])
    linear_predictions = linear_model.predict(test_df[["time_index"]])

    # Moving Average
    moving_average_window = 3
    moving_history = train_df[target_column].astype(float).tolist()
    moving_average_predictions = []

    for actual_value in test_df[target_column]:
        prediction = np.mean(moving_history[-moving_average_window:])
        moving_average_predictions.append(prediction)
        moving_history.append(float(actual_value))

    # Exponential Smoothing
    smoothing_alpha = 0.5
    smoothing_level = simple_exponential_smoothing(
        train_df[target_column].to_numpy(), smoothing_alpha
    )
    exponential_predictions = []

    for actual_value in test_df[target_column]:
        exponential_predictions.append(smoothing_level)
        smoothing_level = (
            smoothing_alpha * float(actual_value)
            + (1 - smoothing_alpha) * smoothing_level
        )

    # Evaluate models
    actual_values = test_df[target_column].to_numpy()
    model_predictions = {
        "Linear Regression": linear_predictions,
        "Moving Average": moving_average_predictions,
        "Exponential Smoothing": exponential_predictions,
    }

    evaluation_rows = []
    for model_name, predictions in model_predictions.items():
        metrics = calculate_metrics(actual_values, predictions)
        evaluation_rows.append({"Model": model_name, **metrics})

    evaluation_df = pd.DataFrame(evaluation_rows).sort_values("RMSE").reset_index(drop=True)

    return evaluation_df, model_predictions, train_df, test_df, df, linear_model


def select_and_retrain_best_model(
    evaluation_df, model_predictions, train_df, df, target_column
):
    best_model_name = evaluation_df.loc[0, "Model"]
    next_time_index = int(df["time_index"].iloc[-1] + 1)
    model_package = {"model_name": best_model_name}

    if best_model_name == "Linear Regression":
        final_model = LinearRegression()
        final_model.fit(df[["time_index"]], df[target_column])
        next_volume = final_model.predict(pd.DataFrame({"time_index": [next_time_index]}))[0]
        model_package.update({"model": final_model})

    elif best_model_name == "Moving Average":
        moving_average_window = 3
        recent_values = df[target_column].tail(moving_average_window).astype(float).tolist()
        next_volume = np.mean(recent_values)
        model_package.update({
            "window": moving_average_window,
            "recent_values": recent_values,
        })

    else:
        smoothing_alpha = 0.5
        final_level = simple_exponential_smoothing(
            df[target_column].to_numpy(), smoothing_alpha
        )
        next_volume = final_level
        model_package.update({
            "alpha": smoothing_alpha,
            "level": final_level,
        })

    predicted_volume = max(0, int(round(next_volume)))

    return best_model_name, predicted_volume, model_package, next_time_index


def save_model(model_package, project_root, model_path_name="fund_prediction_model.joblib"):
    models_directory = project_root / "models"
    models_directory.mkdir(parents=True, exist_ok=True)

    model_package.update({
        "target_column": "total_accepted_application_volume",
        "last_period": model_package.get("last_period"),
        "next_time_index": model_package.get("next_time_index"),
    })

    model_path = models_directory / model_path_name
    joblib.dump(model_package, model_path)

    return model_path


def train_fund_prediction_model(data_path, project_root, target_column="total_accepted_application_volume"):
    df = load_data(data_path)
    
    if df[target_column].isna().any():
        raise ValueError("The target column contains missing values.")

    evaluation_df, model_predictions, train_df, test_df, df, linear_model = train_models(
        df, target_column
    )

    best_model_name, predicted_volume, model_package, next_time_index = select_and_retrain_best_model(
        evaluation_df, model_predictions, train_df, df, target_column
    )

    model_package["last_period"] = df["period"].iloc[-1]
    model_package["next_time_index"] = next_time_index

    model_path = save_model(model_package, project_root)

    return {
        "best_model_name": best_model_name,
        "predicted_volume": predicted_volume,
        "evaluation_df": evaluation_df,
        "model_path": model_path,
    }
