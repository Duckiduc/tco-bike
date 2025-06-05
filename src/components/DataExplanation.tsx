import React, { useState } from 'react';
import {
  Typography,
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import { ExpandMore, Info, TrendingUp, Build, DataUsage } from '@mui/icons-material';
import { BarChart } from '@mui/x-charts';
import type { BikeData, BrandData } from '../types';

interface DataExplanationProps {
  bikeData: BikeData[];
  brandData: BrandData[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const DataExplanation: React.FC<DataExplanationProps> = ({ 
  bikeData, 
  brandData 
}) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const topBikes = bikeData.slice(0, 10);
  const topBrands = brandData.slice(0, 8);

  const brandChartData = topBrands.map(brand => ({
    brand: brand.Marque,
    cost: brand['TCO_Moyen_Annuel (€)'],
  }));

  return (
    <Box sx={{ mt: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h2" 
          component="h2" 
          sx={{ 
            mb: 2,
            fontWeight: 600,
            color: 'text.primary'
          }}
        >
          Sources des données
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ maxWidth: '600px', mx: 'auto', fontWeight: 400 }}
        >
          Explorez les données du marché français de la moto utilisées pour nos calculs
        </Typography>
      </Box>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                py: 2,
              }
            }}
          >
            <Tab icon={<TrendingUp />} label="Motos Populaires" />
            <Tab icon={<Build />} label="Coûts par Marque" />
            <Tab icon={<DataUsage />} label="Méthodologie" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Top 10 des motos les plus populaires en France (2024)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Classement basé sur les données de ventes et d'immatriculations
            </Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Rang</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Modèle</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Marque</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Cylindrée</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Prix moyen</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topBikes.map((bike, index) => (
                  <TableRow 
                    key={`bike-${index}`}
                    sx={{ '&:hover': { backgroundColor: 'grey.50' } }}
                  >
                    <TableCell>
                      <Chip 
                        label={index + 1} 
                        size="small" 
                        color={index < 3 ? 'secondary' : 'default'}
                        variant={index < 3 ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{bike.Modèle}</TableCell>
                    <TableCell>{bike.Marque}</TableCell>
                    <TableCell>{bike['Cylindrée (cm³)']}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'secondary.main' }}>
                      {bike['Prix_Achat_Neuf (€)']?.toLocaleString() || 'N/A'} €
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Coûts moyens annuels par marque
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Incluant assurance, entretien, carburant et dépréciation
            </Typography>
          </Box>

          <Box sx={{ 
            height: 400, 
            mb: 4,
            backgroundColor: 'grey.50',
            borderRadius: 2,
            p: 2
          }}>
            <BarChart
              dataset={brandChartData}
              xAxis={[{ scaleType: 'band', dataKey: 'brand' }]}
              series={[{ dataKey: 'cost', label: 'Coût annuel moyen (€)', color: '#2196f3' }]}
              height={400}
            />
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Marque</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>TCO moyen annuel</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Fiabilité</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Disponibilité pièces</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topBrands.map((brand, index) => (
                  <TableRow 
                    key={`brand-${index}`}
                    sx={{ '&:hover': { backgroundColor: 'grey.50' } }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>{brand.Marque}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'secondary.main' }}>
                      {brand['TCO_Moyen_Annuel (€)']?.toLocaleString() || 'N/A'} €
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={`${brand.Fiabilité_Note_10}/10`}
                        size="small"
                        color={brand.Fiabilité_Note_10 >= 8 ? 'success' : brand.Fiabilité_Note_10 >= 6 ? 'warning' : 'error'}
                        variant="filled"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={`${brand.Disponibilité_Pièces_Note_10}/10`}
                        size="small"
                        color={brand.Disponibilité_Pièces_Note_10 >= 8 ? 'success' : brand.Disponibilité_Pièces_Note_10 >= 6 ? 'warning' : 'error'}
                        variant="filled"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Méthodologie de calcul du TCO
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
                Notre calculateur de Coût Total de Possession (TCO) prend en compte tous les aspects financiers de la possession d'une moto.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography sx={{ fontWeight: 600 }}>Dépréciation (15% par an)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Basée sur une dépréciation moyenne de 15% par an pour les motos, calculée sur le prix d'achat initial.
                    Cette valeur correspond aux études de marché européennes sur la dépréciation des deux-roues motorisés.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography sx={{ fontWeight: 600 }}>Assurance</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Coûts d'assurance moyens en France pour 2024 : au tiers (455€), intermédiaire (648€), tous risques (907€).
                    Majoration de 600€ pour les jeunes conducteurs. Sources : comparateurs d'assurance français.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography sx={{ fontWeight: 600 }}>Entretien et Maintenance</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Inclut les révisions périodiques, changement d'huile, filtres, freins, chaîne, et réparations courantes.
                    Varie selon la cylindrée : 225€ (petite), 375€ (moyenne), 575€ (grosse).
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography sx={{ fontWeight: 600 }}>Carburant</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Calculé avec le prix moyen du SP95 en France (1,65€/L en 2024) et la consommation spécifique 
                    à chaque catégorie de moto selon votre kilométrage annuel.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography sx={{ fontWeight: 600 }}>Pneumatiques</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Coût proratisé selon la durée de vie des pneus et votre kilométrage. 
                    Durée de vie moyenne : 15 000 km (petite cylindrée) à 10 000 km (grosse cylindrée).
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography sx={{ fontWeight: 600 }}>Contrôle technique</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Obligatoire tous les 2 ans pour les motos de plus de 4 ans (35€ par contrôle, soit 17,50€ par an).
                    Conforme à la réglementation française en vigueur.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography sx={{ fontWeight: 600 }}>Stationnement</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Coûts variables selon la zone géographique : gratuit en province, 
                    jusqu'à 100€/mois dans les centres-villes. Personnalisable selon votre situation.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Box>

            <Box sx={{ 
              mt: 3, 
              p: 3, 
              backgroundColor: 'info.50', 
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'info.200'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Info sx={{ color: 'info.main', mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" sx={{ color: 'info.main', fontWeight: 600, mb: 1 }}>
                    Sources des données
                  </Typography>
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    • <strong>Données de ventes :</strong> CSIAM (Chambre Syndicale Internationale de l'Automobile et du Motocycle)<br/>
                    • <strong>Prix carburant :</strong> Ministère de la Transition Écologique<br/>
                    • <strong>Assurances :</strong> Moyennes des principaux assureurs français 2024<br/>
                    • <strong>Entretien :</strong> Enquêtes auprès des concessionnaires et garages agréés<br/>
                    • <strong>Dépréciation :</strong> Études Eurotax et Argus Moto
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default DataExplanation;
