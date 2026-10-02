// Reference figures for France, checked in October 2026.
// See the "Sources & Références" tab for where each one comes from.

export const REFERENCE_YEAR = 2026;

// Regional tax per fiscal horsepower (€). evDiscount is the share waived for
// electric vehicles. Rates come from carte grise comparison sites, not from an
// official table: the official simulator on service-public.gouv.fr prevails.
export const REGIONS = [
  { code: "ARA", name: "Auvergne-Rhône-Alpes", rate: 43, evDiscount: 0 },
  { code: "BFC", name: "Bourgogne-Franche-Comté", rate: 60, evDiscount: 0 },
  { code: "BRE", name: "Bretagne", rate: 60, evDiscount: 0 },
  { code: "CVL", name: "Centre-Val de Loire", rate: 60, evDiscount: 0 },
  { code: "COR", name: "Corse", rate: 53, evDiscount: 0 },
  { code: "GES", name: "Grand Est", rate: 60, evDiscount: 0 },
  { code: "HDF", name: "Hauts-de-France", rate: 43, evDiscount: 0.5 },
  { code: "IDF", name: "Île-de-France", rate: 68.95, evDiscount: 0 },
  { code: "NOR", name: "Normandie", rate: 60, evDiscount: 0 },
  { code: "NAQ", name: "Nouvelle-Aquitaine", rate: 58, evDiscount: 0 },
  { code: "OCC", name: "Occitanie", rate: 59.5, evDiscount: 0 },
  { code: "PDL", name: "Pays de la Loire", rate: 51, evDiscount: 0 },
  { code: "PAC", name: "Provence-Alpes-Côte d'Azur", rate: 60, evDiscount: 0 },
  { code: "GUA", name: "Guadeloupe", rate: 41, evDiscount: 0 },
  { code: "GUY", name: "Guyane", rate: 42.5, evDiscount: 0 },
  { code: "MAR", name: "Martinique", rate: 53, evDiscount: 0 },
  { code: "REU", name: "La Réunion", rate: 60, evDiscount: 0 },
  { code: "MAY", name: "Mayotte", rate: 30, evDiscount: 0 },
];

// Fixed tax (11 €) + delivery fee (2,76 €)
export const REGISTRATION_FIXED_FEES = 11 + 2.76;

// Motorcycles pay half the regional rate (BOFiP BOI-AIS-MOB-10-20-30 §180)
export const registrationCost = (
  regionCode: string,
  fiscalHp: number,
  electric: boolean,
) => {
  const region = REGIONS.find((r) => r.code === regionCode);
  if (!region) return REGISTRATION_FIXED_FEES;
  const regional =
    fiscalHp * region.rate * 0.5 * (electric ? 1 - region.evDiscount : 1);
  return regional + REGISTRATION_FIXED_FEES;
};

// Contrôle technique, category L: first one at 5 years, then every 3 years.
// Pricing is unregulated, 70 € is the going rate.
export const CT_PRICE = 70;
export const isInspectionAge = (age: number) => age >= 5 && (age - 5) % 3 === 0;

export const YOUNG_RIDER_SURCHARGE = 600;

// Paris on-street parking for residents with a petrol two-wheeler:
// 22,50 € card per year + 4,50 € per week. Free for electric two-wheelers.
export const PARIS_RESIDENT_PARKING_YEARLY = 22.5 + 4.5 * 52;
export const CRITAIR_PRICE = 3.85;

// Navigo monthly pass, all zones, since January 1st 2026
export const NAVIGO_MONTHLY = 90.8;

// g CO2e per km, construction included (ADEME, impactco2.fr)
export const CO2_PER_KM = {
  motoSmall: 87.2, // moto thermique <= 250 cm³
  motoLarge: 214.7, // moto thermique > 250 cm³
  motoElectric: 59.3, // scooter électrique, the only electric two-wheeler listed
  car: 142.3, // voiture thermique
  metro: 4.44,
};

// Barème kilométrique for motorcycles over 50 cm³ (unchanged since 2023).
// Returns the yearly amount in € for a distance in km.
export const motoBareme = (fiscalHp: number, km: number, electric: boolean) => {
  const [low, midRate, midFixed, high] =
    fiscalHp <= 2
      ? [0.395, 0.099, 891, 0.248]
      : fiscalHp <= 5
        ? [0.468, 0.082, 1158, 0.275]
        : [0.606, 0.079, 1583, 0.343];
  const amount =
    km <= 3000 ? km * low : km <= 6000 ? km * midRate + midFixed : km * high;
  return electric ? amount * 1.2 : amount;
};

// Barème kilométrique for a 5 CV car, used as the official cost of a car
export const carBareme = (km: number) =>
  km <= 5000 ? km * 0.636 : km <= 20000 ? km * 0.357 + 1395 : km * 0.427;

// Crit'Air class of a two-wheeler from its first registration year
export const critAirClass = (
  firstRegistrationYear: number,
  electric: boolean,
) => {
  if (electric) return "Électrique";
  if (firstRegistrationYear >= 2017) return "1";
  if (firstRegistrationYear >= 2007) return "2";
  if (firstRegistrationYear >= 2005) return "3";
  if (firstRegistrationYear >= 2001) return "4";
  return "Non classé";
};
