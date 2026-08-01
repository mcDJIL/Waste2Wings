# Waste Oil ML Service

Machine Learning service untuk prediksi dana dan clustering lokasi penyetor limbah minyak.

## 📁 Struktur Folder

```
ml-service/
├── notebooks/                    # Jupyter notebooks untuk EDA dan experiments
│   ├── 01_eda.ipynb
│   ├── 02_fund_prediction.ipynb
│   └── 03_collector_clustering.ipynb
│
├── src/                         # Source code
│   ├── prediction/              # Fund prediction module
│   │   ├── __init__.py
│   │   ├── train.py            # Training logic
│   │   └── predict.py          # Inference logic
│   │
│   ├── clustering/              # Location clustering module
│   │   ├── __init__.py
│   │   ├── train.py            # K-Means training
│   │   └── cluster.py          # Clustering predictions
│   │
│   ├── routes/                  # API routes
│   │   ├── __init__.py
│   │   ├── prediction.py       # Prediction endpoints
│   │   └── clustering.py       # Clustering endpoints
│   │
│   ├── __init__.py
│   ├── api.py                  # Main FastAPI app
│   └── schemas.py              # Pydantic request/response models
│
├── tests/                       # Unit tests
│   ├── __init__.py
│   ├── test_prediction.py
│   └── test_clustering.py
│
├── data/                        # Data files
│   ├── waste_oil_dummy.csv
│   ├── collector_locations_dummy.csv
│   └── collector_cluster_results.csv
│
├── models/                      # Trained model files
│   ├── fund_prediction_model.joblib
│   └── collector_clustering_model.joblib
│
├── requirements.txt            # Python dependencies
├── README.md                   # This file
├── API.md                      # API documentation
└── run.sh                      # Script to run server
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Run FastAPI Server

```bash
python src/api.py
# atau menggunakan script
bash run.sh
```

Server akan berjalan di `http://localhost:3001`

### 3. Access API Documentation

- **Swagger UI**: http://localhost:3001/docs
- **ReDoc**: http://localhost:3001/redoc

---

## 📚 Modules

### Prediction Module (`src/prediction/`)

Memprediksi volume dana untuk periode berikutnya menggunakan 3 metode:

- **Linear Regression**: Model linear untuk trend jangka panjang
- **Moving Average**: Rata-rata 3 periode terakhir
- **Exponential Smoothing**: Smoothing exponensial dengan alpha=0.5

**Files:**
- `train.py`: Training logic dengan cross-validation
- `predict.py`: Inference dan update model

### Clustering Module (`src/clustering/`)

K-Means clustering untuk menentukan area rekomendasi collector berdasarkan lokasi penyetor.

**Features:**
- Haversine distance untuk kalkulasi geografis
- Silhouette score untuk evaluasi clustering
- Strategic score berdasarkan kepadatan volume per km²

**Files:**
- `train.py`: K-Means training
- `cluster.py`: Prediction dan rekomendasi area

---

## 🔌 API Endpoints

### Health Check

```
GET /health
```

### Prediction API

```
POST   /api/prediction/train          # Train prediction model
POST   /api/prediction/predict        # Get fund prediction
GET    /api/prediction/model-info     # Model info
```

### Clustering API

```
POST   /api/clustering/train          # Train clustering model
POST   /api/clustering/recommend      # Recommend collector area
POST   /api/clustering/predict        # Predict cluster
GET    /api/clustering/areas          # Get all cluster areas
GET    /api/clustering/model-info     # Model info
```

Lihat [API.md](API.md) untuk dokumentasi lengkap.

---

## 📊 Usage Examples

### Example 1: Train and Predict Fund

```bash
# Train model
curl -X POST http://localhost:3001/api/prediction/train \
  -H "Content-Type: application/json" \
  -d '{"data_path": "data/waste_oil_dummy.csv"}'

# Predict with reference price 13000
curl -X POST http://localhost:3001/api/prediction/predict \
  -H "Content-Type: application/json" \
  -d '{"reference_price": 13000}'
```

### Example 2: Train and Recommend Cluster

```bash
# Train clustering model
curl -X POST http://localhost:3001/api/clustering/train \
  -H "Content-Type: application/json" \
  -d '{"data_path": "data/collector_locations_dummy.csv"}'

# Recommend area for coordinates
curl -X POST http://localhost:3001/api/clustering/recommend \
  -H "Content-Type: application/json" \
  -d '{"latitude": -6.220, "longitude": 106.890}'
```

### Example 3: From Node.js

```javascript
// Prediction
const predictionRes = await fetch('http://localhost:3001/api/prediction/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ reference_price: 13000 })
});
const prediction = await predictionRes.json();
console.log(prediction);
// { predicted_volume: 3228, predicted_fund: 41964000 }

// Clustering Recommendation
const clusterRes = await fetch('http://localhost:3001/api/clustering/recommend', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ latitude: -6.220, longitude: 106.890 })
});
const cluster = await clusterRes.json();
console.log(cluster);
// { recommended_cluster: 'Cluster 3', distance_km: 0.66, ... }
```

