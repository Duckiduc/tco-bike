import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import { DirectionsBike, Euro, Build, LocalGasStation } from '@mui/icons-material';
import TcoForm from './TcoForm';
import TcoResults from './TcoResults';
import DataExplanation from './DataExplanation';
import type { TcoData, BikeData, BrandData, ComparisonData } from '../types';

const TcoCalculator: React.FC = () => {
  const [tcoData, setTcoData] = useState<TcoData | null>(null);
  const [bikeData, setBikeData] = useState<BikeData[]>([]);
  const [brandData, setBrandData] = useState<BrandData[]>([]);
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);

  useEffect(() => {
    // Load JSON data
    const loadData = async () => {
      try {
        const [bikesRes, brandsRes, comparisonRes] = await Promise.all([
          fetch('/motos_populaires_france_2024.json'),
          fetch('/couts_marques_moto_france_2024.json'),
          fetch('/comparaison_couts_moto.json'),
        ]);

        const bikes = await bikesRes.json();
        const brands = await brandsRes.json();
        const comparison = await comparisonRes.json();

        setBikeData(bikes);
        setBrandData(brands);
        setComparisonData(comparison);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const handleTcoCalculation = (data: TcoData) => {
    setTcoData(data);
  };

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
      {/* Info Cards Section */}
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h2" 
          component="h2" 
          sx={{ 
            mb: 4, 
            textAlign: 'center',
            color: 'text.primary',
            fontWeight: 600
          }}
        >
          Données du marché français 2024
        </Typography>
        
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(4, 1fr)'
            },
            gap: 3,
            mb: 6,
          }}
        >
          <Card sx={{ height: 'fit-content' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                <Euro sx={{ color: 'secondary.main', mr: 1.5, fontSize: 24 }} />
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                  Coûts d'Achat
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.primary">Occasion débutant</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'secondary.main' }}>1 500 - 2 500 €</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.primary">125cc neuf</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'secondary.main' }}>3 000 - 5 500 €</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.primary">Moyenne cylindrée</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'secondary.main' }}>6 500 - 10 000 €</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.primary">Grosse cylindrée</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'secondary.main' }}>15 000 - 30 000 €</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ height: 'fit-content' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                <DirectionsBike sx={{ color: 'secondary.main', mr: 1.5, fontSize: 24 }} />
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                  Assurance 2024
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.primary">Au tiers</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'secondary.main' }}>455 € / an</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.primary">Intermédiaire</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'secondary.main' }}>648 € / an</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.primary">Tous risques</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'secondary.main' }}>907 € / an</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.primary">Jeune conducteur</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'secondary.main' }}>+600 € / an</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ height: 'fit-content' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                <Build sx={{ color: 'secondary.main', mr: 1.5, fontSize: 24 }} />
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                  Entretien Annuel
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.primary">Révision générale</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'secondary.main' }}>250 - 400 €</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.primary">Pneus (paire)</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'secondary.main' }}>150 - 500 €</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.primary">Consommables</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'secondary.main' }}>100 - 200 €</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.primary">Réparations imprévues</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'secondary.main' }}>200 - 800 €</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ height: 'fit-content' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                <LocalGasStation sx={{ color: 'secondary.main', mr: 1.5, fontSize: 24 }} />
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                  Carburant 2024
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.primary">Prix moyen SP95</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'secondary.main' }}>1.65 € / litre</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.primary">Conso 125cc</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'secondary.main' }}>2.5 - 3.5 L/100km</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.primary">Conso moyenne cyl.</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'secondary.main' }}>4.5 - 6 L/100km</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.primary">Conso grosse cyl.</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'secondary.main' }}>6 - 9+ L/100km</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Calculator Section */}
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h2" 
          component="h2" 
          sx={{ 
            mb: 4, 
            textAlign: 'center',
            color: 'text.primary',
            fontWeight: 600
          }}
        >
          Calculateur TCO
        </Typography>
        
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
            gap: 4,
          }}
        >
          <TcoForm onCalculate={handleTcoCalculation} />
          <TcoResults
            data={tcoData}
            comparisonData={comparisonData}
          />
        </Box>
      </Box>

      {/* Data Explanation */}
      <DataExplanation
        bikeData={bikeData}
        brandData={brandData}
      />
    </Box>
  );
};

export default TcoCalculator;
