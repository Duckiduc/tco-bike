export type Category = "small" | "medium" | "large";
export type Energy = "petrol" | "electric";
export type CityProfile = "none" | "paris";

export interface TcoFormData {
  model: string;
  category: Category;
  energy: Energy;
  purchasePrice: number;
  bikeAge: number;
  years: number;
  annualKm: number;
  insuranceCost: number;
  youngRider: boolean;
  maintenanceCost: number;
  fuelConsumption: number;
  fuelPrice: number;
  elecConsumption: number;
  elecPrice: number;
  tireCost: number;
  tireLifespan: number;
  parkingCost: number;
  city: CityProfile;
  region: string;
  fiscalHp: number;
  firstBike: boolean;
  gearCost: number;
  licenceCost: number;
  transitPass: number;
  includeDepreciation: boolean;
}

export interface TcoBreakdown {
  depreciation: number;
  insurance: number;
  maintenance: number;
  fuel: number;
  tires: number;
  technical: number;
  parking: number;
  acquisition: number;
}

export interface TcoData extends TcoFormData {
  // Annual average over the holding period
  totalCost: number;
  totalOverPeriod: number;
  costPerKm: number;
  resaleValue: number;
  breakdown: TcoBreakdown;
  firstYear: {
    registration: number;
    gear: number;
    licence: number;
    critAir: number;
    total: number;
  };
  timeline: Array<{ year: number; cumulative: number; resale: number }>;
}

export interface BikeData {
  Rang: number;
  Modèle: string;
  Marque: string;
  "Cylindrée (cm³)": number;
  Catégorie: string;
  "Prix_Achat_Neuf (€)": number;
  "Assurance_Annuelle_Moyenne (€)": number;
  "Entretien_Annuel (€)": number;
  Consommation_L_100km: number;
  "Coût_Carburant_Annuel_10000km (€)": number;
  "Coût_Pneus_Par_Change (€)": number;
  Durée_Vie_Pneus_km: number;
  "Coût_Pneus_Annuel_10000km (€)": number;
  "Dépréciation_15%_Annuelle (€)": number;
  "TCO_Annuel_Total (€)": number;
}

export interface BrandData {
  Marque?: string;
  "﻿Marque"?: string;
  Parts_Marché_Pourcentage: number;
  "Prix_Moyen_Gamme (€)": number;
  "Assurance_Moyenne_Annuelle (€)": number;
  "Entretien_Moyen_Annuel (€)": number;
  Consommation_Moyenne_L_100km: number;
  "Coût_Carburant_Annuel_10000km (€)": number;
  Coût_Réparation_Index_Base100: number;
  "Coût_Pneus_Moyen_Change (€)": number;
  "Dépréciation_Annuelle_15%_Moyenne (€)": number;
  "TCO_Moyen_Annuel (€)": number;
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
  "Contrôle technique": number;
  Stationnement: number;
  Total: number;
}

export interface LiveFuelPrice {
  price: number;
  date: string;
}
