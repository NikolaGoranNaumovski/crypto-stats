/* eslint-disable react-hooks/static-components */
import { useMemo, useState } from "react";
import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
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
} from "recharts";
import {
  calculateRSI,
  calculateMACD,
  calculateSMA,
  calculateEMAIndicator,
  calculateBollingerBands,
} from "../utils/technical-indicators";

interface ChartDataPoint {
  date: string;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
}

interface EnhancedCryptoChartProps {
  data: ChartDataPoint[];
  timeRange: string;
}

type ChartType = "price" | "rsi" | "macd";

export function CryptoChart({ data }: EnhancedCryptoChartProps) {
  const [chartType, setChartType] = useState<ChartType>("price");
  const [showSMA, setShowSMA] = useState(true);
  const [showEMA, setShowEMA] = useState(true);
  const [showBollinger, setShowBollinger] = useState(false);

  const enhancedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map((point, index) => {
      const result = {
        ...point,
        sma: 0,
        ema: 0,
        macd: 0,
        rsi: 0,
        bollingerUpper: 0,
        bollingerLower: 0,
        price: point.price,
      };

      // Add moving averages (only calculate for visible points to optimize)
      if (index >= 19) {
        const slicedData = data.slice(0, index + 1);
        const sma = calculateSMA(slicedData, 20);
        const ema = calculateEMAIndicator(slicedData, 20);

        result.sma =
          typeof sma.value === "string" ? 0 : parseFloat(sma.value.toString());
        result.ema =
          typeof ema.value === "string" ? 0 : parseFloat(ema.value.toString());

        // Bollinger Bands
        const bb = calculateBollingerBands(slicedData, 20);
        if (typeof bb.value === "string" && bb.value !== "N/A") {
          const parts = bb.value.split(" / ");
          result.bollingerLower = parseFloat(parts[0]);
          result.bollingerUpper = parseFloat(parts[1]);
        }
      }

      // Add RSI value
      if (index >= 14) {
        const slicedData = data.slice(0, index + 1);
        const rsi = calculateRSI(slicedData, 14);
        result.rsi =
          typeof rsi.value === "string" ? 0 : parseFloat(rsi.value.toString());
      }

      // Add MACD value
      if (index >= 26) {
        const slicedData = data.slice(0, index + 1);
        const macd = calculateMACD(slicedData);
        result.macd =
          typeof macd.value === "string"
            ? 0
            : parseFloat(macd.value.toString());
      }

      return result;
    });
  }, [data]);

  const handleChartTypeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newType: ChartType | null
  ) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;

    return (
      <Box
        sx={{
          backgroundColor: "rgba(10, 14, 39, 0.95)",
          border: "1px solid #00ff41",
          borderRadius: 1,
          p: 2,
          boxShadow: "0 0 20px rgba(0, 255, 65, 0.3)",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "#00ff41",
            fontFamily: "monospace",
            display: "block",
            mb: 1,
          }}
        >
          {data.date}
        </Typography>
        {chartType === "price" && (
          <>
            <Typography
              variant="caption"
              sx={{
                color: "#00ff41",
                fontFamily: "monospace",
                display: "block",
              }}
            >
              Price: ${data.price?.toFixed(2)}
            </Typography>
            {showSMA && data.sma && (
              <Typography
                variant="caption"
                sx={{
                  color: "#ffa726",
                  fontFamily: "monospace",
                  display: "block",
                }}
              >
                SMA(20): ${data.sma.toFixed(2)}
              </Typography>
            )}
            {showEMA && data.ema && (
              <Typography
                variant="caption"
                sx={{
                  color: "#42a5f5",
                  fontFamily: "monospace",
                  display: "block",
                }}
              >
                EMA(20): ${data.ema.toFixed(2)}
              </Typography>
            )}
            {showBollinger && data.bollingerUpper && (
              <>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#ff1744",
                    fontFamily: "monospace",
                    display: "block",
                  }}
                >
                  BB Upper: ${data.bollingerUpper.toFixed(2)}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#ff1744",
                    fontFamily: "monospace",
                    display: "block",
                  }}
                >
                  BB Lower: ${data.bollingerLower.toFixed(2)}
                </Typography>
              </>
            )}
          </>
        )}
        {chartType === "rsi" && data.rsi && (
          <Typography
            variant="caption"
            sx={{
              color: "#00ff41",
              fontFamily: "monospace",
              display: "block",
            }}
          >
            RSI: {data.rsi.toFixed(2)}
          </Typography>
        )}
        {chartType === "macd" && data.macd && (
          <Typography
            variant="caption"
            sx={{
              color: "#00ff41",
              fontFamily: "monospace",
              display: "block",
            }}
          >
            MACD: {data.macd.toFixed(2)}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Box>
      {/* Chart Type Selector */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={handleChartTypeChange}
          sx={{
            "& .MuiToggleButton-root": {
              color: "#00cc33",
              borderColor: "#00ff41",
              fontFamily: "monospace",
              px: 2,
              py: 0.5,
              "&.Mui-selected": {
                backgroundColor: "#00ff41",
                color: "#0a0e27",
                "&:hover": {
                  backgroundColor: "#00cc33",
                },
              },
              "&:hover": {
                backgroundColor: "rgba(0, 255, 65, 0.1)",
              },
            },
          }}
        >
          <ToggleButton value="price">PRICE</ToggleButton>
          <ToggleButton value="rsi">RSI</ToggleButton>
          <ToggleButton value="macd">MACD</ToggleButton>
        </ToggleButtonGroup>

        {/* Indicator Toggles (only for price chart) */}
        {chartType === "price" && (
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showSMA}
                  onChange={(e) => setShowSMA(e.target.checked)}
                  sx={{
                    color: "#00cc33",
                    "&.Mui-checked": {
                      color: "#00ff41",
                    },
                  }}
                />
              }
              label="SMA"
              sx={{
                "& .MuiFormControlLabel-label": {
                  color: "#00cc33",
                  fontFamily: "monospace",
                },
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showEMA}
                  onChange={(e) => setShowEMA(e.target.checked)}
                  sx={{
                    color: "#00cc33",
                    "&.Mui-checked": {
                      color: "#00ff41",
                    },
                  }}
                />
              }
              label="EMA"
              sx={{
                "& .MuiFormControlLabel-label": {
                  color: "#00cc33",
                  fontFamily: "monospace",
                },
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showBollinger}
                  onChange={(e) => setShowBollinger(e.target.checked)}
                  sx={{
                    color: "#00cc33",
                    "&.Mui-checked": {
                      color: "#00ff41",
                    },
                  }}
                />
              }
              label="Bollinger"
              sx={{
                "& .MuiFormControlLabel-label": {
                  color: "#00cc33",
                  fontFamily: "monospace",
                },
              }}
            />
          </FormGroup>
        )}
      </Box>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        {chartType === "price" ? (
          <LineChart data={enhancedData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(0, 255, 65, 0.1)"
            />
            <XAxis
              dataKey="date"
              stroke="#00cc33"
              style={{ fontFamily: "monospace", fontSize: "12px" }}
            />
            <YAxis
              stroke="#00cc33"
              style={{ fontFamily: "monospace", fontSize: "12px" }}
              domain={["auto", "auto"]}
            />
            // eslint-disable-next-line react-hooks/static-components
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                fontFamily: "monospace",
                color: "#00cc33",
              }}
            />

            {/* Bollinger Bands */}
            {showBollinger && (
              <>
                <Line
                  type="monotone"
                  dataKey="bollingerUpper"
                  stroke="#ff1744"
                  strokeWidth={1}
                  dot={false}
                  name="BB Upper"
                  strokeDasharray="5 5"
                />
                <Line
                  type="monotone"
                  dataKey="bollingerLower"
                  stroke="#ff1744"
                  strokeWidth={1}
                  dot={false}
                  name="BB Lower"
                  strokeDasharray="5 5"
                />
              </>
            )}

            {/* Moving Averages */}
            {showSMA && (
              <Line
                type="monotone"
                dataKey="sma"
                stroke="#ffa726"
                strokeWidth={2}
                dot={false}
                name="SMA(20)"
              />
            )}
            {showEMA && (
              <Line
                type="monotone"
                dataKey="ema"
                stroke="#42a5f5"
                strokeWidth={2}
                dot={false}
                name="EMA(20)"
              />
            )}

            {/* Price */}
            <Line
              type="monotone"
              dataKey="price"
              stroke="#00ff41"
              strokeWidth={3}
              dot={false}
              name="Price"
              filter="drop-shadow(0 0 8px #00ff41)"
            />
          </LineChart>
        ) : chartType === "rsi" ? (
          <LineChart data={enhancedData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(0, 255, 65, 0.1)"
            />
            <XAxis
              dataKey="date"
              stroke="#00cc33"
              style={{ fontFamily: "monospace", fontSize: "12px" }}
            />
            <YAxis
              stroke="#00cc33"
              style={{ fontFamily: "monospace", fontSize: "12px" }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                fontFamily: "monospace",
                color: "#00cc33",
              }}
            />

            {/* RSI levels */}
            <ReferenceLine
              y={70}
              stroke="#ff1744"
              strokeDasharray="3 3"
              label="Overbought"
            />
            <ReferenceLine
              y={30}
              stroke="#00ff41"
              strokeDasharray="3 3"
              label="Oversold"
            />
            <ReferenceLine y={50} stroke="#ffa726" strokeDasharray="3 3" />

            <Line
              type="monotone"
              dataKey="rsi"
              stroke="#00ff41"
              strokeWidth={3}
              dot={false}
              name="RSI(14)"
              filter="drop-shadow(0 0 8px #00ff41)"
            />
          </LineChart>
        ) : (
          <LineChart data={enhancedData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(0, 255, 65, 0.1)"
            />
            <XAxis
              dataKey="date"
              stroke="#00cc33"
              style={{ fontFamily: "monospace", fontSize: "12px" }}
            />
            <YAxis
              stroke="#00cc33"
              style={{ fontFamily: "monospace", fontSize: "12px" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                fontFamily: "monospace",
                color: "#00cc33",
              }}
            />

            <ReferenceLine y={0} stroke="#ffa726" strokeDasharray="3 3" />

            <Line
              type="monotone"
              dataKey="macd"
              stroke="#00ff41"
              strokeWidth={3}
              dot={false}
              name="MACD"
              filter="drop-shadow(0 0 8px #00ff41)"
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </Box>
  );
}
