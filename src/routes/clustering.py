from fastapi import APIRouter, HTTPException
from pathlib import Path

from src.clustering.train import train_collector_clustering
from src.clustering.cluster import load_clustering_model, haversine_distance
from src.schemas import (
    TrainClusteringRequest,
    TrainClusteringResponse,
    ClusterArea,
    RecommendRequest,
    RecommendResponse,
)
import pandas as pd
import numpy as np

router = APIRouter()

PROJECT_ROOT = Path(__file__).parent.parent.parent
MODEL_PATH = PROJECT_ROOT / "models" / "collector_clustering_model.joblib"


@router.post("/train", response_model=TrainClusteringResponse, summary="Train Clustering Model")
def train_clustering_model(request: TrainClusteringRequest):
    try:
        data_path = Path(request.data_path)

        if not data_path.exists():
            raise HTTPException(
                status_code=404,
                detail=f"File tidak ditemukan: {request.data_path}"
            )

        result = train_collector_clustering(data_path, PROJECT_ROOT)

        return TrainClusteringResponse(
            message="Model clustering berhasil dilatih",
            model_path=str(result["model_path"]),
            silhouette_score=result["silhouette_score"],
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/recommend", response_model=RecommendResponse, summary="Get Top 3 Nearest Cluster Areas")
def recommend_areas(request: RecommendRequest):
    try:
        if not MODEL_PATH.exists():
            raise HTTPException(
                status_code=404,
                detail="Model belum dilatih. Jalankan POST /train terlebih dahulu.",
            )

        model_package = load_clustering_model(str(MODEL_PATH))

        # Load cluster summary dari model
        from src.clustering.train import generate_cluster_output

        cluster_summary = model_package.get("cluster_summary")
        cluster_outputs = generate_cluster_output(cluster_summary)

        # Hitung jarak ke setiap cluster dan sort
        recommendations = []
        for area in cluster_outputs:
            distance_km = haversine_distance(
                request.latitude,
                request.longitude,
                area["latitude"],
                area["longitude"]
            )
            recommendations.append({
                "latitude": area["latitude"],
                "longitude": area["longitude"],
                "radius_km": area["radius_km"],
                "total_contributors": area["total_contributors"],
                "potential_volume": area["potential_volume"],
                "is_most_strategic": area["is_most_strategic"],
                "distance_km": round(distance_km, 2),
            })

        # Sort by distance
        recommendations = sorted(recommendations, key=lambda x: x["distance_km"])

        return RecommendResponse(recommendations=recommendations)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
