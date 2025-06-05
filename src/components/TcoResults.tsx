import React from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Alert,
} from '@mui/material';
import { PieChart, BarChart } from '@mui/x-charts';
import { Assessment, TrendingUp, TrendingDown } from '@mui/icons-material';
import type { TcoData, ComparisonData } from '../types';

interface TcoResultsProps {
  data: TcoData | null;
  comparisonData: ComparisonData[];
}

const TcoResults: React.FC<TcoResultsProps> = ({ data, comparisonData }) => {
  if (!data) {
    return (
      <Card sx={{ height: 'fit-content' }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Assessment sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h4" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
            Résultats TCO
          </Typography>
          <Typography color="text.secondary">
            Remplissez le formulaire et cliquez sur "Calculer le TCO" pour voir vos résultats
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const { totalCost, breakdown, category } = data;

  const pieData = [
    { id: 0, value: breakdown.depreciation, label: 'Dépréciation' },
    { id: 1, value: breakdown.insurance, label: 'Assurance' },
    { id: 2, value: breakdown.maintenance, label: 'Entretien' },
    { id: 3, value: breakdown.fuel, label: 'Carburant' },
    { id: 4, value: breakdown.tires, label: 'Pneus' },
    { id: 5, value: breakdown.technical, label: 'Contrôle technique' },
    { id: 6, value: breakdown.parking, label: 'Stationnement' },
  ];

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'small': return 'Petites cylindrées';
      case 'medium': return 'Moyennes cylindrées';
      case 'large': return 'Grosses cylindrées';
      default: return category;
    }
  };

  const comparisonAverage = comparisonData.find(item => 
    item.Catégorie === getCategoryLabel(category)
  );

  const comparisonChartData = comparisonAverage ? [
    {
      category: 'Dépréciation',
      yours: breakdown.depreciation,
      average: comparisonAverage.Dépréciation,
    },
    {
      category: 'Assurance',
      yours: breakdown.insurance,
      average: comparisonAverage.Assurance,
    },
    {
      category: 'Entretien',
      yours: breakdown.maintenance,
      average: comparisonAverage.Entretien,
    },
    {
      category: 'Carburant',
      yours: breakdown.fuel,
      average: comparisonAverage.Carburant,
    },
    {
      category: 'Pneus',
      yours: breakdown.tires,
      average: comparisonAverage.Pneus,
    },
    {
      category: 'Stationnement',
      yours: breakdown.parking,
      average: comparisonAverage.Stationnement,
    },
  ] : [];

  const costLabels: Record<string, string> = {
    depreciation: 'Dépréciation',
    insurance: 'Assurance',
    maintenance: 'Entretien',
    fuel: 'Carburant',
    tires: 'Pneus',
    technical: 'Contrôle technique',
    parking: 'Stationnement',
  };

  const isAboveAverage = comparisonAverage && totalCost > comparisonAverage.Total;
  const difference = comparisonAverage ? Math.abs(totalCost - comparisonAverage.Total) : 0;

  return (
    <Card sx={{ height: 'fit-content' }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Assessment sx={{ color: 'secondary.main', mr: 2, fontSize: 28 }} />
          <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
            Résultats TCO
          </Typography>
        </Box>

        {/* Total Cost Card */}
        <Card sx={{ 
          mb: 4, 
          background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
          color: 'white'
        }}>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
              {Math.round(totalCost).toLocaleString()} €
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Coût Total de Possession Annuel
            </Typography>
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Répartition des coûts
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {Object.entries(breakdown).map(([key, value]) => (
              <Box 
                key={key}
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  p: 2,
                  backgroundColor: 'grey.50',
                  borderRadius: 2,
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {costLabels[key]}
                </Typography>
                <Chip 
                  label={`${Math.round(value).toLocaleString()} €`}
                  color="secondary"
                  variant="filled"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Pie Chart */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Répartition visuelle
          </Typography>
          <Box sx={{ 
            height: 350,
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'grey.50',
            borderRadius: 2,
            p: 2
          }}>
            <PieChart
              series={[
                {
                  data: pieData,
                  highlightScope: { fade: 'global', highlight: 'item' },
                  faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                },
              ]}
              height={350}
            />
          </Box>
        </Box>

        {/* Comparison Chart */}
        {comparisonChartData.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Comparaison avec la moyenne française
            </Typography>
            <Box sx={{ 
              height: 350,
              backgroundColor: 'grey.50',
              borderRadius: 2,
              p: 2
            }}>
              <BarChart
                dataset={comparisonChartData}
                xAxis={[{ scaleType: 'band', dataKey: 'category' }]}
                series={[
                  { dataKey: 'yours', label: 'Vos coûts', color: '#2196f3' },
                  { dataKey: 'average', label: 'Moyenne française', color: '#1976d2' },
                ]}
                height={350}
              />
            </Box>
          </Box>
        )}

        {/* Comparison Summary */}
        {comparisonAverage && (
          <Alert 
            severity={isAboveAverage ? 'warning' : 'success'}
            icon={isAboveAverage ? <TrendingUp /> : <TrendingDown />}
            sx={{ mt: 2 }}
          >
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              <strong>Comparaison totale:</strong> Vos coûts ({Math.round(totalCost).toLocaleString()} €) 
              vs moyenne française ({Math.round(comparisonAverage.Total).toLocaleString()} €)
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {isAboveAverage ? (
                <>Vous dépensez <strong>{Math.round(difference).toLocaleString()} € de plus</strong> que la moyenne</>
              ) : (
                <>Vous économisez <strong>{Math.round(difference).toLocaleString()} €</strong> par rapport à la moyenne</>
              )}
            </Typography>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default TcoResults;
