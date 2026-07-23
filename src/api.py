from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from pathlib import Path

from src.routes import prediction, clustering

app = FastAPI(
    title="Waste Oil ML Service API",
    version="1.0.0",
    contact={
        "name": "Waste Oil System",
        "url": "http://localhost:3001",
    },
    openapi_tags=[
        {
            "name": "Health",
            "description": "Health check endpoint"
        },
        {
            "name": "Prediction",
            "description": "Fund prediction using ML models"
        },
        {
            "name": "Clustering",
            "description": "Collector location clustering with K-Means"
        }
    ]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prediction.router, prefix="/api/v1/prediction", tags=["Prediction"])
app.include_router(clustering.router, prefix="/api/v1/clustering", tags=["Clustering"])


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)
