import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Tabs,
  Tab,
} from "@mui/material";
import { mockCryptoData } from "../data/mockCryptoData";
import { generateChartData } from "../data/chartDataGenerator";
import { CryptoChart } from "../components/CryptoChart";
import { TechnicalAnalysisPanel } from "../components/TechnicalAnalysisPanel";
import { LSTMPredictionPanel } from "../components/LSTMPredictionPanel";
import { IndicatorGuide } from "../components/IndicatorGuide";
import { CryptoList } from "../components/CryptoList";

type TimeRange = "daily" | "monthly" | "quarterly" | "yearly" | "all";

type AnalysisTimeFrame = "day" | "week" | "month";

export function CryptoAnalytics() {
  const [selectedCrypto, setSelectedCrypto] = useState(mockCryptoData[0]);
  const [timeRange, setTimeRange] = useState<TimeRange>("monthly");
  const [activeTab, setActiveTab] = useState(0);
  const [analysisTimeFrame, setAnalysisTimeFrame] =
    useState<AnalysisTimeFrame>("week");

  const chartData = generateChartData(selectedCrypto.symbol, timeRange);

  const handleTimeRangeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newTimeRange: TimeRange | null
  ) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              mb: 1,
              color: "#00ff41",
              textShadow: "0 0 10px #00ff41, 0 0 20px #00ff41",
            }}
          >
            {">"} CRYPTO_ANALYTICS
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#00cc33",
              fontFamily: "monospace",
            }}
          >
            [REAL-TIME PRICE ANALYSIS & CHARTS]
          </Typography>
        </Box>

        {/* Time Range Filter */}
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={handleTimeRangeChange}
            sx={{
              gap: 1,
              "& .MuiToggleButton-root": {
                color: "#00cc33",
                borderColor: "#00ff41",
                fontFamily: "monospace",
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
            <ToggleButton value="daily">DAILY</ToggleButton>
            <ToggleButton value="monthly">MONTHLY</ToggleButton>
            <ToggleButton value="quarterly">QUARTERLY</ToggleButton>
            <ToggleButton value="yearly">YEARLY</ToggleButton>
            <ToggleButton value="all">ALL TIME</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Main Content */}
        <Paper
          elevation={3}
          sx={{
            backgroundColor: "#0f172a",
            border: "1px solid #00ff41",
            boxShadow: "0 0 20px rgba(0, 255, 65, 0.2)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1fr 2fr" },
              minHeight: "600px",
            }}
          >
            {/* Left Side - Crypto List */}
            <Box
              sx={{
                borderRight: { lg: "1px solid #00ff41" },
                borderBottom: {
                  xs: "1px solid #00ff41",
                  lg: "none",
                },
              }}
            >
              <CryptoList
                cryptos={mockCryptoData}
                selectedCrypto={selectedCrypto}
                onSelectCrypto={setSelectedCrypto}
              />
            </Box>

            {/* Right Side - Chart and Analysis Tabs */}
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {/* Crypto Info Header */}
              <Box sx={{ p: 3, pb: 0 }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#00ff41",
                    fontFamily: "monospace",
                    mb: 1,
                  }}
                >
                  {selectedCrypto.name} ({selectedCrypto.symbol})
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    color: "#00ff41",
                    fontFamily: "monospace",
                  }}
                >
                  $
                  {selectedCrypto.price.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color:
                      selectedCrypto.change24h >= 0 ? "#00ff41" : "#ff1744",
                    fontFamily: "monospace",
                  }}
                >
                  {selectedCrypto.change24h >= 0 ? "+" : ""}
                  {selectedCrypto.change24h.toFixed(2)}% (24h)
                </Typography>
              </Box>

              {/* Tabs */}
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "rgba(0, 255, 65, 0.2)",
                  px: 3,
                }}
              >
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  sx={{
                    "& .MuiTab-root": {
                      color: "#00cc33",
                      fontFamily: "monospace",
                      "&.Mui-selected": {
                        color: "#00ff41",
                      },
                    },
                    "& .MuiTabs-indicator": {
                      backgroundColor: "#00ff41",
                      boxShadow: "0 0 10px #00ff41",
                    },
                  }}
                >
                  <Tab label="PRICE CHART" />
                  <Tab label="TECHNICAL ANALYSIS" />
                  <Tab label="LSTM PREDICTION" />
                  <Tab label="INDICATOR GUIDE" />
                </Tabs>
              </Box>

              {/* Tab Content */}
              <Box sx={{ p: 3, flex: 1, overflow: "auto" }}>
                {activeTab === 0 && (
                  <Box>
                    <CryptoChart data={chartData} timeRange={timeRange} />
                  </Box>
                )}
                {activeTab === 1 && (
                  <TechnicalAnalysisPanel
                    data={chartData}
                    cryptoName={selectedCrypto.name}
                    timeFrame={analysisTimeFrame}
                    onTimeFrameChange={setAnalysisTimeFrame}
                  />
                )}
                {activeTab === 2 && (
                  <LSTMPredictionPanel
                    data={chartData}
                    cryptoName={selectedCrypto.name}
                  />
                )}
                {activeTab === 3 && <IndicatorGuide />}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
