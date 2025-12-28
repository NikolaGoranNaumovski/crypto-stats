import { useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  LinearProgress,
  Divider,
  Card,
  CardContent,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  BarChart3,
} from 'lucide-react';
import { performTechnicalAnalysis, type IndicatorResult } from '../utils/technical-indicators';

interface PriceData {
  date: string;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
}

interface TechnicalAnalysisPanelProps {
  data: PriceData[];
  cryptoName: string;
  timeFrame: 'day' | 'week' | 'month';
  onTimeFrameChange: (timeFrame: 'day' | 'week' | 'month') => void;
}

export function TechnicalAnalysisPanel({
  data,
  cryptoName,
  timeFrame,
  onTimeFrameChange,
}: TechnicalAnalysisPanelProps) {
  const analysis = useMemo(() => {
    // Filter data based on timeframe
    let filteredData = data;
    if (timeFrame === 'day') {
      filteredData = data.slice(-24); // Last 24 data points (1 day)
    } else if (timeFrame === 'week') {
      filteredData = data.slice(-168); // Last 7 days worth of data
    } else if (timeFrame === 'month') {
      filteredData = data.slice(-30); // Last 30 days
    }
    
    return performTechnicalAnalysis(filteredData);
  }, [data, timeFrame]);

  const getSignalColor = (signal: 'BUY' | 'SELL' | 'HOLD') => {
    switch (signal) {
      case 'BUY':
        return '#00ff41';
      case 'SELL':
        return '#ff1744';
      case 'HOLD':
        return '#ffa726';
    }
  };

  const getSignalIcon = (signal: 'BUY' | 'SELL' | 'HOLD') => {
    switch (signal) {
      case 'BUY':
        return <TrendingUp className="w-4 h-4" />;
      case 'SELL':
        return <TrendingDown className="w-4 h-4" />;
      case 'HOLD':
        return <Minus className="w-4 h-4" />;
    }
  };

  const renderIndicator = (indicator: IndicatorResult) => (
    <Card
      key={indicator.name}
      sx={{
        backgroundColor: '#1a1f3a',
        border: '1px solid rgba(0, 255, 65, 0.3)',
        boxShadow: '0 0 10px rgba(0, 255, 65, 0.1)',
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography
            sx={{
              color: '#00cc33',
              fontFamily: 'monospace',
            }}
          >
            {indicator.name}
          </Typography>
          <Chip
            icon={getSignalIcon(indicator.signal)}
            label={indicator.signal}
            size="small"
            sx={{
              backgroundColor: getSignalColor(indicator.signal) + '20',
              color: getSignalColor(indicator.signal),
              border: `1px solid ${getSignalColor(indicator.signal)}`,
              fontFamily: 'monospace',
              '& .MuiChip-icon': {
                color: getSignalColor(indicator.signal),
              },
            }}
          />
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: '#00ff41',
            fontFamily: 'monospace',
            mb: 1,
          }}
        >
          Value: {indicator.value}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: '#00cc33',
              fontFamily: 'monospace',
              minWidth: '80px',
            }}
          >
            Strength:
          </Typography>
          <LinearProgress
            variant="determinate"
            value={indicator.strength}
            sx={{
              flex: 1,
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(0, 255, 65, 0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: getSignalColor(indicator.signal),
                boxShadow: `0 0 10px ${getSignalColor(indicator.signal)}`,
              },
            }}
          />
          <Typography
            variant="caption"
            sx={{
              color: '#00ff41',
              fontFamily: 'monospace',
              minWidth: '35px',
              textAlign: 'right',
            }}
          >
            {indicator.strength.toFixed(0)}%
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const handleTimeFrameChange = (
    _event: React.MouseEvent<HTMLElement>,
    newTimeFrame: 'day' | 'week' | 'month' | null,
  ) => {
    if (newTimeFrame !== null) {
      onTimeFrameChange(newTimeFrame);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Activity className="w-6 h-6" style={{ color: '#00ff41' }} />
          <Typography
            variant="h5"
            sx={{
              color: '#00ff41',
              fontFamily: 'monospace',
              textShadow: '0 0 10px #00ff41',
            }}
          >
            {'>'}_ TECHNICAL_ANALYSIS
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
          [ANALYZING {cryptoName} - 5 OSCILLATORS & 5 MOVING AVERAGES]
        </Typography>

        {/* Time Frame Selector */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <ToggleButtonGroup
            value={timeFrame}
            exclusive
            onChange={handleTimeFrameChange}
            sx={{
              gap: 1,
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
            <ToggleButton value="day">1 DAY</ToggleButton>
            <ToggleButton value="week">1 WEEK</ToggleButton>
            <ToggleButton value="month">1 MONTH</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Overall Signal Summary */}
      <Paper
        sx={{
          backgroundColor: '#0f172a',
          border: '2px solid #00ff41',
          boxShadow: '0 0 20px rgba(0, 255, 65, 0.3)',
          p: 3,
          mb: 3,
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h6"
            sx={{
              color: '#00cc33',
              fontFamily: 'monospace',
              mb: 2,
            }}
          >
            OVERALL SIGNAL
          </Typography>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
              backgroundColor: getSignalColor(analysis.overallSignal) + '20',
              border: `2px solid ${getSignalColor(analysis.overallSignal)}`,
              borderRadius: 2,
              px: 4,
              py: 2,
              boxShadow: `0 0 20px ${getSignalColor(analysis.overallSignal)}50`,
            }}
          >
            {getSignalIcon(analysis.overallSignal)}
            <Typography
              variant="h4"
              sx={{
                color: getSignalColor(analysis.overallSignal),
                fontFamily: 'monospace',
              }}
            >
              {analysis.overallSignal}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 3 }}>
            <Box>
              <Typography
                variant="body2"
                sx={{ color: '#00cc33', fontFamily: 'monospace', mb: 0.5 }}
              >
                BUY SIGNALS
              </Typography>
              <Typography
                variant="h5"
                sx={{ color: '#00ff41', fontFamily: 'monospace' }}
              >
                {analysis.buyCount}
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(0, 255, 65, 0.3)' }} />
            <Box>
              <Typography
                variant="body2"
                sx={{ color: '#00cc33', fontFamily: 'monospace', mb: 0.5 }}
              >
                HOLD SIGNALS
              </Typography>
              <Typography
                variant="h5"
                sx={{ color: '#ffa726', fontFamily: 'monospace' }}
              >
                {analysis.holdCount}
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(0, 255, 65, 0.3)' }} />
            <Box>
              <Typography
                variant="body2"
                sx={{ color: '#00cc33', fontFamily: 'monospace', mb: 0.5 }}
              >
                SELL SIGNALS
              </Typography>
              <Typography
                variant="h5"
                sx={{ color: '#ff1744', fontFamily: 'monospace' }}
              >
                {analysis.sellCount}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Oscillators Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Activity className="w-5 h-5" style={{ color: '#00ff41' }} />
          <Typography
            variant="h6"
            sx={{
              color: '#00ff41',
              fontFamily: 'monospace',
            }}
          >
            OSCILLATORS (5)
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {analysis.oscillators.map((indicator) => (
            <Grid item xs={12} sm={6} md={4} key={indicator.name}>
              {renderIndicator(indicator)}
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Moving Averages Section */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <BarChart3 className="w-5 h-5" style={{ color: '#00ff41' }} />
          <Typography
            variant="h6"
            sx={{
              color: '#00ff41',
              fontFamily: 'monospace',
            }}
          >
            MOVING AVERAGES (5)
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {analysis.movingAverages.map((indicator) => (
            <Grid item xs={12} sm={6} md={4} key={indicator.name}>
              {renderIndicator(indicator)}
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Legend/Info */}
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
          }}
        >
          ℹ SIGNAL INTERPRETATION:
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: '#00cc33',
            fontFamily: 'monospace',
            display: 'block',
            mt: 1,
          }}
        >
          • BUY: Indicator suggests entering a long position
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: '#00cc33',
            fontFamily: 'monospace',
            display: 'block',
          }}
        >
          • SELL: Indicator suggests exiting or entering a short position
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: '#00cc33',
            fontFamily: 'monospace',
            display: 'block',
          }}
        >
          • HOLD: Indicator suggests maintaining current position
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: '#00cc33',
            fontFamily: 'monospace',
            display: 'block',
            mt: 1,
          }}
        >
          • Strength percentage indicates signal confidence (0-100%)
        </Typography>
      </Paper>
    </Box>
  );
}
