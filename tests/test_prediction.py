import pytest
from pathlib import Path
from fastapi.testclient import TestClient

from src.api import app

client = TestClient(app)

PROJECT_ROOT = Path(__file__).parent.parent
MODEL_PATH = PROJECT_ROOT / "models" / "fund_prediction_model.joblib"


class TestPredictionTrain:
    
    def test_train_with_valid_data(self):
        response = client.post(
            "/api/v1/prediction/train",
            json={"data_path": "data/waste_oil_dummy.csv"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "best_model_name" in data
        assert "predicted_volume" in data
        assert "model_path" in data
    
    def test_train_file_not_found(self):
        response = client.post(
            "/api/v1/prediction/train",
            json={"data_path": "data/nonexistent.csv"}
        )
        
        assert response.status_code == 400
    
    def test_train_model_saved(self):
        response = client.post(
            "/api/v1/prediction/train",
            json={"data_path": "data/waste_oil_dummy.csv"}
        )
        
        assert response.status_code == 200
        data = response.json()
        model_path = Path(data["model_path"])
        assert model_path.exists()


class TestPredictionPredict:
    
    def test_predict_with_valid_input(self):
        client.post(
            "/api/v1/prediction/train",
            json={"data_path": "data/waste_oil_dummy.csv"}
        )
        
        response = client.post(
            "/api/v1/prediction/predict",
            json={
                "reference_price": 13000,
                "historical_volumes": [1200, 1280, 1350, 1420, 1390, 1500, 1550, 1600, 1650, 1700, 1750, 1800]
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "predicted_volume" in data
        assert "predicted_fund" in data
        assert data["predicted_fund"] == data["predicted_volume"] * 13000
    
    def test_predict_minimum_data(self):
        client.post(
            "/api/v1/prediction/train",
            json={"data_path": "data/waste_oil_dummy.csv"}
        )
        
        response = client.post(
            "/api/v1/prediction/predict",
            json={
                "reference_price": 10000,
                "historical_volumes": [1000, 1100, 1200]
            }
        )
        
        assert response.status_code == 200
    
    def test_predict_insufficient_data(self):
        client.post(
            "/api/v1/prediction/train",
            json={"data_path": "data/waste_oil_dummy.csv"}
        )
        
        response = client.post(
            "/api/v1/prediction/predict",
            json={
                "reference_price": 10000,
                "historical_volumes": [1000, 1100]
            }
        )
        
        assert response.status_code == 400
    
    def test_predict_without_model(self):
        if MODEL_PATH.exists():
            MODEL_PATH.unlink()
        
        response = client.post(
            "/api/v1/prediction/predict",
            json={
                "reference_price": 13000,
                "historical_volumes": [1200, 1280, 1350, 1420, 1390, 1500]
            }
        )
        
        assert response.status_code == 404
    
    def test_predict_different_prices(self):
        client.post(
            "/api/v1/prediction/train",
            json={"data_path": "data/waste_oil_dummy.csv"}
        )
        
        volumes = [1200, 1280, 1350, 1420, 1390, 1500, 1550, 1600, 1650, 1700]
        
        response1 = client.post(
            "/api/v1/prediction/predict",
            json={"reference_price": 10000, "historical_volumes": volumes}
        )
        
        response2 = client.post(
            "/api/v1/prediction/predict",
            json={"reference_price": 20000, "historical_volumes": volumes}
        )
        
        assert response1.status_code == 200
        assert response2.status_code == 200
        
        data1 = response1.json()
        data2 = response2.json()
        
        assert data1["predicted_volume"] == data2["predicted_volume"]
        assert data2["predicted_fund"] == data1["predicted_fund"] * 2
    
    def test_predict_consistent_volume(self):
        client.post(
            "/api/v1/prediction/train",
            json={"data_path": "data/waste_oil_dummy.csv"}
        )
        
        volumes = [1200, 1280, 1350, 1420, 1390, 1500, 1550, 1600, 1650, 1700]
        price = 13000
        
        response = client.post(
            "/api/v1/prediction/predict",
            json={"reference_price": price, "historical_volumes": volumes}
        )
        
        assert response.status_code == 200
        data = response.json()
        expected_fund = data["predicted_volume"] * price
        assert data["predicted_fund"] == expected_fund


class TestPredictionEndtoEnd:
    
    def test_train_then_predict(self):
        train_response = client.post(
            "/api/v1/prediction/train",
            json={"data_path": "data/waste_oil_dummy.csv"}
        )
        assert train_response.status_code == 200
        
        predict_response = client.post(
            "/api/v1/prediction/predict",
            json={
                "reference_price": 13000,
                "historical_volumes": [1200, 1280, 1350, 1420, 1390, 1500, 1550, 1600, 1650, 1700, 1750, 1800]
            }
        )
        assert predict_response.status_code == 200
