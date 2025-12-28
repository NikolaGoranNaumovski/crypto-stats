import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Chip,
} from '@mui/material';
import { ChevronDown, Activity, BarChart3 } from 'lucide-react';

export function IndicatorGuide() {
  const oscillators = [
    {
      name: 'RSI (Relative Strength Index)',
      description:
        'RSI measures the magnitude of recent price changes to evaluate overbought or oversold conditions.',
      interpretation: [
        'RSI < 30: Oversold condition - potential BUY signal',
        'RSI > 70: Overbought condition - potential SELL signal',
        'RSI 30-70: Neutral zone - HOLD signal',
      ],
      period: '14 periods',
    },
    {
      name: 'MACD (Moving Average Convergence Divergence)',
      description:
        'MACD is a trend-following momentum indicator that shows the relationship between two moving averages.',
      interpretation: [
        'MACD line above signal line: Bullish - BUY signal',
        'MACD line below signal line: Bearish - SELL signal',
        'Histogram crossing zero: Potential trend change',
      ],
      period: 'EMA 12, 26, signal line 9',
    },
    {
      name: 'Stochastic Oscillator',
      description:
        'Compares a closing price to its price range over a given time period to identify turning points.',
      interpretation: [
        '%K < 20: Oversold - BUY signal',
        '%K > 80: Overbought - SELL signal',
        '%K between 20-80: HOLD signal',
      ],
      period: '14 periods',
    },
    {
      name: 'ADX (Average Directional Index)',
      description:
        'ADX measures trend strength without regard to trend direction. Higher values indicate stronger trends.',
      interpretation: [
        'ADX > 25 with +DI > -DI: Strong uptrend - BUY',
        'ADX > 25 with -DI > +DI: Strong downtrend - SELL',
        'ADX < 25: Weak trend - HOLD',
      ],
      period: '14 periods',
    },
    {
      name: 'CCI (Commodity Channel Index)',
      description:
        'CCI measures the current price level relative to an average price level over a given period.',
      interpretation: [
        'CCI > +100: Overbought - SELL signal',
        'CCI < -100: Oversold - BUY signal',
        'CCI between -100 and +100: HOLD',
      ],
      period: '20 periods',
    },
  ];

  const movingAverages = [
    {
      name: 'SMA (Simple Moving Average)',
      description:
        'SMA calculates the average of prices over a specific number of periods, giving equal weight to each price.',
      interpretation: [
        'Price > SMA: Uptrend - BUY signal',
        'Price < SMA: Downtrend - SELL signal',
        'Price crossing SMA: Potential trend reversal',
      ],
      period: '20 periods',
    },
    {
      name: 'EMA (Exponential Moving Average)',
      description:
        'EMA gives more weight to recent prices, making it more responsive to new information than SMA.',
      interpretation: [
        'Price > EMA: Bullish momentum - BUY',
        'Price < EMA: Bearish momentum - SELL',
        'EMA crossovers: Strong trend signals',
      ],
      period: '20 periods',
    },
    {
      name: 'WMA (Weighted Moving Average)',
      description:
        'WMA assigns linearly increasing weights to recent data points, more responsive than SMA but less than EMA.',
      interpretation: [
        'Price > WMA: Positive trend - BUY',
        'Price < WMA: Negative trend - SELL',
        'WMA slope indicates trend strength',
      ],
      period: '20 periods',
    },
    {
      name: 'Bollinger Bands',
      description:
        'Bollinger Bands consist of a middle band (SMA) and two outer bands (standard deviations) that measure volatility.',
      interpretation: [
        'Price at lower band: Oversold - BUY signal',
        'Price at upper band: Overbought - SELL signal',
        'Band squeeze: Low volatility, potential breakout',
      ],
      period: '20 periods, 2 std dev',
    },
    {
      name: 'Volume Moving Average',
      description:
        'Volume MA smooths volume data to identify trends in trading activity.',
      interpretation: [
        'Volume > MA with price up: Strong BUY',
        'Volume > MA with price down: Strong SELL',
        'Volume < MA: Weak trend - HOLD',
      ],
      period: '20 periods',
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography
          variant="h5"
          sx={{
            color: '#00ff41',
            fontFamily: 'monospace',
            textShadow: '0 0 10px #00ff41',
            mb: 2,
          }}
        >
          {'>'}_ INDICATOR_GUIDE
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#00cc33',
            fontFamily: 'monospace',
          }}
        >
          [UNDERSTANDING TECHNICAL INDICATORS]
        </Typography>
      </Box>

      {/* Oscillators */}
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
            OSCILLATORS
          </Typography>
        </Box>

        {oscillators.map((indicator, index) => (
          <Accordion
            key={index}
            sx={{
              backgroundColor: '#1a1f3a',
              border: '1px solid rgba(0, 255, 65, 0.3)',
              mb: 1,
              '&:before': {
                display: 'none',
              },
              '&.Mui-expanded': {
                boxShadow: '0 0 15px rgba(0, 255, 65, 0.2)',
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ChevronDown style={{ color: '#00ff41' }} />}
              sx={{
                '& .MuiAccordionSummary-content': {
                  alignItems: 'center',
                  gap: 2,
                },
              }}
            >
              <Typography
                sx={{
                  color: '#00ff41',
                  fontFamily: 'monospace',
                  flex: 1,
                }}
              >
                {indicator.name}
              </Typography>
              <Chip
                label={indicator.period}
                size="small"
                sx={{
                  backgroundColor: 'rgba(0, 255, 65, 0.1)',
                  color: '#00cc33',
                  border: '1px solid rgba(0, 255, 65, 0.3)',
                  fontFamily: 'monospace',
                }}
              />
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="body2"
                sx={{
                  color: '#00cc33',
                  fontFamily: 'monospace',
                  mb: 2,
                }}
              >
                {indicator.description}
              </Typography>
              <Divider sx={{ borderColor: 'rgba(0, 255, 65, 0.2)', mb: 2 }} />
              <Typography
                variant="caption"
                sx={{
                  color: '#00ff41',
                  fontFamily: 'monospace',
                  display: 'block',
                  mb: 1,
                }}
              >
                SIGNAL INTERPRETATION:
              </Typography>
              {indicator.interpretation.map((item, idx) => (
                <Typography
                  key={idx}
                  variant="caption"
                  sx={{
                    color: '#00cc33',
                    fontFamily: 'monospace',
                    display: 'block',
                    ml: 2,
                    mb: 0.5,
                  }}
                >
                  • {item}
                </Typography>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Moving Averages */}
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
            MOVING AVERAGES
          </Typography>
        </Box>

        {movingAverages.map((indicator, index) => (
          <Accordion
            key={index}
            sx={{
              backgroundColor: '#1a1f3a',
              border: '1px solid rgba(0, 255, 65, 0.3)',
              mb: 1,
              '&:before': {
                display: 'none',
              },
              '&.Mui-expanded': {
                boxShadow: '0 0 15px rgba(0, 255, 65, 0.2)',
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ChevronDown style={{ color: '#00ff41' }} />}
              sx={{
                '& .MuiAccordionSummary-content': {
                  alignItems: 'center',
                  gap: 2,
                },
              }}
            >
              <Typography
                sx={{
                  color: '#00ff41',
                  fontFamily: 'monospace',
                  flex: 1,
                }}
              >
                {indicator.name}
              </Typography>
              <Chip
                label={indicator.period}
                size="small"
                sx={{
                  backgroundColor: 'rgba(0, 255, 65, 0.1)',
                  color: '#00cc33',
                  border: '1px solid rgba(0, 255, 65, 0.3)',
                  fontFamily: 'monospace',
                }}
              />
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="body2"
                sx={{
                  color: '#00cc33',
                  fontFamily: 'monospace',
                  mb: 2,
                }}
              >
                {indicator.description}
              </Typography>
              <Divider sx={{ borderColor: 'rgba(0, 255, 65, 0.2)', mb: 2 }} />
              <Typography
                variant="caption"
                sx={{
                  color: '#00ff41',
                  fontFamily: 'monospace',
                  display: 'block',
                  mb: 1,
                }}
              >
                SIGNAL INTERPRETATION:
              </Typography>
              {indicator.interpretation.map((item, idx) => (
                <Typography
                  key={idx}
                  variant="caption"
                  sx={{
                    color: '#00cc33',
                    fontFamily: 'monospace',
                    display: 'block',
                    ml: 2,
                    mb: 0.5,
                  }}
                >
                  • {item}
                </Typography>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Best Practices */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          backgroundColor: 'rgba(0, 255, 65, 0.05)',
          border: '1px solid rgba(0, 255, 65, 0.3)',
          borderRadius: 1,
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
          ⚠ BEST PRACTICES
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: '#00cc33',
            fontFamily: 'monospace',
            display: 'block',
            mb: 1,
          }}
        >
          • Never rely on a single indicator - use multiple confirmations
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: '#00cc33',
            fontFamily: 'monospace',
            display: 'block',
            mb: 1,
          }}
        >
          • Consider overall market conditions and trends
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: '#00cc33',
            fontFamily: 'monospace',
            display: 'block',
            mb: 1,
          }}
        >
          • Different time frames may give different signals
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: '#00cc33',
            fontFamily: 'monospace',
            display: 'block',
            mb: 1,
          }}
        >
          • Combine technical analysis with fundamental analysis
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: '#00cc33',
            fontFamily: 'monospace',
            display: 'block',
          }}
        >
          • Past performance does not guarantee future results
        </Typography>
      </Box>
    </Box>
  );
}
