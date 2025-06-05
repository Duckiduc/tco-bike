import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  InputAdornment,
  Chip,
} from '@mui/material';
import { Calculate, TwoWheeler } from '@mui/icons-material';
import type { TcoData, TcoFormData } from '../types';

interface TcoFormProps {
  onCalculate: (data: TcoData) => void;
}

const defaultValues: Record<string, TcoFormData> = {
  small: {
    category: 'small',
    purchasePrice: 4250,
    annualKm: 10000,
    insuranceCost: 450,
    maintenanceCost: 225,
    fuelConsumption: 2.5,
    fuelPrice: 1.90,
    tireCost: 150,
    tireLifespan: 15000,
    parkingCost: 50,
  },
  medium: {
    category: 'medium',
    purchasePrice: 8250,
    annualKm: 10000,
    insuranceCost: 670,
    maintenanceCost: 375,
    fuelConsumption: 5.0,
    fuelPrice: 1.90,
    tireCost: 250,
    tireLifespan: 12000,
    parkingCost: 50,
  },
  large: {
    category: 'large',
    purchasePrice: 15000,
    annualKm: 10000,
    insuranceCost: 850,
    maintenanceCost: 575,
    fuelConsumption: 6.5,
    fuelPrice: 1.90,
    tireCost: 400,
    tireLifespan: 10000,
    parkingCost: 50,
  },
};

const TcoForm: React.FC<TcoFormProps> = ({ onCalculate }) => {
  const [formData, setFormData] = useState<TcoFormData>(defaultValues.medium);

  const handleChange = (field: keyof TcoFormData) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    const value = event.target.value as string;
    setFormData(prev => ({
      ...prev,
      [field]: field === 'category' ? value : parseFloat(value) || 0,
    }));
  };

  const handleCategoryChange = (category: 'small' | 'medium' | 'large') => {
    setFormData(defaultValues[category]);
  };

  const calculateTco = () => {
    const {
      purchasePrice,
      annualKm,
      insuranceCost,
      maintenanceCost,
      fuelConsumption,
      fuelPrice,
      tireCost,
      tireLifespan,
      parkingCost,
    } = formData;

    // Calculations
    const depreciation = purchasePrice * 0.15; // 15% per year
    const fuelAnnualCost = (fuelConsumption * fuelPrice * annualKm) / 100;
    const tireAnnualCost = (tireCost * annualKm) / tireLifespan;
    const technicalCost = 70 / 2; // Technical inspection every 2 years
    const parkingAnnualCost = parkingCost * 12;

    const totalCost = depreciation + insuranceCost + maintenanceCost +
      fuelAnnualCost + tireAnnualCost + technicalCost + parkingAnnualCost;

    const tcoData: TcoData = {
      ...formData,
      totalCost,
      breakdown: {
        depreciation,
        insurance: insuranceCost,
        maintenance: maintenanceCost,
        fuel: fuelAnnualCost,
        tires: tireAnnualCost,
        technical: technicalCost,
        parking: parkingAnnualCost,
      },
    };

    onCalculate(tcoData);
  };

  return (
    <Card sx={{ height: 'fit-content' }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <TwoWheeler sx={{ color: 'secondary.main', mr: 2, fontSize: 28 }} />
          <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
            Paramètres de votre moto
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Category Selection */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 500, color: 'text.secondary' }}>
              Catégorie de moto
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label="Petite cylindrée (≤125cc)"
                variant={formData.category === 'small' ? 'filled' : 'outlined'}
                color={formData.category === 'small' ? 'secondary' : 'default'}
                onClick={() => handleCategoryChange('small')}
                sx={{ cursor: 'pointer', fontSize: '0.875rem' }}
              />
              <Chip
                label="Moyenne cylindrée (126-599cc)"
                variant={formData.category === 'medium' ? 'filled' : 'outlined'}
                color={formData.category === 'medium' ? 'secondary' : 'default'}
                onClick={() => handleCategoryChange('medium')}
                sx={{ cursor: 'pointer', fontSize: '0.875rem' }}
              />
              <Chip
                label="Grosse cylindrée (≥600cc)"
                variant={formData.category === 'large' ? 'filled' : 'outlined'}
                color={formData.category === 'large' ? 'secondary' : 'default'}
                onClick={() => handleCategoryChange('large')}
                sx={{ cursor: 'pointer', fontSize: '0.875rem' }}
              />
            </Box>
          </Box>

          {/* Form Fields */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
            <TextField
              fullWidth
              label="Prix d'achat"
              type="number"
              value={formData.purchasePrice}
              onChange={handleChange('purchasePrice')}
              InputProps={{
                endAdornment: <InputAdornment position="end">€</InputAdornment>,
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            <TextField
              fullWidth
              label="Kilométrage annuel"
              type="number"
              value={formData.annualKm}
              onChange={handleChange('annualKm')}
              InputProps={{
                endAdornment: <InputAdornment position="end">km</InputAdornment>,
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            <TextField
              fullWidth
              label="Coût assurance annuel"
              type="number"
              value={formData.insuranceCost}
              onChange={handleChange('insuranceCost')}
              InputProps={{
                endAdornment: <InputAdornment position="end">€</InputAdornment>,
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            <TextField
              fullWidth
              label="Coût entretien annuel"
              type="number"
              value={formData.maintenanceCost}
              onChange={handleChange('maintenanceCost')}
              InputProps={{
                endAdornment: <InputAdornment position="end">€</InputAdornment>,
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            <TextField
              fullWidth
              label="Consommation"
              type="number"
              inputProps={{ step: 0.1 }}
              value={formData.fuelConsumption}
              onChange={handleChange('fuelConsumption')}
              InputProps={{
                endAdornment: <InputAdornment position="end">L/100km</InputAdornment>,
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            <TextField
              fullWidth
              label="Prix du carburant"
              type="number"
              inputProps={{ step: 0.01 }}
              value={formData.fuelPrice}
              onChange={handleChange('fuelPrice')}
              InputProps={{
                endAdornment: <InputAdornment position="end">€/L</InputAdornment>,
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            <TextField
              fullWidth
              label="Coût pneus par changement"
              type="number"
              value={formData.tireCost}
              onChange={handleChange('tireCost')}
              InputProps={{
                endAdornment: <InputAdornment position="end">€</InputAdornment>,
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            <TextField
              fullWidth
              label="Durée de vie pneus"
              type="number"
              value={formData.tireLifespan}
              onChange={handleChange('tireLifespan')}
              InputProps={{
                endAdornment: <InputAdornment position="end">km</InputAdornment>,
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>

          <TextField
            fullWidth
            label="Coût stationnement mensuel"
            type="number"
            value={formData.parkingCost}
            onChange={handleChange('parkingCost')}
            InputProps={{
              endAdornment: <InputAdornment position="end">€</InputAdornment>,
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<Calculate />}
            onClick={calculateTco}
            sx={{
              mt: 2,
              py: 1.5,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              },
              fontWeight: 600,
              fontSize: '1.1rem',
              textTransform: 'none',
            }}
          >
            Calculer le TCO
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TcoForm;
