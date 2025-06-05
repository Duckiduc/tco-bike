import React from 'react';
import {
  Paper,
  Typography,
  Box,
} from '@mui/material';

const TcoCalculator: React.FC = () => {
  return (
    <Box>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          background: 'transparent',
          textAlign: 'center',
          mb: 4,
          color: 'white',
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom>
          🏍️ Dashboard TCO Moto France
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Calculez le coût total de possession de votre moto
        </Typography>
      </Paper>

      {/* Placeholder content */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Calculateur TCO Moto
        </Typography>
        <Typography>
          Application en cours de développement...
        </Typography>
      </Paper>
    </Box>
  );
};

export default TcoCalculator;
