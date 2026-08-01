import joblib
import pandas as pd
import numpy as np


def haversine_distance(latitude_1, longitude_1, latitude_2, longitude_2):
    earth_radius_km = 6371.0088

    latitude_1_rad = np.radians(latitude_1)
    latitude_2_rad = np.radians(latitude_2)
    latitude_difference = np.radians(latitude_2 - latitude_1)
    longitude_difference = np.radians(longitude_2 - longitude_1)

    haversine_value = (
        np.sin(latitude_difference / 2) ** 2
        + np.cos(latitude_1_rad)
        * np.cos(latitude_2_rad)
        * np.sin(longitude_difference / 2) ** 2
    )
    angular_distance = 2 * np.arctan2(
        np.sqrt(haversine_value), np.sqrt(1 - haversine_value)
    )

    return earth_radius_km * angular_distance


def load_clustering_model(model_path):
    return joblib.load(model_path)


def recommend_collector_area(latitude, longitude, collector_locations):
    recommendations = collector_locations.copy()
    recommendations["distance_km"] = recommendations.apply(
        lambda row: haversine_distance(
            latitude,
            longitude,
            row["collector_latitude"],
            row["collector_longitude"],
        ),
        axis=1,
    )

    nearest = recommendations.sort_values("distance_km").iloc[0]
    return {
        "recommended_cluster": nearest["cluster"],
        "latitude": round(float(nearest["collector_latitude"]), 6),
        "longitude": round(float(nearest["collector_longitude"]), 6),
        "distance_km": round(float(nearest["distance_km"]), 2),
    }


def predict_cluster_for_coordinates(model_path, latitude, longitude):
    model_package = load_clustering_model(model_path)
    coordinates = np.array([[latitude, longitude]])
    
    kmeans = model_package.get("model")
    label_mapping = model_package.get("label_mapping")
    
    raw_label = int(kmeans.predict(coordinates)[0])
    cluster_name = label_mapping.get(raw_label, "Unknown")

    return {
        "predicted_cluster": cluster_name,
    }


def get_all_cluster_recommendations(model_path):
    model_package = load_clustering_model(model_path)
    collector_locations = model_package.get("collector_locations")
    
    return collector_locations.to_dict(orient="records")
