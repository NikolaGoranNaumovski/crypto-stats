import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Box,
  } from '@mui/material';
  import { TrendingUp, TrendingDown } from 'lucide-react';
  
  interface Crypto {
    id: number;
    name: string;
    symbol: string;
    price: number;
    change24h: number;
    marketCap: number;
    volume24h: number;
  }
  
  interface CryptoTableProps {
    cryptos: Crypto[];
  }
  
  export function CryptoTable({ cryptos }: CryptoTableProps) {
    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    };
  
    const formatMarketCap = (value: number) => {
      if (value >= 1000000000) {
        return `$${(value / 1000000000).toFixed(2)}B`;
      } else if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(2)}M`;
      } else {
        return `$${(value / 1000).toFixed(2)}K`;
      }
    };
  
    return (
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: '#0f172a',
          border: '1px solid #00ff41',
          boxShadow: '0 0 20px rgba(0, 255, 65, 0.2)',
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: '#1a1f3a',
              }}
            >
              <TableCell
                sx={{
                  color: '#00ff41',
                  borderBottom: '1px solid #00ff41',
                }}
              >
                #
              </TableCell>
              <TableCell
                sx={{
                  color: '#00ff41',
                  borderBottom: '1px solid #00ff41',
                }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{
                  color: '#00ff41',
                  borderBottom: '1px solid #00ff41',
                }}
              >
                Symbol
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  color: '#00ff41',
                  borderBottom: '1px solid #00ff41',
                }}
              >
                Price
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  color: '#00ff41',
                  borderBottom: '1px solid #00ff41',
                }}
              >
                24h Change
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  color: '#00ff41',
                  borderBottom: '1px solid #00ff41',
                }}
              >
                Market Cap
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  color: '#00ff41',
                  borderBottom: '1px solid #00ff41',
                }}
              >
                Volume (24h)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cryptos.map((crypto, index) => (
              <TableRow
                key={crypto.id}
                sx={{
                  '&:hover': {
                    backgroundColor: '#1a1f3a',
                    boxShadow: '0 0 10px rgba(0, 255, 65, 0.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <TableCell
                  sx={{
                    color: '#00cc33',
                    borderBottom: '1px solid rgba(0, 255, 65, 0.2)',
                  }}
                >
                  {index + 1}
                </TableCell>
                <TableCell
                  sx={{
                    color: '#00ff41',
                    borderBottom: '1px solid rgba(0, 255, 65, 0.2)',
                  }}
                >
                  {crypto.name}
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: '1px solid rgba(0, 255, 65, 0.2)',
                  }}
                >
                  <Chip
                    label={crypto.symbol}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(0, 255, 65, 0.1)',
                      color: '#00ff41',
                      border: '1px solid #00ff41',
                    }}
                  />
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color: '#00ff41',
                    borderBottom: '1px solid rgba(0, 255, 65, 0.2)',
                  }}
                >
                  {formatCurrency(crypto.price)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    borderBottom: '1px solid rgba(0, 255, 65, 0.2)',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: 0.5,
                      color: crypto.change24h >= 0 ? '#00ff41' : '#ff1744',
                    }}
                  >
                    {crypto.change24h >= 0 ? (
                      <TrendingUp size={16} />
                    ) : (
                      <TrendingDown size={16} />
                    )}
                    {crypto.change24h >= 0 ? '+' : ''}
                    {crypto.change24h.toFixed(2)}%
                  </Box>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color: '#00cc33',
                    borderBottom: '1px solid rgba(0, 255, 65, 0.2)',
                  }}
                >
                  {formatMarketCap(crypto.marketCap)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color: '#00cc33',
                    borderBottom: '1px solid rgba(0, 255, 65, 0.2)',
                  }}
                >
                  {formatMarketCap(crypto.volume24h)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  