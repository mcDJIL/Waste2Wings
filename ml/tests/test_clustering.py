import pytest
from pathlib import Path
from fastapi.testclient import TestClient

from src.api import app

client = TestClient(app)

PROJECT_ROOT = Path(__file__).parent.parent
MODEL_PATH = PROJECT_ROOT / "models" / "collector_clustering_model.joblib"


class TestClusteringTrain:
    
    def test_train_with_valid_data(self):
        response = client.post(
            "/api/v1/clustering/train",
            json={"data_path": "data/collector_locations_dummy.csv"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "model_path" in data
        assert "silhouette_score" in data
    
    def test_train_file_not_found(self):
        response = client.post(
            "/api/v1/clustering/train",
            json={"data_path": "data/nonexistent.csv"}
        )
        
        assert response.status_code == 400
    
    def test_train_model_saved(self):
        response = client.post(
            "/api/v1/clustering/train",
            json={"data_path": "data/collector_locations_dummy.csv"}
        )
        
        assert response.status_code == 200
        data = response.json()
        model_path = Path(data["model_path"])
        assert model_path.exists()


class TestClusteringRecommend:
    
    def test_recommend_with_valid_coordinates(self):
        client.post(
            "/api/v1/clustering/train",
            json={"data_path": "data/collector_locations_dummy.csv"}
        )
        
        response = client.post(
            "/api/v1/clustering/recommend",
            json={"latitude": -6.220, "longitude": 106.890}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "recommendations" in data
        assert len(data["recommendations"]) == 3
    
    def test_recommend_sorted_by_distance(self):
        client.post(
            "/api/v1/clustering/train",
            json={"data_path": "data/collector_locations_dummy.csv"}
        )
        
        response = client.post(
            "/api/v1/clustering/recommend",
            json={"latitude": -6.220, "longitude": 106.890}
        )
        
        assert response.status_code == 200
        data = response.json()
        distances = [area["distance_km"] for area in data["recommendations"]]
        assert distances == sorted(distances)
    
    def test_recommend_jakarta_pusat(self):
        client.post(
            "/api/v1/clustering/train",
            json={"data_path": "data/collector_locations_dummy.csv"}
        )
        
        response = client.post(
            "/api/v1/clustering/recommend",
            json={"latitude": -6.200, "longitude": 106.816}
        )
        
        assert response.status_code == 200
    
    def test_recommend_jakarta_utara(self):
        client.post(
            "/api/v1/clustering/train",
            json={"data_path": "data/collector_locations_dummy.csv"}
        )
        
        response = client.post(
            "/api/v1/clustering/recommend",
            json={"latitude": -6.150, "longitude": 106.850}
        )
        
        assert response.status_code == 200
    
    def test_recommend_has_most_strategic(self):
        client.post(
            "/api/v1/clustering/train",
            json={"data_path": "data/collector_locations_dummy.csv"}
        )
        
        response = client.post(
            "/api/v1/clustering/recommend",
            json={"latitude": -6.220, "longitude": 106.890}
        )
        
        assert response.status_code == 200
        data = response.json()
        most_strategic_count = sum(
            1 for area in data["recommendations"] 
            if area["is_most_strategic"]
        )
        assert most_strategic_count == 1
    
    def test_recommend_without_model(self):
        if MODEL_PATH.exists():
            MODEL_PATH.unlink()
        
        response = client.post(
            "/api/v1/clustering/recommend",
            json={"latitude": -6.220, "longitude": 106.890}
        )
        
        assert response.status_code == 400
    
    def test_recommend_different_locations(self):
        client.post(
            "/api/v1/clustering/train",
            json={"data_path": "data/collector_locations_dummy.csv"}
        )
        
        loc1 = client.post(
            "/api/v1/clustering/recommend",
            json={"latitude": -6.220, "longitude": 106.890}
        )
        
        loc2 = client.post(
            "/api/v1/clustering/recommend",
            json={"latitude": -6.300, "longitude": 106.800}
        )
        
        assert loc1.status_code == 200
        assert loc2.status_code == 200
        
        distances1 = [area["distance_km"] for area in loc1.json()["recommendations"]]
        distances2 = [area["distance_km"] for area in loc2.json()["recommendations"]]
        
        assert distances1 != distances2
    
    def test_recommend_potential_volume(self):
        client.post(
            "/api/v1/clustering/train",
            json={"data_path": "data/collector_locations_dummy.csv"}
        )
        
        response = client.post(
            "/api/v1/clustering/recommend",
            json={"latitude": -6.220, "longitude": 106.890}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        for area in data["recommendations"]:
            assert area["total_contributors"] > 0
            assert area["potential_volume"] > 0


class TestClusteringEndtoEnd:
    
    def test_train_then_recommend(self):
        train_response = client.post(
            "/api/v1/clustering/train",
            json={"data_path": "data/collector_locations_dummy.csv"}
        )
        assert train_response.status_code == 200
        
        recommend_response = client.post(
            "/api/v1/clustering/recommend",
            json={"latitude": -6.220, "longitude": 106.890}
        )
        assert recommend_response.status_code == 200
        
        recommend_data = recommend_response.json()
        assert len(recommend_data["recommendations"]) == 3
    
    def test_multiple_recommendations_same_location(self):
        client.post(
            "/api/v1/clustering/train",
            json={"data_path": "data/collector_locations_dummy.csv"}
        )
        
        response1 = client.post(
            "/api/v1/clustering/recommend",
            json={"latitude": -6.220, "longitude": 106.890}
        )
        
        response2 = client.post(
            "/api/v1/clustering/recommend",
            json={"latitude": -6.220, "longitude": 106.890}
        )
        
        assert response1.status_code == 200
        assert response2.status_code == 200
        
        distances1 = [area["distance_km"] for area in response1.json()["recommendations"]]
        distances2 = [area["distance_km"] for area in response2.json()["recommendations"]]
        
        assert distances1 == distances2
