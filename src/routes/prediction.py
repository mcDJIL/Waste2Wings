from fastapi import APIRouter, HTTPException
from pathlib import Path
import pandas as pd

from src.prediction.train import train_fund_prediction_model
from src.prediction.predict import predict_fund
from src.schemas import (
    PredictionRequest,
    PredictionResponse,
    TrainPredictionRequest,
    TrainPredictionResponse,
)

router = APIRouter()

PROJECT_ROOT = Path(__file__).parent.parent.parent
MODEL_PATH = PROJECT_ROOT / "models" / "fund_prediction_model.joblib"
DATA_PATH = PROJECT_ROOT / "data" / "waste_oil_dummy.csv"


@router.post("/train", response_model=TrainPredictionResponse)
def train_prediction_model(request: TrainPredictionRequest):
    """
    Train fund prediction model dengan data yang diberikan.
    
    Returns:
    - best_model_name: Nama model terbaik (Linear Regression, Moving Average, atau Exponential Smoothing)
    - predicted_volume: Volume prediksi untuk periode berikutnya
    - model_path: Path ke file model yang disimpan
    - evaluation: Hasil evaluasi semua model (MAE, RMSE, MAPE)
    """
    try:
        data_path = Path(request.data_path)
        
        if not data_path.exists():
            raise HTTPException(
                status_code=404,
                detail=f"File tidak ditemukan: {request.data_path}"
            )
        
        result = train_fund_prediction_model(data_path, PROJECT_ROOT)
        
        evaluation_dict = result["evaluation_df"].to_dict(orient="records")
        
        return TrainPredictionResponse(
            best_model_name=result["best_model_name"],
            predicted_volume=result["predicted_volume"],
            model_path=str(result["model_path"]),
            evaluation=evaluation_dict,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/predict", response_model=PredictionResponse)
def predict_fund_amount(request: PredictionRequest):
    """
    Prediksi dana untuk periode berikutnya.
    
    Parameters:
    - reference_price: Harga acuan per unit volume (dalam Rp)
    
    Returns:
    - predicted_volume: Volume prediksi
    - predicted_fund: Dana prediksi (volume × harga acuan)
    """
    try:
        if not MODEL_PATH.exists():
            raise HTTPException(
                status_code=404,
                detail="Model belum dilatih. Jalankan /api/prediction/train terlebih dahulu.",
            )
        
        result = predict_fund(str(MODEL_PATH), request.reference_price)
        
        return PredictionResponse(
            predicted_volume=result["predicted_volume"],
            predicted_fund=result["predicted_fund"],
        )
    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail="Model file tidak ditemukan"
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/model-info")
def get_model_info():
    """
    Dapatkan informasi model prediction yang sedang digunakan.
    """
    try:
        if not MODEL_PATH.exists():
            return {"status": "not_trained", "message": "Model belum dilatih"}
        
        import joblib
        model_package = joblib.load(MODEL_PATH)
        
        return {
            "status": "ready",
            "model_name": model_package.get("model_name"),
            "last_period": model_package.get("last_period"),
            "next_time_index": model_package.get("next_time_index"),
            "model_path": str(MODEL_PATH),
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