---

## 🧪 Testing

Jalankan unit tests:

```bash
pytest tests/
# atau dengan verbose
pytest tests/ -v
```

Test files:
- `tests/test_prediction.py`: Prediction endpoints
- `tests/test_clustering.py`: Clustering endpoints

---

## 🐳 Deploy ke VPS dengan Docker

Panduan ini menjalankan service FastAPI di port `3001` menggunakan Docker Compose.

### 1. Persiapan VPS

Install Docker dan plugin Compose di VPS Ubuntu/Debian:

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin git
sudo systemctl enable --now docker
```

Opsional, agar user saat ini bisa menjalankan Docker tanpa `sudo`:

```bash
sudo usermod -aG docker $USER
newgrp docker
```

### 2. Upload atau Clone Project

Clone repository ke VPS:

```bash
git clone <url-repository> henwasteoil-ml
cd henwasteoil-ml
```

Jika project dikirim manual, pastikan folder `data/`, `src/`, `requirements.txt`, `Dockerfile`, dan `docker-compose.yml` ikut ter-upload.

### 3. Build dan Jalankan Container

```bash
docker compose up -d --build
```

Service akan berjalan di:

```text
http://<ip-vps>:3001
```

Cek status dan log:

```bash
docker compose ps
docker compose logs -f ml-service
```

### 4. Test Health Check

```bash
curl http://localhost:3001/health
```

Jika diakses dari komputer lokal:

```bash
curl http://<ip-vps>:3001/health
```

### 5. Training Model di Container

Endpoint training tetap menggunakan path relatif project karena `data/` di-mount ke `/app/data`:

```bash
curl -X POST http://localhost:3001/api/v1/prediction/train \
  -H "Content-Type: application/json" \
  -d '{"data_path": "data/waste_oil_dummy.csv"}'

curl -X POST http://localhost:3001/api/v1/clustering/train \
  -H "Content-Type: application/json" \
  -d '{"data_path": "data/collector_locations_dummy.csv"}'
```

File model hasil training tersimpan di folder `models/` pada host VPS melalui volume `./models:/app/models`, sehingga tidak hilang saat container restart.

### 6. Update Aplikasi

Saat ada perubahan kode:

```bash
git pull
docker compose up -d --build
```

### 7. Stop Service

```bash
docker compose down
```

Catatan produksi:
- Buka port `3001` di firewall VPS jika service perlu diakses langsung dari internet.
- Untuk domain dan HTTPS, gunakan reverse proxy seperti Nginx atau Caddy di depan service ini.
- API saat ini mengizinkan CORS dari semua origin. Batasi `allow_origins` di `src/api.py` jika sudah tahu domain frontend produksi.

---

## 📈 Model Details

### Prediction Model

**Data**: `data/waste_oil_dummy.csv`
- Columns: `period`, `total_accepted_application_volume`, `reference_price`
- Training set: 30 records (2023-01 hingga 2025-06)
- Test set: 6 records (2025-07 hingga 2025-12)

**Best Model**: Linear Regression
- RMSE: 173.47
- MAE: 143.62
- MAPE: 4.48%

### Clustering Model

**Data**: `data/collector_locations_dummy.csv`
- Columns: `collector_id`, `collector_name`, `latitude`, `longitude`, `average_volume`
- Number of clusters: 3
- Algorithm: K-Means with k=3

**Results**:
- Silhouette Score: 0.6068
- Cluster 1 (Most Strategic): radius 2.96 km, volume 2810
- Cluster 2: radius 3.68 km, volume 3175
- Cluster 3: radius 3.2 km, volume 3215

---

## 🔧 Development

### Add New Routes

1. Create route file di `src/routes/`
2. Import dan register di `src/api.py`:

```python
from src.routes import new_route
app.include_router(new_route.router, prefix="/api/new", tags=["New"])
```

### Add New Models

1. Create module di `src/`
2. Implement training logic di `module/train.py`
3. Implement prediction logic di `module/predict.py`

---

## 📝 Environment Variables

Saat ini tidak ada env vars yang diperlukan. Semua paths hardcoded relative ke project root.

---

## 🐛 Troubleshooting

### Model Not Found Error

**Error**: "Model belum dilatih"

**Solution**: Jalankan training endpoint terlebih dahulu:
```bash
curl -X POST http://localhost:3001/api/prediction/train \
  -H "Content-Type: application/json" \
  -d '{"data_path": "data/waste_oil_dummy.csv"}'
```

### Data File Not Found

**Error**: "File tidak ditemukan"

**Solution**: Pastikan file CSV ada di folder `data/`

### Import Error

**Error**: `ModuleNotFoundError`

**Solution**: Pastikan Anda di root folder project saat running:
```bash
cd /path/to/ml-service
python src/api.py
```

---

## 📄 License

Proprietary - Waste Oil Management System

---

## 👨‍💻 Author

Created for Waste Oil ML System
