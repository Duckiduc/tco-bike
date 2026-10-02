import type { BikeData, Category, TcoData, TcoFormData } from "../types";
import {
  CRITAIR_PRICE,
  CT_PRICE,
  NAVIGO_MONTHLY,
  PARIS_RESIDENT_PARKING_YEARLY,
  YOUNG_RIDER_SURCHARGE,
  isInspectionAge,
  registrationCost,
} from "./reference";

export const MAX_YEARS = 10;

type CategoryDefaults = Pick<
  TcoFormData,
  | "purchasePrice"
  | "insuranceCost"
  | "maintenanceCost"
  | "fuelConsumption"
  | "elecConsumption"
  | "tireCost"
  | "tireLifespan"
  | "fiscalHp"
>;

export const categoryDefaults: Record<Category, CategoryDefaults> = {
  small: {
    purchasePrice: 4250,
    insuranceCost: 450,
    maintenanceCost: 225,
    fuelConsumption: 2.5,
    elecConsumption: 5,
    tireCost: 150,
    tireLifespan: 15000,
    fiscalHp: 1,
  },
  medium: {
    purchasePrice: 8250,
    insuranceCost: 670,
    maintenanceCost: 375,
    fuelConsumption: 5.0,
    elecConsumption: 7,
    tireCost: 250,
    tireLifespan: 12000,
    fiscalHp: 5,
  },
  large: {
    purchasePrice: 15000,
    insuranceCost: 850,
    maintenanceCost: 575,
    fuelConsumption: 6.5,
    elecConsumption: 9,
    tireCost: 400,
    tireLifespan: 10000,
    fiscalHp: 9,
  },
};

export const defaultForm: TcoFormData = {
  ...categoryDefaults.medium,
  model: "",
  category: "medium",
  energy: "petrol",
  bikeAge: 0,
  years: 5,
  annualKm: 10000,
  youngRider: false,
  fuelPrice: 2.16,
  elecPrice: 0.2,
  parkingCost: 50,
  city: "none",
  region: "IDF",
  firstBike: false,
  // Rough estimates, shown as editable fields
  gearCost: 600,
  licenceCost: 1000,
  transitPass: NAVIGO_MONTHLY,
  includeDepreciation: true,
};

export const categoryFromDisplacement = (cc: number): Category =>
  cc <= 125 ? "small" : cc < 600 ? "medium" : "large";

export const presetFromBike = (bike: BikeData): Partial<TcoFormData> => {
  const category = categoryFromDisplacement(bike["Cylindrée (cm³)"]);
  return {
    model: bike.Modèle,
    category,
    energy: "petrol",
    bikeAge: 0,
    purchasePrice: bike["Prix_Achat_Neuf (€)"],
    insuranceCost: bike["Assurance_Annuelle_Moyenne (€)"],
    maintenanceCost: bike["Entretien_Annuel (€)"],
    fuelConsumption: bike.Consommation_L_100km,
    tireCost: bike["Coût_Pneus_Par_Change (€)"],
    tireLifespan: bike.Durée_Vie_Pneus_km,
    fiscalHp: categoryDefaults[category].fiscalHp,
  };
};

// Monthly parking cost implied by a city profile, null when the profile sets none
export const cityParkingCost = (form: TcoFormData) =>
  form.city === "paris"
    ? form.energy === "electric"
      ? 0
      : Math.round((PARIS_RESIDENT_PARKING_YEARLY / 12) * 100) / 100
    : null;

// Share of the value lost each year of the bike's life. Estimate: no official
// depreciation data exists for motorcycles.
const YEARLY_LOSS = [0.2, 0.12, 0.1];
const LATER_YEARLY_LOSS = 0.08;

const retention = (age: number) => {
  let value = 1;
  for (let i = 0; i < age; i++) {
    value *= 1 - (YEARLY_LOSS[i] ?? LATER_YEARLY_LOSS);
  }
  return value;
};

