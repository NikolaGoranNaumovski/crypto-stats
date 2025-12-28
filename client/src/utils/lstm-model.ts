import * as tf from '@tensorflow/tfjs';

export interface PriceData {
  date: string;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
}

export interface LSTMPrediction {
  date: string;
  actual: number;
  predicted: number;
}

export interface ModelMetrics {
  rmse: number;
  mape: number;
  rSquared: number;
  trainLoss: number;
  valLoss: number;
}

export interface TrainingProgress {
  epoch: number;
  loss: number;
  valLoss: number;
}

/**
 * Normalize data to 0-1 range for better LSTM performance
 */
export function normalizeData(data: number[]): { normalized: number[]; min: number; max: number } {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  
  const normalized = data.map(val => (val - min) / range);
  
  return { normalized, min, max };
}

/**
 * Denormalize data back to original scale
 */
export function denormalizeData(normalized: number[], min: number, max: number): number[] {
  const range = max - min;
  return normalized.map(val => val * range + min);
}

/**
 * Create sequences for LSTM training
 * lookback: number of previous time steps to use for prediction
 */
export function createSequences(
  data: number[],
  lookback: number
): { X: number[][][]; y: number[] } {
  const X: number[][][] = [];
  const y: number[] = [];
  
  for (let i = lookback; i < data.length; i++) {
    // Create a sequence of lookback length
    const sequence: number[][] = [];
    for (let j = i - lookback; j < i; j++) {
      sequence.push([data[j]]);
    }
    X.push(sequence);
    y.push(data[i]);
  }
  
  return { X, y };
}

/**
 * Create multi-feature sequences for LSTM training
 * Uses OHLCV (Open, High, Low, Close, Volume) data
 */
export function createMultiFeatureSequences(
  priceData: PriceData[],
  lookback: number
): {
  X: number[][][];
  y: number[];
  scalers: {
    open: { min: number; max: number };
    high: { min: number; max: number };
    low: { min: number; max: number };
    close: { min: number; max: number };
    volume: { min: number; max: number };
  };
} {
  // Extract features
  const opens = priceData.map(d => d.open || d.price);
  const highs = priceData.map(d => d.high || d.price * 1.02);
  const lows = priceData.map(d => d.low || d.price * 0.98);
  const closes = priceData.map(d => d.close || d.price);
  const volumes = priceData.map(d => d.volume || 1000000);
  
  // Normalize each feature
  const openNorm = normalizeData(opens);
  const highNorm = normalizeData(highs);
  const lowNorm = normalizeData(lows);
  const closeNorm = normalizeData(closes);
  const volumeNorm = normalizeData(volumes);
  
  const X: number[][][] = [];
  const y: number[] = [];
  
  for (let i = lookback; i < priceData.length; i++) {
    const sequence: number[][] = [];
    for (let j = i - lookback; j < i; j++) {
      sequence.push([
        openNorm.normalized[j],
        highNorm.normalized[j],
        lowNorm.normalized[j],
        closeNorm.normalized[j],
        volumeNorm.normalized[j],
      ]);
    }
    X.push(sequence);
    y.push(closeNorm.normalized[i]);
  }
  
  return {
    X,
    y,
    scalers: {
      open: { min: openNorm.min, max: openNorm.max },
      high: { min: highNorm.min, max: highNorm.max },
      low: { min: lowNorm.min, max: lowNorm.max },
      close: { min: closeNorm.min, max: closeNorm.max },
      volume: { min: volumeNorm.min, max: volumeNorm.max },
    },
  };
}

/**
 * Build LSTM model architecture
 */
export function buildLSTMModel(
  inputShape: [number, number],
  lstmUnits: number = 50,
  dropout: number = 0.2
): tf.LayersModel {
  const model = tf.sequential();
  
  // First LSTM layer with return sequences
  model.add(
    tf.layers.lstm({
      units: lstmUnits,
      returnSequences: true,
      inputShape: inputShape,
    })
  );
  model.add(tf.layers.dropout({ rate: dropout }));
  
  // Second LSTM layer
  model.add(
    tf.layers.lstm({
      units: lstmUnits / 2,
      returnSequences: false,
    })
  );
  model.add(tf.layers.dropout({ rate: dropout }));
  
  // Dense layers
  model.add(tf.layers.dense({ units: 25, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1 }));
  
  // Compile model with MSE loss
  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'meanSquaredError',
    metrics: ['mse'],
  });
  
  return model;
}

/**
 * Train LSTM model
 */
export async function trainLSTMModel(
  model: tf.LayersModel,
  X: number[][][],
  y: number[],
  trainSplit: number = 0.7,
  epochs: number = 50,
  batchSize: number = 32,
  onProgress?: (progress: TrainingProgress) => void
): Promise<{
  model: tf.LayersModel;
  history: tf.History;
  trainSize: number;
}> {
  // Split data into training and validation sets
  const trainSize = Math.floor(X.length * trainSplit);
  
  const XTrain = X.slice(0, trainSize);
  const yTrain = y.slice(0, trainSize);
  const XVal = X.slice(trainSize);
  const yVal = y.slice(trainSize);
  
  // Convert to tensors
  const XTrainTensor = tf.tensor3d(XTrain);
  const yTrainTensor = tf.tensor2d(yTrain, [yTrain.length, 1]);
  const XValTensor = tf.tensor3d(XVal);
  const yValTensor = tf.tensor2d(yVal, [yVal.length, 1]);
  
  // Train model
  const history = await model.fit(XTrainTensor, yTrainTensor, {
    epochs: epochs,
    batchSize: batchSize,
    validationData: [XValTensor, yValTensor],
    shuffle: true,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        if (onProgress && logs) {
          onProgress({
            epoch: epoch + 1,
            loss: logs.loss,
            valLoss: logs.val_loss || 0,
          });
        }
      },
    },
  });
  
  // Clean up tensors
  XTrainTensor.dispose();
  yTrainTensor.dispose();
  XValTensor.dispose();
  yValTensor.dispose();
  
  return { model, history, trainSize };
}

