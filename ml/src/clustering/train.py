from pathlib import Path
import json
import os

os.environ.setdefault("OMP_NUM_THREADS", "1")

import joblib
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score


def load_collector_data(data_path):
    df = pd.read_csv(data_path)

    required_columns = [
        "collector_id",
        "collector_name",
        "latitude",
        "longitude",
        "average_volume",
    ]

    missing_columns = [column for column in required_columns if column not in df.columns]
    if missing_columns:
        raise ValueError(f"Missing required columns: {missing_columns}")

    if df[required_columns].isna().any().any():
        raise ValueError("The dataset contains missing values.")

    if not df["latitude"].between(-90, 90).all():
        raise ValueError("Latitude values must be between -90 and 90.")

    if not df["longitude"].between(-180, 180).all():
        raise ValueError("Longitude values must be between -180 and 180.")

    return df


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


def train_kmeans(df, number_of_clusters=3, random_state=42):
    coordinate_columns = ["latitude", "longitude"]
    coordinates = df[coordinate_columns]

    kmeans = KMeans(n_clusters=number_of_clusters, random_state=random_state, n_init=10)
    raw_labels = kmeans.fit_predict(coordinates)
    raw_centroids = kmeans.cluster_centers_

    sorted_raw_labels = np.argsort(raw_centroids[:, 1])
    label_mapping = {
        int(raw_label): f"Cluster {position + 1}"
        for position, raw_label in enumerate(sorted_raw_labels)
    }

    df["cluster"] = [label_mapping[int(label)] for label in raw_labels]

    return kmeans, df, label_mapping, raw_centroids, raw_labels


def create_centroids_df(raw_centroids, label_mapping):
    centroid_rows = []
    for raw_label, centroid in enumerate(raw_centroids):
        centroid_rows.append({
            "cluster": label_mapping[raw_label],
            "collector_latitude": centroid[0],
            "collector_longitude": centroid[1],
        })

    centroids_df = pd.DataFrame(centroid_rows).sort_values("cluster").reset_index(drop=True)
    return centroids_df


def calculate_cluster_metrics(df, centroids_df):
    df_merged = df.merge(centroids_df, on="cluster", how="left")
    df_merged["distance_to_centroid_km"] = df_merged.apply(
        lambda row: haversine_distance(
            row["latitude"],
            row["longitude"],
            row["collector_latitude"],
            row["collector_longitude"],
        ),
        axis=1,
    )

    cluster_summary = (
        df_merged.groupby("cluster", as_index=False)
        .agg(
            collector_count=("collector_id", "count"),
            potential_volume=("average_volume", "sum"),
            average_collector_volume=("average_volume", "mean"),
            radius_km=(
                "distance_to_centroid_km",
                lambda distances: np.percentile(distances, 90),
            ),
            collector_latitude=("collector_latitude", "first"),
            collector_longitude=("collector_longitude", "first"),
        )
        .sort_values("cluster")
        .reset_index(drop=True)
    )

    cluster_summary["cluster_id"] = (
        cluster_summary["cluster"].str.extract(r"(\d+)")[0].astype(int)
    )
    cluster_summary["service_area_km2"] = np.pi * cluster_summary["radius_km"] ** 2
    cluster_summary["strategic_score"] = (
        cluster_summary["potential_volume"] / cluster_summary["service_area_km2"]
    )
    cluster_summary["strategic_rank"] = (
        cluster_summary["strategic_score"]
        .rank(method="dense", ascending=False)
        .astype(int)
    )

    return df_merged, cluster_summary


def generate_cluster_output(cluster_summary):
    cluster_outputs = []

    for _, row in cluster_summary.iterrows():
        cluster_outputs.append({
            "latitude": round(float(row["collector_latitude"]), 6),
            "longitude": round(float(row["collector_longitude"]), 6),
            "radius_km": round(float(row["radius_km"]), 2),
            "total_contributors": int(row["collector_count"]),
            "potential_volume": int(row["potential_volume"]),
            "is_most_strategic": bool(row["strategic_rank"] == 1),
        })

    cluster_outputs = sorted(cluster_outputs, key=lambda area: area["is_most_strategic"], reverse=True)
    return cluster_outputs


def save_clustering_model(kmeans, label_mapping, centroids_df, cluster_summary, project_root):
    models_directory = project_root / "models"
    models_directory.mkdir(parents=True, exist_ok=True)

    model_package = {
        "model": kmeans,
        "coordinate_columns": ["latitude", "longitude"],
        "label_mapping": label_mapping,
        "collector_locations": centroids_df,
        "cluster_summary": cluster_summary,
    }

    model_path = models_directory / "collector_clustering_model.joblib"
    joblib.dump(model_package, model_path)

    return model_path


def train_collector_clustering(data_path, project_root, number_of_clusters=3):
    df = load_collector_data(data_path)

    kmeans, df, label_mapping, raw_centroids, raw_labels = train_kmeans(
        df, number_of_clusters
    )

    centroids_df = create_centroids_df(raw_centroids, label_mapping)

    df_with_metrics, cluster_summary = calculate_cluster_metrics(df, centroids_df)

    cluster_outputs = generate_cluster_output(cluster_summary)

    silhouette = silhouette_score(df[["latitude", "longitude"]], raw_labels)

    model_path = save_clustering_model(kmeans, label_mapping, centroids_df, cluster_summary, project_root)

    return {
        "cluster_outputs": cluster_outputs,
        "cluster_summary": cluster_summary,
        "silhouette_score": silhouette,
        "model_path": model_path,
    }
