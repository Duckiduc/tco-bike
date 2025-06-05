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

  const topBikes = bikeData.slice(0, 10);
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
                Top 10 des motos les plus populaires en France (2024)
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
