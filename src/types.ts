export interface TcoData {
  category: 'small' | 'medium' | 'large';
  purchasePrice: number;
  annualKm: number;
  insuranceCost: number;
  maintenanceCost: number;
  fuelConsumption: number;
  fuelPrice: number;
  tireCost: number;
  tireLifespan: number;
  parkingCost: number;
  totalCost: number;
  breakdown: {
    depreciation: number;
    insurance: number;
    maintenance: number;
    fuel: number;
    tires: number;
    technical: number;
    parking: number;
  };
}

export interface BikeData {
  Rang: number;
  Modèle: string;
  Marque: string;
  'Cylindrée (cm³)': number;
  Catégorie: string;
  'Prix_Achat_Neuf (€)': number;
  'Assurance_Annuelle_Moyenne (€)': number;
  'Entretien_Annuel (€)': number;
  Consommation_L_100km: number;
  'Coût_Carburant_Annuel_10000km (€)': number;
  'Coût_Pneus_Par_Change (€)': number;
  Durée_Vie_Pneus_km: number;
  'Coût_Pneus_Annuel_10000km (€)': number;
  'Dépréciation_15%_Annuelle (€)': number;
  'TCO_Annuel_Total (€)': number;
}

export interface BrandData {
  Marque?: string;
  '﻿Marque'?: string;
  Parts_Marché_Pourcentage: number;
  'Prix_Moyen_Gamme (€)': number;
  'Assurance_Moyenne_Annuelle (€)': number;
  'Entretien_Moyen_Annuel (€)': number;
  Consommation_Moyenne_L_100km: number;
  'Coût_Carburant_Annuel_10000km (€)': number;
  Coût_Réparation_Index_Base100: number;
  'Coût_Pneus_Moyen_Change (€)': number;
  'Dépréciation_Annuelle_15%_Moyenne (€)': number;
  'TCO_Moyen_Annuel (€)': number;
  Fiabilité_Note_10: number;
  Disponibilité_Pièces_Note_10: number;
}

export interface ComparisonData {
  Catégorie: string;
  Dépréciation: number;
  Assurance: number;
  Entretien: number;
  Carburant: number;
  Pneus: number;
  'Contrôle technique': number;
  Stationnement: number;
  Total: number;
}

export interface TcoFormData {
  category: 'small' | 'medium' | 'large';
  purchasePrice: number;
  annualKm: number;
  insuranceCost: number;
  maintenanceCost: number;
  fuelConsumption: number;
  fuelPrice: number;
  tireCost: number;
  tireLifespan: number;
  parkingCost: number;
}
