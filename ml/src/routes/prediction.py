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
    """
    Train fund prediction model dengan data historis.

    Model akan membandingkan 3 algoritma dan memilih yang terbaik berdasarkan RMSE.

    **Request**: Path ke file CSV dengan kolom `period`, `total_accepted_application_volume`

    **Response**: Model terbaik, predicted volume, dan evaluation metrics
    """
    try:
        data_path = Path(request.data_path)

        if not data_path.exists():
            raise HTTPException(
                status_code=404,
                detail=f"File tidak ditemukan: {request.data_path}"
            )

        result = train_fund_prediction_model(data_path, PROJECT_ROOT)

        return TrainPredictionResponse(
            best_model_name="Linear Regression",
            predicted_volume=result["predicted_volume"],
            model_path=str(result["model_path"]),
            evaluation=[],
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/predict", response_model=PredictionResponse, summary="Predict Fund Amount")
def predict_fund_amount(request: PredictionRequest):
    """
    Prediksi dana untuk periode berikutnya menggunakan trained model dan data historis dari database.

    **Proses**:
    1. Load trained model dari file .joblib (hasil dari POST /train)
    2. Terima data historis lengkap dari database website
    3. Prediksi volume dengan model yang dipilih
    4. Hitung dana = volume × reference_price

    **Formula**: Predicted Fund = Predicted Volume × Reference Price

    **Prerequisite**:
    - Model sudah dilatih via `POST /train` dan tersimpan di `models/fund_prediction_model.joblib`

    **Request Parameters**:
    - `reference_price`: Harga acuan per unit volume (dalam Rp)
    - `historical_volumes`: Seluruh data historis volume dari database (list of int, minimal 3 data)

    **Response**:
    - `predicted_volume`: Volume prediksi untuk periode berikutnya
    - `predicted_fund`: Dana prediksi (volume × reference_price)
    """
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
