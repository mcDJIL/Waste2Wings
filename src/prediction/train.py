from pathlib import Path
import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression


def load_data(data_path):
    df = pd.read_csv(data_path)
    df["date"] = pd.to_datetime(df["period"], format="%Y-%m")
    df = df.sort_values("date").reset_index(drop=True)
    df["time_index"] = np.arange(1, len(df) + 1)
    return df


def train_linear_regression_model(df, target_column="total_accepted_application_volume"):
    if df[target_column].isna().any():
        raise ValueError("Target column mengandung missing values")

    model = LinearRegression()
    model.fit(df[["time_index"]], df[target_column])

    next_time_index = int(df["time_index"].iloc[-1] + 1)
    predicted_volume = model.predict([[next_time_index]])[0]
    predicted_volume = max(0, int(round(predicted_volume)))

    return model, predicted_volume, next_time_index


def save_model(model, predicted_volume, last_period, next_time_index, project_root):
    models_directory = project_root / "models"
    models_directory.mkdir(parents=True, exist_ok=True)

    model_package = {
        "model_name": "Linear Regression",
        "model": model,
        "predicted_volume": predicted_volume,
        "last_period": last_period,
        "next_time_index": next_time_index,
    }

    model_path = models_directory / "fund_prediction_model.joblib"
    joblib.dump(model_package, model_path)

    return model_path


def train_fund_prediction_model(data_path, project_root, target_column="total_accepted_application_volume"):
    df = load_data(data_path)

    model, predicted_volume, next_time_index = train_linear_regression_model(df, target_column)

    model_path = save_model(
        model,
        predicted_volume,
        df["period"].iloc[-1],
        next_time_index,
        project_root
    )

    return {
        "predicted_volume": predicted_volume,
        "model_path": model_path,
    }
