from fastapi import APIRouter, HTTPException
from pathlib import Path

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


@router.post("/train", response_model=TrainPredictionResponse, summary="Train Fund Prediction Model")
def train_prediction_model(request: TrainPredictionRequest):
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


@router.post("/predict", response_model=PredictionResponse, summary="Predict Fund Amount")
def predict_fund_amount(request: PredictionRequest):
    try:
        if not MODEL_PATH.exists():
            raise HTTPException(
                status_code=404,
                detail="Model belum dilatih. Jalankan POST /train terlebih dahulu."
            )

        if len(request.historical_volumes) < 3:
            raise HTTPException(
                status_code=400,
                detail="Minimal 3 data historis diperlukan untuk prediksi"
            )

        result = predict_fund(
            str(MODEL_PATH),
            request.historical_volumes,
            request.reference_price
        )

        return PredictionResponse(
            predicted_volume=result["predicted_volume"],
            predicted_fund=result["predicted_fund"],
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
