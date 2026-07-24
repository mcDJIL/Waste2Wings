const ApiError = require('../utils/ApiError');
const prisma = require('../prismaClient');

const DEFAULT_ML_SERVICE_BASE_URL = 'http://localhost:3001';

function getMlServiceBaseUrl() {
  return (process.env.ML_SERVICE_BASE_URL || DEFAULT_ML_SERVICE_BASE_URL).replace(/\/$/, '');
}

async function requestMlService(path, { method = 'GET', body } = {}) {
  const response = await fetch(`${getMlServiceBaseUrl()}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const responseBody = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      502,
      responseBody?.detail || responseBody?.message || responseBody?.error || 'ML service request failed',
    );
  }

  return responseBody;
}

async function getReferencePrice(explicitReferencePrice) {
  if (explicitReferencePrice) {
    return explicitReferencePrice;
  }

  const setting = await prisma.stakeholderSetting.findFirst({
    orderBy: { updatedAt: 'desc' },
  });

  if (!setting) {
    throw new ApiError(400, 'Stakeholder reference price is not configured yet');
  }

  return setting.referencePricePerLiter;
}

async function trainFundingPrediction(req, res, next) {
  try {
    const { body } = req.validated;
    const result = await requestMlService('/api/prediction/train', {
      method: 'POST',
      body: {
        data_path: body.data_path || 'data/waste_oil_dummy.csv',
      },
    });

    res.json({ result });
  } catch (error) {
    next(error);
  }
}

async function predictFunding(req, res, next) {
  try {
    const { body } = req.validated;
    const referencePrice = await getReferencePrice(body.reference_price);
    const mlPayload = {
      ...body,
      reference_price: referencePrice,
    };
    const prediction = await requestMlService('/api/prediction/predict', {
      method: 'POST',
      body: mlPayload,
    });

    res.json({
      input: mlPayload,
      prediction,
    });
  } catch (error) {
    next(error);
  }
}

async function getFundingPredictionModelInfo(req, res, next) {
  try {
    const modelInfo = await requestMlService('/api/prediction/model-info');
    res.json({ modelInfo });
  } catch (error) {
    next(error);
  }
}

async function trainCollectorClustering(req, res, next) {
  try {
    const { body } = req.validated;
    const result = await requestMlService('/api/clustering/train', {
      method: 'POST',
      body: {
        data_path: body.data_path || 'data/collector_locations_dummy.csv',
      },
    });

    res.json({ result });
  } catch (error) {
    next(error);
  }
}

async function recommendCollectorArea(req, res, next) {
  try {
    const { body } = req.validated;
    const recommendation = await requestMlService('/api/clustering/recommend', {
      method: 'POST',
      body: {
        latitude: body.latitude,
        longitude: body.longitude,
      },
    });

    res.json({
      input: {
        latitude: body.latitude,
        longitude: body.longitude,
      },
      recommendation,
    });
  } catch (error) {
    next(error);
  }
}

async function predictCollectorCluster(req, res, next) {
  try {
    const { body } = req.validated;
    const cluster = await requestMlService('/api/clustering/predict', {
      method: 'POST',
      body: {
        latitude: body.latitude,
        longitude: body.longitude,
      },
    });

    res.json({
      input: {
        latitude: body.latitude,
        longitude: body.longitude,
      },
      cluster,
    });
  } catch (error) {
    next(error);
  }
}

async function getCollectorClusterAreas(req, res, next) {
  try {
    const areas = await requestMlService('/api/clustering/areas');
    res.json({ areas });
  } catch (error) {
    next(error);
  }
}

async function getCollectorClusteringModelInfo(req, res, next) {
  try {
    const modelInfo = await requestMlService('/api/clustering/model-info');
    res.json({ modelInfo });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCollectorClusterAreas,
  getCollectorClusteringModelInfo,
  getFundingPredictionModelInfo,
  predictCollectorCluster,
  predictFunding,
  recommendCollectorArea,
  trainCollectorClustering,
  trainFundingPrediction,
};
