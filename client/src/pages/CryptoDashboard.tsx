import { useReducer, useState, useEffect, useCallback, useRef } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from "@mui/material";
import { GenericTable } from "../components/GenericTable";

import {
  Crypto_Action_Type,
  cryptoInitialState,
  cryptoReducer,
  getCryptoFetchUri,
} from "../utils/crypto-dashboard";
import useGetCryptoTableData from "../hooks/use-get-crypto-table-data";
import { useGet } from "@nnaumovski/react-api-client";

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};

export type Cryptocurrency = {
  id: string;
  name: string;
  symbol: string;
  price: string;
  dailyPriceChange: string;
  marketCap: string;
  volume: string;
};

export function CryptoDashboard() {
  const renderRef = useRef(false);
  const [state, dispatch] = useReducer(cryptoReducer, cryptoInitialState);
  const [url, setUrl] = useState("");

  const { tableDataProps, tableHeaderProps } = useGetCryptoTableData();

  const setSearchQuery = useCallback((searchQuery: string) => {
    dispatch({
      type: Crypto_Action_Type.SET_SEARCH_QUERY,
      payload: { searchQuery },
    });
  }, []);

  const setPage = useCallback(
    (page: number) => {
      dispatch({
        type: Crypto_Action_Type.SET_PAGE,
        payload: { page },
      });
      setUrl(`/cryptos?${getCryptoFetchUri({ ...state, page })}`);
    },
    [state]
  );

  const setMarketCapFilter = useCallback(
    (marketCapFilter: string) => {
      dispatch({
        type: Crypto_Action_Type.SET_MARKET_CAP_FILTER,
        payload: { marketCapFilter },
      });
      setUrl(`/cryptos?${getCryptoFetchUri({ ...state, marketCapFilter })}`);
    },
    [state]
  );

  const handleOnSuccess = useCallback(() => {
    dispatch({
      type: Crypto_Action_Type.SET_IS_TABLE_LOADING,
      payload: { isTableLoading: false },
    });
  }, []);

  const { data, loading } = useGet<PaginatedResponse<Cryptocurrency>>(url, {
    skip: !url,
    urlRefetch: true,
    onSuccess: handleOnSuccess,
  });

  useEffect(() => {
    if (renderRef.current) return;

    setUrl(`/cryptos?${getCryptoFetchUri(state)}`);
  }, [state]);

  useEffect(() => {
    if (!renderRef.current) {
      renderRef.current = true;
      return;
    }
    const timerIdentifier = setTimeout(() => {
      setUrl(`/cryptos?${getCryptoFetchUri(state)}`);
    }, 700);
    console.log("ahahahah");
    return () => {
      clearTimeout(timerIdentifier);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.searchQuery]);

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
            {">"} CRYPTO_TERMINAL
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#00cc33",
              fontFamily: "monospace",
            }}
          >
            [REAL-TIME CRYPTOCURRENCY MARKET DATA]
          </Typography>
        </Box>

        {/* Filters */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            backgroundColor: "#0f172a",
            border: "1px solid #00ff41",
            boxShadow: "0 0 20px rgba(0, 255, 65, 0.2)",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              label="Search Cryptocurrency"
              variant="outlined"
              value={state.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter name or symbol..."
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#00ff41",
                  },
                  "&:hover fieldset": {
                    borderColor: "#00ff41",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#00ff41",
                  },
                },
              }}
            />
            <FormControl fullWidth>
              <InputLabel
                sx={{
                  color: "#00ff41",
                  "&.Mui-focused": {
                    color: "#00ff41",
                  },
                }}
              >
                Market Cap Filter
              </InputLabel>
              <Select
                value={state.marketCapFilter}
                label="Market Cap Filter"
                onChange={(e) => setMarketCapFilter(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#00ff41",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#00ff41",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#00ff41",
                  },
                }}
              >
                <MenuItem value="all">All Sizes</MenuItem>
                <MenuItem value="large">Large Cap (&gt; $10B)</MenuItem>
                <MenuItem value="medium">Medium Cap ($1B - $10B)</MenuItem>
                <MenuItem value="small">Small Cap (&lt; $1B)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* Crypto Table */}
        <GenericTable
          tableDataProps={tableDataProps}
          headerProps={tableHeaderProps}
          data={data || { data: [], limit: 0, page: 0, total: 0 }}
          isLoading={loading || state.isTableLoading}
          searchTerm={state.searchQuery}
          handlePageChange={setPage}
          emptyStateTitle="No Cryptos Found"
          emptyStateDescription="Search for your favorite cryptocurrency"
        />
      </Container>
    </Box>
  );
}