/**
 * Make predictions using trained model
 */
export async function makePredictions(
  model: tf.LayersModel,
  X: number[][][]
): Promise<number[]> {
  const XTensor = tf.tensor3d(X);
  const predictions = model.predict(XTensor) as tf.Tensor;
  const predictionsArray = await predictions.data();
  
  // Clean up tensors
  XTensor.dispose();
  predictions.dispose();
  
  return Array.from(predictionsArray);
}

/**
 * Calculate RMSE (Root Mean Square Error)
 */
export function calculateRMSE(actual: number[], predicted: number[]): number {
  const n = actual.length;
  let sumSquaredError = 0;
  
  for (let i = 0; i < n; i++) {
    const error = actual[i] - predicted[i];
    sumSquaredError += error * error;
  }
  
  return Math.sqrt(sumSquaredError / n);
}

/**
 * Calculate MAPE (Mean Absolute Percentage Error)
 */
export function calculateMAPE(actual: number[], predicted: number[]): number {
  const n = actual.length;
  let sumPercentError = 0;
  
  for (let i = 0; i < n; i++) {
    if (actual[i] !== 0) {
      const percentError = Math.abs((actual[i] - predicted[i]) / actual[i]);
      sumPercentError += percentError;
    }
  }
  
  return (sumPercentError / n) * 100;
}

/**
 * Calculate R-squared (Coefficient of Determination)
 */
export function calculateRSquared(actual: number[], predicted: number[]): number {
  const n = actual.length;
  const mean = actual.reduce((sum, val) => sum + val, 0) / n;
  
  let ssRes = 0; // Sum of squares of residuals
  let ssTot = 0; // Total sum of squares
  
  for (let i = 0; i < n; i++) {
    ssRes += Math.pow(actual[i] - predicted[i], 2);
    ssTot += Math.pow(actual[i] - mean, 2);
  }
  
  return 1 - (ssRes / ssTot);
}

/**
 * Predict future prices
 */
export async function predictFuture(
  model: tf.LayersModel,
  lastSequence: number[][],
  steps: number,
  scaler: { min: number; max: number }
): Promise<number[]> {
  const predictions: number[] = [];
  const currentSequence = [...lastSequence];
  
  for (let i = 0; i < steps; i++) {
    // Prepare input tensor
    const inputTensor = tf.tensor3d([currentSequence]);
    
    // Make prediction
    const predictionTensor = model.predict(inputTensor) as tf.Tensor;
    const predictionArray = await predictionTensor.data();
    const normalizedPrediction = predictionArray[0];
    
    // Denormalize prediction
    const actualPrediction = normalizedPrediction * (scaler.max - scaler.min) + scaler.min;
    predictions.push(actualPrediction);
    
    // Update sequence for next prediction
    currentSequence.shift();
    currentSequence.push([normalizedPrediction]);
    
    // Clean up tensors
    inputTensor.dispose();
    predictionTensor.dispose();
  }
  
  return predictions;
}

/**
 * Complete LSTM training and evaluation pipeline
 */
export async function trainAndEvaluateLSTM(
  data: PriceData[],
  lookback: number = 30,
  trainSplit: number = 0.7,
  epochs: number = 50,
  onProgress?: (progress: TrainingProgress) => void
): Promise<{
  predictions: LSTMPrediction[];
  metrics: ModelMetrics;
  model: tf.LayersModel;
  scaler: { min: number; max: number };
  trainSize: number;
}> {
  // Prepare data
  const prices = data.map(d => d.close || d.price);
  const { normalized, min, max } = normalizeData(prices);
  const { X, y } = createSequences(normalized, lookback);
  
  // Build model
  const inputShape: [number, number] = [lookback, 1];
  const model = buildLSTMModel(inputShape);
  
  // Train model
  const { history, trainSize } = await trainLSTMModel(
    model,
    X,
    y,
    trainSplit,
    epochs,
    32,
    onProgress
  );
  
  // Make predictions on all data
  const predictedNormalized = await makePredictions(model, X);
  const predictedActual = denormalizeData(predictedNormalized, min, max);
  
  // Get actual values (starting from lookback index)
  const actualValues = prices.slice(lookback);
  
  // Calculate validation metrics (only on validation set)
  const valStartIdx = trainSize;
  const actualVal = actualValues.slice(valStartIdx);
  const predictedVal = predictedActual.slice(valStartIdx);
  
  const rmse = calculateRMSE(actualVal, predictedVal);
  const mape = calculateMAPE(actualVal, predictedVal);
  const rSquared = calculateRSquared(actualVal, predictedVal);
  
  // Get training and validation loss from history
  const trainLoss = history.history.loss[history.history.loss.length - 1] as number;
  const valLoss = history.history.val_loss?.[history.history.val_loss.length - 1] as number || 0;
  
  // Create predictions array with dates
  const predictions: LSTMPrediction[] = actualValues.map((actual, idx) => ({
    date: data[idx + lookback].date,
    actual: actual,
    predicted: predictedActual[idx],
  }));
  
  return {
    predictions,
    metrics: {
      rmse,
      mape,
      rSquared,
      trainLoss,
      valLoss,
    },
    model,
    scaler: { min, max },
    trainSize,
  };
}
