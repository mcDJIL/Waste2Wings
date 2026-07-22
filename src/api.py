from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

from src.routes import prediction, clustering

app = FastAPI(
    title="Waste Oil ML API",
    description="API untuk prediksi dana dan clustering lokasi penyetor",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prediction.router, prefix="/api/prediction", tags=["Prediction"])
app.include_router(clustering.router, prefix="/api/clustering", tags=["Clustering"])


@app.get("/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)
