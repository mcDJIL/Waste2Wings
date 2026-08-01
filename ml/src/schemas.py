from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class PredictionRequest(BaseModel):
    reference_price: int = Field(..., description="Harga acuan per unit volume (dalam Rp)")
    historical_volumes: list[int] = Field(..., description="Data historis volume dari database (minimal 12 data)")

    model_config = {
        "json_schema_extra": {
            "example": {
                "reference_price": 13000,
                "historical_volumes": [1200, 1280, 1350, 1420, 1390, 1500, 1550, 1600, 1650, 1700, 1750, 1800]
            }
        }
    }


class PredictionResponse(BaseModel):
    predicted_volume: int = Field(..., description="Volume prediksi untuk periode berikutnya")
    predicted_fund: int = Field(..., description="Dana prediksi (volume × harga acuan)")


class TrainPredictionRequest(BaseModel):
    data_path: str = Field(..., description="Path ke file CSV data")


class TrainPredictionResponse(BaseModel):
    best_model_name: str = Field(..., description="Nama model terbaik yang dipilih")
    predicted_volume: int = Field(..., description="Volume prediksi dari model terbaik")
    model_path: str = Field(..., description="Path ke file model yang disimpan")
    evaluation: List[Dict[str, Any]] = Field(..., description="Hasil evaluasi semua model")


class ClusterArea(BaseModel):
    latitude: float = Field(..., description="Latitude pusat area rekomendasi")
    longitude: float = Field(..., description="Longitude pusat area rekomendasi")
    radius_km: float = Field(..., description="Radius area rekomendasi dalam km (persentil 90)")
    total_contributors: int = Field(..., description="Jumlah penyetor dalam area")
    potential_volume: int = Field(..., description="Total potensi volume minyak di area ini")
    is_most_strategic: bool = Field(..., description="Apakah area ini paling strategis (potensi tertinggi)")


class TrainClusteringRequest(BaseModel):
    data_path: str = Field(..., description="Path ke file CSV data lokasi penyetor")


class TrainClusteringResponse(BaseModel):
    message: str = Field(..., description="Status training")
    model_path: str = Field(..., description="Path ke file model clustering")
    silhouette_score: float = Field(..., description="Skor kualitas clustering")


class RecommendRequest(BaseModel):
    latitude: float = Field(..., description="Latitude lokasi (-90 hingga 90)")
    longitude: float = Field(..., description="Longitude lokasi (-180 hingga 180)")

    model_config = {
        "json_schema_extra": {
            "example": {
                "latitude": -6.220,
                "longitude": 106.890
            }
        }
    }


class RecommendationArea(BaseModel):
    latitude: float = Field(..., description="Latitude pusat cluster")
    longitude: float = Field(..., description="Longitude pusat cluster")
    radius_km: float = Field(..., description="Radius layanan dalam km")
    total_contributors: int = Field(..., description="Jumlah penyetor dalam cluster")
    potential_volume: int = Field(..., description="Potensi volume minyak dalam liter")
    is_most_strategic: bool = Field(..., description="Apakah area ini paling strategis")
    distance_km: float = Field(..., description="Jarak dari lokasi input ke cluster")


class RecommendResponse(BaseModel):
    recommendations: List[RecommendationArea] = Field(..., description="Top 3 cluster areas terdekat")


class PredictClusterRequest(BaseModel):
    latitude: float = Field(..., description="Latitude lokasi")
    longitude: float = Field(..., description="Longitude lokasi")


class PredictClusterResponse(BaseModel):
    predicted_cluster: str = Field(..., description="Cluster yang diprediksi")
