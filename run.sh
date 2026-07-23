#!/bin/bash

# Script untuk menjalankan FastAPI server

echo "Starting Waste Oil ML API Server..."
python -m uvicorn src.api:app --reload --host 0.0.0.0 --port 3001
