import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  LinearProgress,
  Button,
  Card,
  CardContent,
  Alert,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { Brain, TrendingUp, Play, AlertCircle } from 'lucide-react';
import {
  trainAndEvaluateLSTM,
  predictFuture,
  type TrainingProgress,
  type LSTMPrediction,
  type ModelMetrics,
  type PriceData,
} from '../utils/lstm-model';

interface LSTMPredictionPanelProps {
  data: PriceData[];
  cryptoName: string;
}

type ViewMode = 'training' | 'validation' | 'all';

export function LSTMPredictionPanel({ data, cryptoName }: LSTMPredictionPanelProps) {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState<TrainingProgress | null>(null);
  const [predictions, setPredictions] = useState<LSTMPrediction[] | null>(null);
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [trainSize, setTrainSize] = useState<number>(0);
  const [futurePredictions, setFuturePredictions] = useState<{ date: string; predicted: number }[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [lookback, setLookback] = useState<number>(30);
  const [error, setError] = useState<string | null>(null);

  const handleTrain = async () => {
    try {
      setIsTraining(true);
      setError(null);
      setTrainingProgress(null);
      
      // Train model
      const result = await trainAndEvaluateLSTM(
        data,
        lookback,
        0.7,
        50,
        (progress) => {
          setTrainingProgress(progress);
        }
      );
      
      setPredictions(result.predictions);
      setMetrics(result.metrics);
      setTrainSize(result.trainSize);
      
      // Generate future predictions (7 days)
      if (result.model && result.scaler) {
        const lastSequence = data
          .slice(-lookback)
          .map(d => {
            const price = d.close || d.price;
            return [(price - result.scaler.min) / (result.scaler.max - result.scaler.min)];
          });
        
        const future = await predictFuture(result.model, lastSequence, 7, result.scaler);
        
        const futureDates = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() + i + 1);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        
        setFuturePredictions(
          future.map((pred, idx) => ({
            date: futureDates[idx],
            predicted: pred,
          }))
        );
      }
      
      setIsTraining(false);
    } catch (err) {
      console.error('Training error:', err);
      setError('Failed to train model. Please try again.');
      setIsTraining(false);
    }
  };

  const getChartData = () => {
    if (!predictions) return [];
    
    switch (viewMode) {
      case 'training':
        return predictions.slice(0, trainSize);
      case 'validation':
        return predictions.slice(trainSize);
      case 'all':
      default:
        return predictions;
    }
  };

  const chartData = getChartData();

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;

    return (
      <Box
        sx={{
          backgroundColor: 'rgba(10, 14, 39, 0.95)',
          border: '1px solid #00ff41',
          borderRadius: 1,
          p: 2,
          boxShadow: '0 0 20px rgba(0, 255, 65, 0.3)',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: '#00ff41',
            fontFamily: 'monospace',
            display: 'block',
            mb: 1,
          }}
        >
          {data.date}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: '#00ff41',
            fontFamily: 'monospace',
            display: 'block',
          }}
        >
          Actual: ${data.actual?.toFixed(2)}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: '#42a5f5',
            fontFamily: 'monospace',
            display: 'block',
          }}
        >
          Predicted: ${data.predicted?.toFixed(2)}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: '#ffa726',
            fontFamily: 'monospace',
            display: 'block',
          }}
        >
          Error: ${Math.abs(data.actual - data.predicted).toFixed(2)}
        </Typography>
      </Box>
    );
  };

  const handleViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: ViewMode | null
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleLookbackChange = (
    _event: React.MouseEvent<HTMLElement>,
    newLookback: number | null
  ) => {
    if (newLookback !== null) {
      setLookback(newLookback);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Brain className="w-6 h-6" style={{ color: '#00ff41' }} />
          <Typography
            variant="h5"
            sx={{
              color: '#00ff41',
              fontFamily: 'monospace',
              textShadow: '0 0 10px #00ff41',
            }}
          >
            {'>'}_ LSTM_PRICE_PREDICTION
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: '#00cc33',
            fontFamily: 'monospace',
            mb: 2,
          }}
        >
          [DEEP LEARNING NEURAL NETWORK FOR {cryptoName} PRICE FORECASTING]
        </Typography>

        {/* Configuration */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <Typography
            variant="body2"
            sx={{
              color: '#00cc33',
              fontFamily: 'monospace',
            }}
          >
            LOOKBACK PERIOD:
          </Typography>
          <ToggleButtonGroup
            value={lookback}
            exclusive
            onChange={handleLookbackChange}
            disabled={isTraining}
            sx={{
              '& .MuiToggleButton-root': {
                color: '#00cc33',
                borderColor: '#00ff41',
                fontFamily: 'monospace',
                px: 2,
                py: 0.5,
                '&.Mui-selected': {
                  backgroundColor: '#00ff41',
                  color: '#0a0e27',
                  '&:hover': {
                    backgroundColor: '#00cc33',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(0, 255, 65, 0.1)',
                },
              },
            }}
          >
            <ToggleButton value={20}>20 days</ToggleButton>
            <ToggleButton value={30}>30 days</ToggleButton>
            <ToggleButton value={60}>60 days</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Train Button */}
        <Button
          variant="contained"
          startIcon={<Play className="w-4 h-4" />}
          onClick={handleTrain}
          disabled
          sx={{
            backgroundColor: '#00ff41',
            color: '#0a0e27',
            fontFamily: 'monospace',
            '&:hover': {
              backgroundColor: '#00cc33',
              boxShadow: '0 0 20px rgba(0, 255, 65, 0.5)',
            },
            '&:disabled': {
              backgroundColor: 'rgba(0, 255, 65, 0.3)',
              color: 'rgba(10, 14, 39, 0.5)',
            },
          }}
        >
          {isTraining ? 'TRAINING MODEL...' : 'TRAIN LSTM MODEL'}
        </Button>

        {data.length < lookback + 20 && (
          <Alert
            severity="warning"
            icon={<AlertCircle className="w-4 h-4" />}
            sx={{
              mt: 2,
              backgroundColor: 'rgba(255, 167, 38, 0.1)',
              color: '#ffa726',
              border: '1px solid #ffa726',
              fontFamily: 'monospace',
            }}
          >
            Insufficient data for training. Need at least {lookback + 20} data points.
          </Alert>
        )}
      </Box>

      {/* Training Progress */}
      {isTraining && trainingProgress && (
        <Paper
          sx={{
            backgroundColor: '#0f172a',
            border: '1px solid #00ff41',
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.2)',
            p: 3,
            mb: 3,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#00ff41',
              fontFamily: 'monospace',
              mb: 2,
            }}
          >
            TRAINING EPOCH {trainingProgress.epoch} / 50
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(trainingProgress.epoch / 50) * 100}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: 'rgba(0, 255, 65, 0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#00ff41',
                boxShadow: '0 0 10px #00ff41',
              },
              mb: 2,
            }}
          />
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Typography
              variant="caption"
              sx={{
                color: '#00cc33',
                fontFamily: 'monospace',
              }}
            >
              Training Loss: {trainingProgress.loss.toFixed(6)}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#00cc33',
                fontFamily: 'monospace',
              }}
            >
              Validation Loss: {trainingProgress.valLoss.toFixed(6)}
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Error */}
      {error && (
        <Alert
          severity="error"
          icon={<AlertCircle className="w-4 h-4" />}
          sx={{
            mb: 3,
            backgroundColor: 'rgba(255, 23, 68, 0.1)',
            color: '#ff1744',
            border: '1px solid #ff1744',
            fontFamily: 'monospace',
          }}
        >
          {error}
        </Alert>
      )}

      {/* Results */}
      {predictions && metrics && (
        <>
          {/* Metrics Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  backgroundColor: '#1a1f3a',
                  border: '1px solid rgba(0, 255, 65, 0.3)',
                  boxShadow: '0 0 10px rgba(0, 255, 65, 0.1)',
                }}
              >
                <CardContent>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#00cc33',
                      fontFamily: 'monospace',
                    }}
                  >
                    RMSE
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#00ff41',
                      fontFamily: 'monospace',
                    }}
                  >
                    ${metrics.rmse.toFixed(2)}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#00cc33',
                      fontFamily: 'monospace',
                    }}
                  >
                    Root Mean Square Error
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  backgroundColor: '#1a1f3a',
                  border: '1px solid rgba(0, 255, 65, 0.3)',
                  boxShadow: '0 0 10px rgba(0, 255, 65, 0.1)',
                }}
              >
                <CardContent>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#00cc33',
                      fontFamily: 'monospace',
                    }}
                  >
                    MAPE
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#00ff41',
                      fontFamily: 'monospace',
                    }}
                  >
                    {metrics.mape.toFixed(2)}%
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#00cc33',
                      fontFamily: 'monospace',
                    }}
                  >
                    Mean Absolute % Error
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  backgroundColor: '#1a1f3a',
                  border: '1px solid rgba(0, 255, 65, 0.3)',
                  boxShadow: '0 0 10px rgba(0, 255, 65, 0.1)',
                }}
              >
                <CardContent>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#00cc33',
                      fontFamily: 'monospace',
                    }}
                  >
                    R-SQUARED
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#00ff41',
                      fontFamily: 'monospace',
                    }}
                  >
                    {metrics.rSquared.toFixed(4)}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#00cc33',
                      fontFamily: 'monospace',
                    }}
                  >
                    Coefficient of Determination
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  backgroundColor: '#1a1f3a',
                  border: '1px solid rgba(0, 255, 65, 0.3)',
                  boxShadow: '0 0 10px rgba(0, 255, 65, 0.1)',
                }}
              >
                <CardContent>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#00cc33',
                      fontFamily: 'monospace',
                    }}
                  >
                    ACCURACY
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#00ff41',
                      fontFamily: 'monospace',
                    }}
                  >
                    {(100 - metrics.mape).toFixed(2)}%
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#00cc33',
                      fontFamily: 'monospace',
                    }}
                  >
                    Prediction Accuracy
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* View Mode Toggle */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              sx={{
                '& .MuiToggleButton-root': {
                  color: '#00cc33',
                  borderColor: '#00ff41',
                  fontFamily: 'monospace',
                  px: 3,
                  '&.Mui-selected': {
                    backgroundColor: '#00ff41',
                    color: '#0a0e27',
                    '&:hover': {
                      backgroundColor: '#00cc33',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(0, 255, 65, 0.1)',
                  },
                },
              }}
            >
              <ToggleButton value="all">ALL DATA</ToggleButton>
              <ToggleButton value="training">TRAINING (70%)</ToggleButton>
              <ToggleButton value="validation">VALIDATION (30%)</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Predictions Chart */}
          <Paper
            sx={{
              backgroundColor: '#0f172a',
              border: '1px solid #00ff41',
              boxShadow: '0 0 20px rgba(0, 255, 65, 0.2)',
              p: 3,
              mb: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: '#00ff41',
                fontFamily: 'monospace',
                mb: 2,
              }}
            >
              ACTUAL VS PREDICTED PRICES
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 255, 65, 0.1)" />
                <XAxis
                  dataKey="date"
                  stroke="#00cc33"
                  style={{ fontFamily: 'monospace', fontSize: '12px' }}
                />
                <YAxis
                  stroke="#00cc33"
                  style={{ fontFamily: 'monospace', fontSize: '12px' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{
                    fontFamily: 'monospace',
                    color: '#00cc33',
                  }}
                />
                {viewMode === 'all' && trainSize > 0 && (
                  <ReferenceLine
                    x={predictions[trainSize]?.date}
                    stroke="#ffa726"
                    strokeDasharray="5 5"
                    label={{
                      value: 'Train/Val Split',
                      fill: '#ffa726',
                      fontFamily: 'monospace',
                    }}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#00ff41"
                  strokeWidth={2}
                  dot={false}
                  name="Actual Price"
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#42a5f5"
                  strokeWidth={2}
                  dot={false}
                  name="Predicted Price"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>

          {/* Future Predictions */}
          {futurePredictions.length > 0 && (
            <Paper
              sx={{
                backgroundColor: '#0f172a',
                border: '2px solid #00ff41',
                boxShadow: '0 0 20px rgba(0, 255, 65, 0.3)',
                p: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TrendingUp className="w-5 h-5" style={{ color: '#00ff41' }} />
                <Typography
                  variant="h6"
                  sx={{
                    color: '#00ff41',
                    fontFamily: 'monospace',
                  }}
                >
                  7-DAY FUTURE FORECAST
                </Typography>
              </Box>
              <Grid container spacing={1}>
                {futurePredictions.map((pred, idx) => (
                  <Grid item xs={12} sm={6} md={3} key={idx}>
                    <Box
                      sx={{
                        backgroundColor: 'rgba(0, 255, 65, 0.1)',
                        border: '1px solid rgba(0, 255, 65, 0.3)',
                        borderRadius: 1,
                        p: 1.5,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#00cc33',
                          fontFamily: 'monospace',
                          display: 'block',
                        }}
                      >
                        {pred.date}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: '#00ff41',
                          fontFamily: 'monospace',
                        }}
                      >
                        ${pred.predicted.toFixed(2)}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}

          {/* Model Info */}
          <Paper
            sx={{
              backgroundColor: 'rgba(0, 255, 65, 0.05)',
              border: '1px solid rgba(0, 255, 65, 0.2)',
              p: 2,
              mt: 3,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: '#00cc33',
                fontFamily: 'monospace',
                display: 'block',
                mb: 1,
              }}
            >
              ℹ MODEL CONFIGURATION:
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6} md={3}>
                <Chip
                  label={`Lookback: ${lookback} days`}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(0, 255, 65, 0.1)',
                    color: '#00cc33',
                    border: '1px solid rgba(0, 255, 65, 0.3)',
                    fontFamily: 'monospace',
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Chip
                  label="LSTM Layers: 2"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(0, 255, 65, 0.1)',
                    color: '#00cc33',
                    border: '1px solid rgba(0, 255, 65, 0.3)',
                    fontFamily: 'monospace',
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Chip
                  label="Train Split: 70%"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(0, 255, 65, 0.1)',
                    color: '#00cc33',
                    border: '1px solid rgba(0, 255, 65, 0.3)',
                    fontFamily: 'monospace',
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Chip
                  label="Epochs: 50"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(0, 255, 65, 0.1)',
                    color: '#00cc33',
                    border: '1px solid rgba(0, 255, 65, 0.3)',
                    fontFamily: 'monospace',
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </>
      )}
    </Box>
  );
}
