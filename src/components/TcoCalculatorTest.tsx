import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
} from '@mui/material';
import TcoForm from './TcoForm';
import TcoResults from './TcoResults';
import type { TcoData } from '../types';

const TcoCalculatorTest: React.FC = () => {
  const [tcoData, setTcoData] = useState<TcoData | null>(null);

  const handleTcoCalculation = (data: TcoData) => {
    setTcoData(data);
    console.log('TCO Data received:', data);
  };

  return (
    <Box>
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
      
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          <TcoForm onCalculate={handleTcoCalculation} />
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <TcoResults
            data={tcoData}
            comparisonData={[]}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default TcoCalculatorTest;
