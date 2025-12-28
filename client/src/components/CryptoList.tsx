import {
    List,
    ListItemButton,
    ListItemText,
    Box,
    Typography,
    Chip,
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
  
  interface CryptoListProps {
    cryptos: Crypto[];
    selectedCrypto: Crypto;
    onSelectCrypto: (crypto: Crypto) => void;
  }
  
  export function CryptoList({ cryptos, selectedCrypto, onSelectCrypto }: CryptoListProps) {
    return (
      <List
        sx={{
          maxHeight: '600px',
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#0a0e27',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#00ff41',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#00cc33',
          },
        }}
      >
        {cryptos.map((crypto) => (
          <ListItemButton
            key={crypto.id}
            selected={selectedCrypto.id === crypto.id}
            onClick={() => onSelectCrypto(crypto)}
            sx={{
              borderBottom: '1px solid rgba(0, 255, 65, 0.1)',
              py: 2,
              '&.Mui-selected': {
                backgroundColor: 'rgba(0, 255, 65, 0.15)',
                borderLeft: '3px solid #00ff41',
                '&:hover': {
                  backgroundColor: 'rgba(0, 255, 65, 0.2)',
                },
              },
              '&:hover': {
                backgroundColor: 'rgba(0, 255, 65, 0.1)',
              },
            }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography
                    sx={{
                      color: '#00ff41',
                      fontFamily: 'monospace',
                    }}
                  >
                    {crypto.name}
                  </Typography>
                  <Chip
                    label={crypto.symbol}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(0, 255, 65, 0.1)',
                      color: '#00cc33',
                      border: '1px solid #00ff41',
                      height: '20px',
                    }}
                  />
                </Box>
              }
              secondary={
                <Box>
                  <Typography
                    sx={{
                      color: '#00ff41',
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                    }}
                  >
                    ${crypto.price.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      mt: 0.5,
                    }}
                  >
                    {crypto.change24h >= 0 ? (
                      <TrendingUp size={14} color="#00ff41" />
                    ) : (
                      <TrendingDown size={14} color="#ff1744" />
                    )}
                    <Typography
                      sx={{
                        color: crypto.change24h >= 0 ? '#00ff41' : '#ff1744',
                        fontFamily: 'monospace',
                        fontSize: '0.8rem',
                      }}
                    >
                      {crypto.change24h >= 0 ? '+' : ''}
                      {crypto.change24h.toFixed(2)}%
                    </Typography>
                  </Box>
                </Box>
              }
            />
          </ListItemButton>
        ))}
      </List>
    );
  }
  