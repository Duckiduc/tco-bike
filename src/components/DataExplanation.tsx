import React, { useState } from "react";
import {
  Typography,
  Card,
  Table,
  Tabs,
  Collapse,
  Tag,
  Alert,
  Space,
} from "antd";
import {
  InfoCircleOutlined,
  RiseOutlined,
  ToolOutlined,
  DatabaseOutlined,
  CaretRightOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { BikeData, BrandData } from "../types";

const { Title, Text } = Typography;
const { Panel } = Collapse;

const officialSources = [
  {
    label: "prix-carburants.gouv.fr - Prix des carburants en France (données ouvertes)",
    href: "https://data.economie.gouv.fr/explore/dataset/prix-des-carburants-en-france-flux-instantane-v2/",
    detail:
      "Moyenne des stations au 2 octobre 2026 : SP95-E10 2,16 €/L, SP95 2,22 €/L, SP98 2,27 €/L.",
  },
  {
    label: "Ministère de la Transition écologique - Prix des produits pétroliers",
    href: "https://www.ecologie.gouv.fr/politiques-publiques/prix-produits-petroliers",
    detail:
      "Relevé hebdomadaire des prix moyens à la pompe, publié chaque lundi, avec historique depuis 2020.",
  },
  {
    label: "Service-Public.fr - Contrôle technique : obligatoire ou dispense ?",
    href: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2880",
    detail:
      "Catégorie L soumise au contrôle technique depuis le 15 avril 2024 (fiche vérifiée le 23 janvier 2026).",
  },
  {
    label: "Ministère de la Transition écologique - Contrôle technique des véhicules",
    href: "https://www.ecologie.gouv.fr/politiques-publiques/controle-technique-vehicules",
    detail:
      "Premier contrôle au plus tard 5 ans après la première immatriculation, puis tous les 3 ans ; contre-visite sous 2 mois ; contrôle de moins de 6 mois pour une revente.",
  },
  {
    label: "Légifrance - Arrêté du 23 octobre 2023 (contrôle technique des 2-3 roues et quadricycles)",
    href: "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000048242538",
    detail: "Texte réglementaire de référence du contrôle technique de la catégorie L.",
  },
  {
    label: "Service-Public.fr - Coût de la carte grise",
    href: "https://www.service-public.gouv.fr/particuliers/vosdroits/F19211",
    detail:
      "Taxe régionale + taxe fixe de 11 € + redevance d'acheminement de 2,76 € (fiche vérifiée le 8 septembre 2026), avec simulateur officiel.",
  },
  {
    label: "BOFiP - Taxe régionale sur les certificats d'immatriculation",
    href: "https://bofip.impots.gouv.fr/bofip/13925-PGP.html/identifiant=BOI-AIS-MOB-10-20-30-20240710",
    detail:
      "Tarif régional réduit de moitié pour les motocyclettes (§180), exonération des cyclomoteurs (§170).",
  },
  {
    label: "economie.gouv.fr - Barème des frais kilométriques",
    href: "https://www.economie.gouv.fr/particuliers/impots-et-fiscalite/gerer-mon-impot-sur-le-revenu/impot-sur-le-revenu-tout-savoir-sur-le-bareme-des-frais-kilometriques",
    detail:
      "Barème motos inchangé en 2026 : au-delà de 6 000 km, 0,248 €/km (1-2 CV), 0,275 €/km (3-5 CV), 0,343 €/km (plus de 5 CV).",
  },
  {
    label: "France Assureurs - Le marché de l'assurance automobile des particuliers en 2025",
    href: "https://www.franceassureurs.fr/nos-chiffres-cles/assurance-de-dommages-et-responsabilite/marche-assurance-automobile-particuliers-2025/",
    detail:
      "Prime moyenne d'un deux-roues : 290 € hors taxes (+4,6 %), parc de 5 millions de véhicules (publié le 20 juillet 2026).",
  },
  {
    label: "Ville de Paris - Stationnement résidentiel",
    href: "https://www.paris.fr/pages/stationnement-residentiel-mode-d-emploi-2078",
    detail:
      "Deux-roues motorisés : carte résident 22,50 € par an ou 45 € pour 3 ans, puis 0,75 € par jour ou 4,50 € par semaine (page mise à jour le 28 septembre 2026).",
  },
  {
    label: "ADEME - Impact CO2, moto thermique",
    href: "https://impactco2.fr/outils/transport/moto",
    detail:
      "Par km, fabrication comprise : moto de plus de 250 cm³ 215 g CO2e, moto jusqu'à 250 cm³ 87 g, scooter électrique 59 g, voiture thermique 142 g, métro 4 g (Base Empreinte).",
  },
  {
    label: "Île-de-France Mobilités - Tarifs 2026",
    href: "https://www.iledefrance-mobilites.fr/en/tarifs-titre-de-transport-en-commun-2026",
    detail:
      "Forfait Navigo mois toutes zones : 90,80 € depuis le 1er janvier 2026 (998,80 € en annuel).",
  },
  {
    label: "Ville de Paris - Stationnement des deux-roues motorisés électriques",
    href: "https://www.paris.fr/pages/les-autres-offres-de-stationnement-2355",
    detail:
      "Stationnement gratuit sur voirie pour les deux-roues motorisés électriques.",
  },
  {
    label: "Certificat qualité de l'air (Crit'Air) - site officiel",
    href: "https://www.certificat-air.gouv.fr/",
    detail:
      "Vignette à 3,85 € envoi compris ; classement des deux-roues selon la date de première immatriculation.",
  },
  {
    label: "Sécurité routière - Équipements obligatoires à moto",
    href: "https://www.securite-routiere.gouv.fr/reglementation-liee-aux-modes-de-deplacements/moto/equipements-obligatoires-moto",
    detail: "Casque homologué et gants certifiés obligatoires pour le conducteur et le passager.",
  },
  {
    label: "SDES - Immatriculations des véhicules routiers",
    href: "https://www.statistiques.developpement-durable.gouv.fr/immatriculation-des-vehicules-routiers",
    detail:
      "Statistiques publiques des immatriculations neuves et d'occasion, deux-roues motorisés compris.",
  },
];

interface DataExplanationProps {
  bikeData: BikeData[];
  brandData: BrandData[];
}

const DataExplanation: React.FC<DataExplanationProps> = ({
  bikeData,
  brandData,
}) => {
  const [activeTab, setActiveTab] = useState("1");

  const topBikes = bikeData.slice(0, 20);
  const topBrands = brandData.slice(0, 8);

  const brandChartData = topBrands.map((brand) => ({
    brand: brand.Marque,
    cost: brand["TCO_Moyen_Annuel (€)"],
  }));

  const bikeColumns = [
    {
      title: "Rang",
      key: "rank",
      render: (_: unknown, __: unknown, index: number) => (
        <Tag color={index < 3 ? "blue" : "default"}>{index + 1}</Tag>
      ),
    },
    {
      title: "Modèle",
      dataIndex: "Modèle",
      key: "model",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Marque",
      dataIndex: "Marque",
      key: "brand",
      className: "mobile-hide",
    },
    {
      title: "Cylindrée",
      dataIndex: "Cylindrée (cm³)",
      key: "displacement",
      className: "mobile-hide",
    },
    {
      title: "Prix moyen",
      dataIndex: "Prix_Achat_Neuf (€)",
      key: "price",
      render: (price: number) => (
        <Text strong style={{ color: "#2196f3" }}>
          {price?.toLocaleString() || "N/A"} €
        </Text>
      ),
    },
  ];

  const brandColumns = [
    {
      title: "Marque",
      dataIndex: "Marque",
      key: "brand",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "TCO moyen annuel",
      dataIndex: "TCO_Moyen_Annuel (€)",
      key: "tco",
      render: (tco: number) => (
        <Text strong style={{ color: "#2196f3" }}>
          {tco?.toLocaleString() || "N/A"} €
        </Text>
      ),
    },
    {
      title: "Fiabilité",
      dataIndex: "Fiabilité_Note_10",
      key: "reliability",
      className: "mobile-hide",
      render: (score: number) => (
        <Tag color={score >= 8 ? "green" : score >= 6 ? "orange" : "red"}>
          {score}/10
        </Tag>
      ),
    },
    {
      title: "Disponibilité pièces",
      dataIndex: "Disponibilité_Pièces_Note_10",
      key: "parts",
      className: "mobile-hide",
      render: (score: number) => (
        <Tag color={score >= 8 ? "green" : score >= 6 ? "orange" : "red"}>
          {score}/10
        </Tag>
      ),
    },
  ];

  const tabItems = [
    {
      key: "1",
      label: (
        <span>
          <RiseOutlined />
          <span style={{ marginLeft: "0.5rem" }} />
          Motos Populaires
        </span>
      ),
      children: (
        <div>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div>
              <Title
                level={4}
                style={{ marginBottom: "0.5rem", fontWeight: 600 }}
              >
                Top 20 des motos les plus populaires en France (2024)
              </Title>
              <Text type="secondary">
                Classement basé sur les données de ventes et d'immatriculations
              </Text>
            </div>
            <Table
              columns={bikeColumns}
              dataSource={topBikes.map((bike, index) => ({
                ...bike,
                key: `bike-${index}`,
              }))}
              pagination={false}
              size="middle"
            />
          </Space>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <span>
          <ToolOutlined />
          <span style={{ marginLeft: "0.5rem" }} />
          Coûts par Marque
        </span>
      ),
      children: (
        <div>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div>
              <Title
                level={4}
                style={{ marginBottom: "0.5rem", fontWeight: 600 }}
              >
                Coûts moyens annuels par marque
              </Title>
              <Text type="secondary">
                Incluant assurance, entretien, carburant et dépréciation
              </Text>
            </div>
            <div className="data-brand-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={brandChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="brand" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => `${Number(value).toLocaleString()} €`}
                  />
                  <Legend />
                  <Bar
                    dataKey="cost"
                    fill="#2196f3"
                    name="Coût annuel moyen (€)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <Table
              columns={brandColumns}
              dataSource={topBrands.map((brand, index) => ({
                ...brand,
                key: `brand-${index}`,
              }))}
              pagination={false}
              size="middle"
            />
          </Space>
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <span>
          <DatabaseOutlined />
          <span style={{ marginLeft: "0.5rem" }} />
          Méthodologie
        </span>
      ),
      children: (
        <div>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div>
              <Title
                level={4}
                style={{ marginBottom: "1rem", fontWeight: 600 }}
              >
                Méthodologie de calcul du TCO
              </Title>
              <Text style={{ lineHeight: 1.7 }}>
                Notre calculateur de Coût Total de Possession (TCO) prend en
                compte tous les aspects financiers de la possession d'une moto.
              </Text>
            </div>

            <Collapse
              expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 90 : 0} />
              )}
              ghost
            >
              <Panel header="Dépréciation (dégressive)" key="1">
                <Text>
                  La moto perd 20% de sa valeur la première année, 12% la
                  deuxième, 10% la troisième, puis 8% par an. La courbe part de
                  l'âge de la moto à l'achat et donne la valeur de revente à la
                  fin de la durée de détention. Il s'agit d'une estimation : il
                  n'existe pas de statistique officielle de décote des
                  deux-roues.
                </Text>
              </Panel>
              <Panel header="Assurance" key="2">
                <Text>
                  Devis moyens relevés par les comparateurs français en 2024 :
                  au tiers (455€), intermédiaire (648€), tous risques (907€).
                  Majoration de 600€ pour les jeunes conducteurs. À titre de
                  repère, France Assureurs mesure une prime moyenne réellement
                  payée de 290€ hors taxes par deux-roues en 2025 (+4,6%), tous
                  contrats et toutes cylindrées confondus, cyclomoteurs
                  compris.
                </Text>
              </Panel>
              <Panel header="Entretien et Maintenance" key="3">
                <Text>
                  Inclut les révisions périodiques, changement d'huile, filtres,
                  freins, chaîne, et réparations courantes. Varie selon la
                  cylindrée : 225€ (petite), 375€ (moyenne), 575€ (grosse).
                </Text>
              </Panel>
              <Panel header="Carburant" key="4">
                <Text>
                  Calculé avec le prix moyen du SP95-E10 en France (2,16€/L au 2
                  octobre 2026, moyenne des stations du jeu de données ouvert
                  prix-carburants.gouv.fr ; SP95 : 2,22€/L, SP98 : 2,27€/L) et
                  la consommation spécifique à chaque catégorie de moto selon
                  votre kilométrage annuel.
                </Text>
              </Panel>
              <Panel header="Pneumatiques" key="5">
                <Text>
                  Coût proratisé selon la durée de vie des pneus et votre
                  kilométrage. Durée de vie moyenne : 15 000 km (petite
                  cylindrée) à 10 000 km (grosse cylindrée).
                </Text>
              </Panel>
              <Panel header="Contrôle technique" key="6">
                <Text>
                  Obligatoire depuis le 15 avril 2024 pour les véhicules de
                  catégorie L : premier contrôle dans les 6 mois précédant le
                  5e anniversaire de la première immatriculation, puis tous les
                  3 ans. Le tarif est libre (environ 70€ constatés en centre).
                  Le calcul compte les contrôles qui tombent pendant la durée
                  de détention, selon l'âge de la moto.
                </Text>
              </Panel>
              <Panel header="Stationnement" key="7">
                <Text>
                  Coûts variables selon la zone géographique : gratuit en
                  province, jusqu'à 100€/mois dans les centres-villes. À Paris,
                  le stationnement sur voirie des deux-roues motorisés
                  thermiques est payant : carte résident à 22,50€ par an (45€
                  pour 3 ans), puis 0,75€ par jour ou 4,50€ par semaine.
                  Le profil « Paris » applique ce tarif (gratuit pour un
                  deux-roues électrique) et ajoute la vignette Crit'Air à
                  3,85€. Personnalisable selon votre situation.
                </Text>
              </Panel>
              <Panel header="Carte grise et frais d'acquisition" key="8">
                <Text>
                  Carte grise : puissance fiscale × tarif régional du cheval
                  fiscal, réduit de moitié pour les motocyclettes, plus 11€ de
                  taxe fixe et 2,76€ d'acheminement. Les tarifs régionaux 2026
                  proviennent de sites spécialisés : le simulateur de
                  Service-Public.fr fait foi. Le permis et l'équipement sont
                  des montants indicatifs à saisir. Ces frais sont lissés sur
                  la durée de détention.
                </Text>
              </Panel>
              <Panel header="Électrique" key="9">
                <Text>
                  L'énergie est calculée avec la consommation en kWh/100 km et
                  le tarif réglementé de l'électricité (environ 0,20€/kWh en
                  option base depuis août 2026). Le bonus écologique national
                  pour les deux-roues électriques a été supprimé en décembre
                  2024, et la plupart des régions ne les exonèrent plus de taxe
                  régionale.
                </Text>
              </Panel>
              <Panel header="Frais réels et alternatives" key="10">
                <Text>
                  Le barème kilométrique fiscal des motocyclettes (inchangé
                  depuis 2023, majoré de 20% en électrique) est comparé à vos
                  coûts hors stationnement. Le coût de la voiture correspond au
                  barème fiscal d'une 5 CV, celui des transports en commun à
                  l'abonnement saisi (Navigo toutes zones : 90,80€ par mois en
                  2026). Les émissions sont celles de l'ADEME, fabrication
                  comprise : 87 g CO2e/km pour une moto jusqu'à 250 cm³, 215 g
                  au-delà, 59 g pour un scooter électrique, 142 g pour une
                  voiture thermique, 4 g pour le métro.
                </Text>
              </Panel>
            </Collapse>

            <Alert
              type="info"
              icon={<InfoCircleOutlined />}
              message="Sources des données"
              description={
                <div style={{ lineHeight: 1.6 }}>
                  <strong>• Données de ventes :</strong> CSIAM (Chambre
                  Syndicale Internationale de l'Automobile et du Motocycle)
                  <br />
                  <strong>• Prix carburant :</strong> prix-carburants.gouv.fr
                  (données ouvertes du ministère de l'Économie), octobre 2026
                  <br />
                  <strong>• Assurances :</strong> comparateurs français 2024 et
                  France Assureurs (marché 2025)
                  <br />
                  <strong>• Contrôle technique, carte grise :</strong>{" "}
                  Service-Public.fr, ministère de la Transition écologique,
                  BOFiP
                  <br />
                  <strong>• Entretien :</strong> Enquêtes auprès des
                  concessionnaires et garages agréés
                  <br />
                  <strong>• Dépréciation :</strong> estimation, faute de
                  statistique officielle
                </div>
              }
            />
          </Space>
        </div>
      ),
    },
    {
      key: "4",
      label: (
        <span>
          <LinkOutlined />
          <span style={{ marginLeft: "0.5rem" }} />
          Sources & Références
        </span>
      ),
      children: (
        <div>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div>
              <Title
                level={4}
                style={{ marginBottom: "1rem", fontWeight: 600 }}
              >
                Sources utilisées pour la compilation des données
              </Title>
              <Text
                style={{
                  lineHeight: 1.7,
                  marginBottom: "2rem",
                  display: "block",
                }}
              >
                Ce projet open source compile des données provenant de multiples
                sources publiques pour estimer les coûts de possession d'une
                moto en France. Voici l'ensemble des références consultées :
              </Text>
            </div>

            <Collapse
              expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 90 : 0} />
              )}
              ghost
              defaultActiveKey={["official"]}
            >
              <Panel
                header="🏛️ Sources officielles (vérifiées en octobre 2026)"
                key="official"
              >
                <div style={{ lineHeight: 1.8, fontSize: "0.9rem" }}>
                  {officialSources.map((source) => (
                    <div key={source.href} style={{ marginBottom: "0.5rem" }}>
                      <a
                        href={source.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {source.label}
                      </a>
                      <br />
                      <Text type="secondary">{source.detail}</Text>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel header="💰 Coûts & Budget (Sources 1-25)" key="costs">
                <div style={{ lineHeight: 1.8, fontSize: "0.9rem" }}>
                  <a
                    href="https://www.reddit.com/r/motorcycles/comments/111063t/the_surprisingly_low_cost_of_buying_owning_and/?tl=fr"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [1] Reddit - Cost of buying & owning motorcycles
                  </a>
                  <br />
                  <a
                    href="https://www.permisapoints.fr/moto/combien-coute-moto-lorsque-debute"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [2] Permis à Points - Coût d'une moto pour débuter
                  </a>
                  <br />
                  <a
                    href="https://www.courtage-expertise-auto.fr/comment-importer-une-moto-en-france/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [3] Courtage Expertise Auto - Importer une moto en France
                  </a>
                  <br />
                  <a
                    href="https://www.lelynx.fr/breves/assurance-moto-prix/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [4] Le Lynx - Prix assurance moto
                  </a>
                  <br />
                  <a
                    href="https://www.conseils-vehicules.fr/budget-entretien-moto/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [5] Conseils Véhicules - Budget entretien moto
                  </a>
                  <br />
                  <a
                    href="https://www.assurance-prevention.fr/achat-moto.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [6] Assurance Prévention - Achat moto
                  </a>
                  <br />
                  <a
                    href="https://www.lerepairedesmotards.com/assurance/cout-prix-assurance-moto.php"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [7] Le Repaire des Motards - Coût assurance moto
                  </a>
                  <br />
                  <a
                    href="https://moto-securite.fr/entretien-bmw/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [8] Moto Sécurité - Entretien BMW
                  </a>
                  <br />
                  <a
                    href="https://www.r-pur.com/a/blog/news/consommation-carburant-moto-facteurs"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [9] R-Pur - Consommation carburant moto
                  </a>
                  <br />
                  <a
                    href="https://moto-station.com/moto-revue/actu/maxitest-consommations-moto-quelle-moto-consomme-le-moins/22424"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [10] Moto Station - Test consommations moto
                  </a>
                  <br />
                  <a
                    href="https://www.jm-auto.fr/consommation-moto-combien-de-carburant-utilise-une-moto/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [11] JM Auto - Consommation carburant moto
                  </a>
                  <br />
                  <a
                    href="https://www.cartegrise.com/france/prix-carte-grise/moto"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [12] Carte Grise - Prix carte grise moto
                  </a>
                  <br />
                  <a
                    href="https://www.boursorama.com/patrimoine/actualites/controle-technique-moto-les-tarifs-sont-pour-l-instant-plus-eleves-que-50-euros-9447ef254472ef3a431a43145b3d6ea4"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [13] Boursorama - Tarifs contrôle technique moto
                  </a>
                  <br />
                  <a
                    href="https://www.carte-grise.org/calcul_cout_carte_grise.php"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [14] Carte Grise - Calcul coût carte grise
                  </a>
                  <br />
                  <a
                    href="https://autobilan-stlaurent.com/prix-du-controle-technique-des-deux-roues/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [15] Autobilan - Prix contrôle technique 2 roues
                  </a>
                  <br />
                  <a
                    href="https://www.challenges.fr/economie/quel-budget-annuel-prevoir-pour-une-moto_776460"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [24] Challenges - Budget annuel moto
                  </a>
                  <br />
                  <a
                    href="https://www.corsin-autos.fr/actualites-auto/comprendre-le-cout-total-de-possession-tco-notre-guide-complet/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [25] Corsin Autos - Guide TCO complet
                  </a>
                  <br />
                </div>
              </Panel>

              <Panel
                header="🏍️ Données Marché & Modèles (Sources 26-60)"
                key="market"
              >
                <div style={{ lineHeight: 1.8, fontSize: "0.9rem" }}>
                  <a
                    href="https://www.moto-net.com/article/marche-moto-2024-les-meilleures-ventes-de-motos-et-scooters.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [26] Moto Net - Marché moto 2024 ventes
                  </a>
                  <br />
                  <a
                    href="https://www.moto-net.com/article/marche-moto-2024-le-classement-des-constructeurs-en-france.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [27] Moto Net - Classement constructeurs 2024
                  </a>
                  <br />
                  <a
                    href="https://a2riders.com/actu/moto-a2-classement-2024/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [28] A2 Riders - Classement moto A2 2024
                  </a>
                  <br />
                  <a
                    href="https://www.speedway.fr/pages/10-blog/31-actualites/14-moto/996-meilleure-marque-moto-2024.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [29] Speedway - Meilleure marque moto 2024
                  </a>
                  <br />
                  <a
                    href="https://www.lelynx.fr/breves/5-motos-plus-vendues-2023/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [30] Le Lynx - 5 motos plus vendues 2023
                  </a>
                  <br />
                  <a
                    href="https://moto.honda.fr/motorcycles/range/street/hornet/specifications-and-price.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [31] Honda France - CB750 Hornet prix
                  </a>
                  <br />
                  <a
                    href="https://www.planet-racing.fr/motos-hypernaked/296127-yamaha-mt-07-3000326784766.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [32] Planet Racing - Yamaha MT-07
                  </a>
                  <br />
                  <a
                    href="https://moto-station.com/guide-achat/ducati-panigale-v2-2020-a-2025-8252"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [33] Moto Station - Ducati Panigale V2
                  </a>
                  <br />
                  <a
                    href="https://www.caradisiac.com/motos-et-scooters-quelles-marques-coutent-le-plus-cher-a-reparer-201929.htm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [34] Caradisiac - Marques les plus chères à réparer
                  </a>
                  <br />
                  <a
                    href="https://www.motomag.com/Quelles-sont-les-marques-motos-et-scooters-les-plus-cheres-a-reparer-Le-bilan-SRA-2022.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [35] Motomag - Bilan SRA 2022 réparations
                  </a>
                  <br />
                </div>
              </Panel>

              <Panel header="🔧 Entretien & Réparations" key="maintenance">
                <div style={{ lineHeight: 1.8, fontSize: "0.9rem" }}>
                  <a
                    href="https://www.feuvert.fr/entretien-moto-et-scooter/revision-moto-pourquoi-quand-et-a-quel-prix/c40476.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [48] Feu Vert - Révision moto prix
                  </a>
                  <br />
                  <a
                    href="https://www.yamaha-motor.eu/fr/fr/service-support/maintenance-repair/forfaits-d-entretien/forfaits-d-entretien-motos/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [49] Yamaha - Forfaits d'entretien
                  </a>
                  <br />
                  <a
                    href="https://www.motojp.fr/tarif-horaire-mecanique-moto-2023-2024/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [43] MotoJP - Tarifs horaires mécanique
                  </a>
                  <br />
                  <a
                    href="https://www.boutique-biker.com/blogs/blog-moto/quelle-est-la-duree-de-vie-dun-pneu-moto"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [32] Boutique Biker - Durée de vie pneu moto
                  </a>
                  <br />
                  <a
                    href="https://muchpneu.fr/blog/duree-de-vie-dun-pneu-moto/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [34] MuchPneu - Durée de vie pneu moto
                  </a>
                  <br />
                </div>
              </Panel>

              <Panel header="📊 Méthodologie & Analyses" key="methodology">
                <div style={{ lineHeight: 1.8, fontSize: "0.9rem" }}>
                  <a
                    href="https://www.geotab.com/fr/blog/cout-total-de-possession/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    [28] Geotab - Coût total de possession
                  </a>
                  <br />
                  <Text style={{ fontStyle: "italic", color: "#666" }}>
                    + Données CSIAM, Ministère de la Transition Écologique,
                    études Eurotax/Argus Moto
                  </Text>
                </div>
              </Panel>
            </Collapse>

            <Alert
              type="warning"
              icon={<InfoCircleOutlined />}
              message="Note importante sur les sources"
              description={
                <div style={{ lineHeight: 1.6 }}>
                  <strong>Données approximatives :</strong> Les informations
                  proviennent de sources publiques variées compilées durant mon
                  temps libre. Les prix et coûts peuvent varier selon les
                  régions, époques et conditions spécifiques. Ce projet vise à
                  donner une estimation générale et ne remplace pas une analyse
                  professionnelle personnalisée.
                </div>
              }
            />
          </Space>
        </div>
      ),
    },
  ];

  return (
    <div className="data-explanation-container" style={{ marginTop: "4rem" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <Title
          level={1}
          style={{
            marginBottom: "1rem",
            fontWeight: 600,
          }}
        >
          Sources des données
        </Title>
        <Text style={{ fontSize: "1.1rem" }} type="secondary">
          Explorez les données du marché français de la moto utilisées pour nos
          calculs
        </Text>
      </div>

      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="large"
        />
      </Card>
    </div>
  );
};

export default DataExplanation;