export function computeTco(form: TcoFormData): TcoData {
  const years = Math.min(MAX_YEARS, Math.max(1, Math.round(form.years) || 1));
  const bikeAge = Math.max(0, Math.round(form.bikeAge) || 0);
  const electric = form.energy === "electric";

  const insurance =
    form.insuranceCost + (form.youngRider ? YOUNG_RIDER_SURCHARGE : 0);
  const fuel =
    ((electric
      ? form.elecConsumption * form.elecPrice
      : form.fuelConsumption * form.fuelPrice) *
      form.annualKm) /
    100;
  const tires =
    form.tireLifespan > 0
      ? (form.tireCost * form.annualKm) / form.tireLifespan
      : 0;
  const parking = form.parkingCost * 12;

  const registration = registrationCost(form.region, form.fiscalHp, electric);
  const gear = form.firstBike ? form.gearCost : 0;
  const licence = form.firstBike ? form.licenceCost : 0;
  const critAir = form.city === "paris" ? CRITAIR_PRICE : 0;
  const acquisition = registration + gear + licence + critAir;

  let running = 0;
  let inspections = 0;
  let resale = form.purchasePrice;
  const timeline = [];
  for (let year = 1; year <= years; year++) {
    const age = bikeAge + year;
    if (isInspectionAge(age)) inspections += CT_PRICE;
    running += insurance + form.maintenanceCost + fuel + tires + parking;
    resale = (form.purchasePrice * retention(age)) / retention(bikeAge);
    const lostValue = form.includeDepreciation
      ? form.purchasePrice - resale
      : 0;
    timeline.push({
      year,
      cumulative: acquisition + running + inspections + lostValue,
      resale,
    });
  }

  const totalOverPeriod = timeline[timeline.length - 1].cumulative;
  const totalCost = totalOverPeriod / years;

  return {
    ...form,
    years,
    bikeAge,
    totalCost,
    totalOverPeriod,
    costPerKm: form.annualKm > 0 ? totalCost / form.annualKm : 0,
    resaleValue: resale,
    breakdown: {
      depreciation: form.includeDepreciation
        ? (form.purchasePrice - resale) / years
        : 0,
      insurance,
      maintenance: form.maintenanceCost,
      fuel,
      tires,
      technical: inspections / years,
      parking,
      acquisition: acquisition / years,
    },
    firstYear: { registration, gear, licence, critAir, total: acquisition },
    timeline,
  };
}

// Shareable URL: only the fields that differ from the defaults are written
export const toQuery = (form: TcoFormData) => {
  const params = new URLSearchParams();
  (Object.keys(defaultForm) as Array<keyof TcoFormData>).forEach((key) => {
    const value = form[key];
    if (value === defaultForm[key]) return;
    params.set(
      key,
      typeof value === "boolean" ? (value ? "1" : "0") : String(value),
    );
  });
  return params.toString();
};

const allowedValues: Partial<Record<keyof TcoFormData, string[]>> = {
  category: ["small", "medium", "large"],
  energy: ["petrol", "electric"],
  city: ["none", "paris"],
};

export const fromQuery = (search: string): TcoFormData => {
  const params = new URLSearchParams(search);
  const form: Record<string, unknown> = { ...defaultForm };
  (Object.keys(defaultForm) as Array<keyof TcoFormData>).forEach((key) => {
    const raw = params.get(key);
    if (raw === null) return;
    const fallback = defaultForm[key];
    if (typeof fallback === "boolean") {
      form[key] = raw === "1";
    } else if (typeof fallback === "number") {
      const parsed = parseFloat(raw);
      if (Number.isFinite(parsed) && parsed >= 0) form[key] = parsed;
    } else if (!allowedValues[key] || allowedValues[key].includes(raw)) {
      form[key] = raw;
    }
  });
  return form as unknown as TcoFormData;
};

export const formatEuro = (value: number) =>
  `${Math.round(value).toLocaleString("fr-FR")} €`;
