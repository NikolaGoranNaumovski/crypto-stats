import { useMemo } from "react";
import { Chip, Box } from '@mui/material';
import type { HeaderProps, TableDataProps } from "../types/generic-table";
import type { Cryptocurrency } from "../pages/CryptoDashboard";

const useGetCryptoTableData = () => {

  const tableHeaderProps: HeaderProps[] = useMemo(
    () => [
      { sx: { width: '5%' }, label: "#" },
      { sx: { width: '30%' }, label: "Name" },
      { sx: { width: '15%' }, label: "Symbol" },
      { sx: { width: '15%' }, label: "Price" },
      { sx: { width: '15%' }, label: "24h Change" },
      { sx: { width: '15%' }, label: "Market Cap" },
      { sx: { width: '15%' }, label: "Volume (24h)" },
    ],
    []
  );

  const tableDataProps = useMemo<TableDataProps<Cryptocurrency>[]>(
    () => [
      {
        sx: { width: '5%' },
        label: (_, index) => ((index || 0) + 1).toString(), // Render row number
      },
      {
        sx: { width: '30%' },
        label: (row) => row?.name || "N/A",
      },
      {
        sx: { width: '15%' },
        label: (row) => (
          <Chip
            label={row?.symbol || "N/A"}
            size="small"
            sx={{
              backgroundColor: 'rgba(0, 255, 65, 0.1)',
              color: '#00ff41',
              border: '1px solid #00ff41',
            }}
          />
        ),
      },
      {
        sx: { width: '15%' },
        label: (row) => row?.price || "",
      },
      {
        sx: { width: '15%' },
        label: (row) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 0.5,
              color: row?.dailyPriceChange ? '#00ff41' : '#ff1744',
            }}
          >
            {/* {row?.dailyPriceChange >= 0 ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )} */}
            {row?.dailyPriceChange}
          </Box>
        ),
      },
      {
        sx: { width: '15%' },
        label: (row) => row?.marketCap || "",
      },
      {
        sx: { width: '15%' },
        label: (row) => row?.volume || "",
      },
    ],
    [] 
  );

  return { tableHeaderProps, tableDataProps };
};

export default useGetCryptoTableData;
