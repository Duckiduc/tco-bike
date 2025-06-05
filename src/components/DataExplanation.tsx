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
    },
    {
      title: "Cylindrée",
      dataIndex: "Cylindrée (cm³)",
      key: "displacement",
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
            <div
              style={{
                height: "400px",
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
                padding: "1rem",
              }}
            >
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
              <Panel header="Dépréciation (15% par an)" key="1">
                <Text>
                  Basée sur une dépréciation moyenne de 15% par an pour les
                  motos, calculée sur le prix d'achat initial. Cette valeur
                  correspond aux études de marché européennes sur la
                  dépréciation des deux-roues motorisés.
                </Text>
              </Panel>
              <Panel header="Assurance" key="2">
                <Text>
                  Coûts d'assurance moyens en France pour 2024 : au tiers
                  (455€), intermédiaire (648€), tous risques (907€). Majoration
                  de 600€ pour les jeunes conducteurs. Sources : comparateurs
                  d'assurance français.
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
                  Calculé avec le prix moyen du SP95 en France (1,65€/L en 2024)
                  et la consommation spécifique à chaque catégorie de moto selon
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
                  Obligatoire tous les 2 ans pour les motos de plus de 4 ans
                  (35€ par contrôle, soit 17,50€ par an). Conforme à la
                  réglementation française en vigueur.
                </Text>
              </Panel>
              <Panel header="Stationnement" key="7">
                <Text>
                  Coûts variables selon la zone géographique : gratuit en
                  province, jusqu'à 100€/mois dans les centres-villes.
                  Personnalisable selon votre situation.
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
                  <strong>• Prix carburant :</strong> Ministère de la Transition
                  Écologique
                  <br />
                  <strong>• Assurances :</strong> Moyennes des principaux
                  assureurs français 2024
                  <br />
                  <strong>• Entretien :</strong> Enquêtes auprès des
                  concessionnaires et garages agréés
                  <br />
                  <strong>• Dépréciation :</strong> Études Eurotax et Argus Moto
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
            >
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
    <div style={{ marginTop: "4rem" }}>
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
