from fastapi import APIRouter, HTTPException
from pathlib import Path

from src.clustering.train import train_collector_clustering
from src.clustering.cluster import recommend_collector_area, predict_cluster_for_coordinates, load_clustering_model
from src.schemas import (
    TrainClusteringRequest,
    TrainClusteringResponse,
    ClusterArea,
    RecommendedLocation,
    RecommendCollectorRequest,
    RecommendCollectorResponse,
    PredictClusterRequest,
    PredictClusterResponse,
)

router = APIRouter()

PROJECT_ROOT = Path(__file__).parent.parent.parent
MODEL_PATH = PROJECT_ROOT / "models" / "collector_clustering_model.joblib"


@router.post("/train", response_model=TrainClusteringResponse)
def train_clustering_model(request: TrainClusteringRequest):
    """
    Train clustering model untuk menentukan area rekomendasi collector.
    
    Returns:
    - cluster_areas: 3 area rekomendasi dengan pusat, radius, dan potensi volume
    - silhouette_score: Skor kualitas clustering (0-1)
    - model_path: Path ke file model yang disimpan
    - results_path: Path ke file hasil cluster
    """
    try:
        data_path = Path(request.data_path)
        
        if not data_path.exists():
            raise HTTPException(
                status_code=404,
                detail=f"File tidak ditemukan: {request.data_path}"
            )
        
        result = train_collector_clustering(data_path, PROJECT_ROOT)
        
        cluster_areas = [
            ClusterArea(
                recommended_location=RecommendedLocation(
                    latitude=area["recommended_location"]["latitude"],
                    longitude=area["recommended_location"]["longitude"],
                ),
                radius_km=area["radius_km"],
                potential_volume=area["potential_volume"],
                is_most_strategic=area["is_most_strategic"],
            )
            for area in result["cluster_outputs"]
        ]
        
        return TrainClusteringResponse(
            cluster_areas=cluster_areas,
            silhouette_score=result["silhouette_score"],
            model_path=str(result["model_path"]),
            results_path=str(result["results_path"]),
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/recommend", response_model=RecommendCollectorResponse)
def recommend_collector(request: RecommendCollectorRequest):
    """
    Rekomendasi area terdekat untuk lokasi calon collector.
    
    Parameters:
    - latitude: Latitude lokasi calon collector
    - longitude: Longitude lokasi calon collector
    
    Returns:
    - recommended_cluster: Cluster/area yang direkomendasikan
    - collector_latitude: Latitude pusat area
    - collector_longitude: Longitude pusat area
    - distance_km: Jarak dari lokasi ke pusat area
    """
    try:
        if not MODEL_PATH.exists():
            raise HTTPException(
                status_code=404,
                detail="Model clustering belum dilatih. Jalankan /api/clustering/train terlebih dahulu.",
            )
        
        model_package = load_clustering_model(str(MODEL_PATH))
        collector_locations = model_package.get("collector_locations")
        
        result = recommend_collector_area(
            request.latitude,
            request.longitude,
            collector_locations
        )
        
        return RecommendCollectorResponse(
            recommended_cluster=result["recommended_cluster"],
            collector_latitude=result["collector_latitude"],
            collector_longitude=result["collector_longitude"],
            distance_km=result["distance_km"],
        )
    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail="Model file tidak ditemukan"
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/predict", response_model=PredictClusterResponse)
def predict_cluster(request: PredictClusterRequest):
    """
    Prediksi cluster untuk koordinat yang diberikan.
    
    Parameters:
    - latitude: Latitude lokasi
    - longitude: Longitude lokasi
    
    Returns:
    - predicted_cluster: Cluster yang diprediksi untuk lokasi tersebut
    """
    try:
        if not MODEL_PATH.exists():
            raise HTTPException(
                status_code=404,
                detail="Model clustering belum dilatih. Jalankan /api/clustering/train terlebih dahulu.",
            )
        
        result = predict_cluster_for_coordinates(
            str(MODEL_PATH),
            request.latitude,
            request.longitude
        )
        
        return PredictClusterResponse(
            predicted_cluster=result["predicted_cluster"]
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/model-info")
def get_clustering_model_info():
    """
    Dapatkan informasi model clustering yang sedang digunakan.
    """
    try:
        if not MODEL_PATH.exists():
            return {"status": "not_trained", "message": "Model belum dilatih"}
        
        import joblib
        model_package = joblib.load(str(MODEL_PATH))
        
        return {
            "status": "ready",
            "number_of_clusters": model_package.get("model").n_clusters,
            "model_path": str(MODEL_PATH),
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/areas")
def get_all_cluster_areas():
    """
    Dapatkan semua area rekomendasi clustering.
    """
    try:
        if not MODEL_PATH.exists():
            raise HTTPException(
                status_code=404,
                detail="Model clustering belum dilatih. Jalankan /api/clustering/train terlebih dahulu.",
            )
        
        model_package = load_clustering_model(str(MODEL_PATH))
        collector_locations = model_package.get("collector_locations")
        
        return {
            "areas": collector_locations.to_dict(orient="records")
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
