from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class PredictionRequest(BaseModel):
    reference_price: int = Field(..., description="Harga acuan per unit volume (dalam Rp)")


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


class RecommendedLocation(BaseModel):
    latitude: float = Field(..., description="Latitude pusat area rekomendasi")
    longitude: float = Field(..., description="Longitude pusat area rekomendasi")


class ClusterArea(BaseModel):
    recommended_location: RecommendedLocation
    radius_km: float = Field(..., description="Radius area rekomendasi dalam km")
    potential_volume: int = Field(..., description="Total potensi volume di area ini")
    is_most_strategic: bool = Field(..., description="Apakah area ini paling strategis")


class TrainClusteringRequest(BaseModel):
    data_path: str = Field(..., description="Path ke file CSV data lokasi penyetor")


class TrainClusteringResponse(BaseModel):
    cluster_areas: List[ClusterArea] = Field(..., description="3 area rekomendasi")
    silhouette_score: float = Field(..., description="Skor kualitas clustering")
    model_path: str = Field(..., description="Path ke file model clustering")
    results_path: str = Field(..., description="Path ke file hasil cluster")


class RecommendCollectorRequest(BaseModel):
    latitude: float = Field(..., description="Latitude lokasi calon collector")
    longitude: float = Field(..., description="Longitude lokasi calon collector")


class RecommendCollectorResponse(BaseModel):
    recommended_cluster: str = Field(..., description="Cluster yang direkomendasikan")
    collector_latitude: float = Field(..., description="Latitude pusat area")
    collector_longitude: float = Field(..., description="Longitude pusat area")
    distance_km: float = Field(..., description="Jarak dari lokasi ke pusat area")


class PredictClusterRequest(BaseModel):
    latitude: float = Field(..., description="Latitude lokasi")
    longitude: float = Field(..., description="Longitude lokasi")


class PredictClusterResponse(BaseModel):
    predicted_cluster: str = Field(..., description="Cluster yang diprediksi")
