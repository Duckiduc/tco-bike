import React from "react";
import { Typography, Card, Tag, Alert, Space } from "antd";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FundOutlined, RiseOutlined, FallOutlined } from "@ant-design/icons";
import type { TcoData, ComparisonData } from "../types";

const { Title, Text } = Typography;

interface TcoResultsProps {
  data: TcoData | null;
  comparisonData: ComparisonData[];
}

const TcoResults: React.FC<TcoResultsProps> = ({ data, comparisonData }) => {
  if (!data) {
    return (
      <Card>
        {" "}
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <FundOutlined
            style={{ fontSize: "4rem", color: "#ccc", marginBottom: "1rem" }}
          />
          <Title level={2} style={{ fontWeight: 600, marginBottom: "1rem" }}>
            Résultats TCO
          </Title>
          <Text type="secondary">
            Remplissez le formulaire et cliquez sur "Calculer le TCO" pour voir
            vos résultats
          </Text>
        </div>
      </Card>
    );
  }

  const { totalCost, breakdown, category, includeDepreciation } = data;

  const pieData = [
    ...(includeDepreciation && breakdown.depreciation > 0
      ? [
          {
            name: "Dépréciation",
            value: breakdown.depreciation,
            fill: "#8884d8",
          },
        ]
      : []),
    { name: "Assurance", value: breakdown.insurance, fill: "#82ca9d" },
    { name: "Entretien", value: breakdown.maintenance, fill: "#ffc658" },
    { name: "Carburant", value: breakdown.fuel, fill: "#ff7300" },
    { name: "Pneus", value: breakdown.tires, fill: "#00ff00" },
    { name: "Contrôle technique", value: breakdown.technical, fill: "#ff00ff" },
    { name: "Stationnement", value: breakdown.parking, fill: "#00ffff" },
  ];

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "small":
        return "Petites cylindrées";
      case "medium":
        return "Moyennes cylindrées";
      case "large":
        return "Grosses cylindrées";
      default:
        return category;
    }
  };

  const comparisonAverage = comparisonData.find(
    (item) => item.Catégorie === getCategoryLabel(category)
  );

  const comparisonChartData = comparisonAverage
    ? [
        ...(includeDepreciation && breakdown.depreciation > 0
          ? [
              {
                category: "Dépréciation",
                yours: breakdown.depreciation,
                average: comparisonAverage.Dépréciation,
              },
            ]
          : []),
        {
          category: "Assurance",
          yours: breakdown.insurance,
          average: comparisonAverage.Assurance,
        },
        {
          category: "Entretien",
          yours: breakdown.maintenance,
          average: comparisonAverage.Entretien,
        },
        {
          category: "Carburant",
          yours: breakdown.fuel,
          average: comparisonAverage.Carburant,
        },
        {
          category: "Pneus",
          yours: breakdown.tires,
          average: comparisonAverage.Pneus,
        },
        {
          category: "Stationnement",
          yours: breakdown.parking,
          average: comparisonAverage.Stationnement,
        },
      ]
    : [];

  const costLabels: Record<string, string> = {
    depreciation: "Dépréciation",
    insurance: "Assurance",
    maintenance: "Entretien",
    fuel: "Carburant",
    tires: "Pneus",
    technical: "Contrôle technique",
    parking: "Stationnement",
  };

  const isAboveAverage =
    comparisonAverage && totalCost > comparisonAverage.Total;
  const difference = comparisonAverage
    ? Math.abs(totalCost - comparisonAverage.Total)
    : 0;

  return (
    <Card>
      <div style={{ padding: "2rem" }}>
        <Space align="center" style={{ marginBottom: "1.5rem" }}>
          <FundOutlined style={{ color: "#2196f3", fontSize: "1.75rem" }} />
          <Title level={2} style={{ fontWeight: 600, margin: 0 }}>
            Résultats TCO
          </Title>
        </Space>

        {/* Total Cost Card */}
        <Card
          style={{
            marginBottom: "2rem",
            background: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)",
            color: "white",
            textAlign: "center",
          }}
        >
          <Title
            level={1}
            style={{ fontWeight: 700, marginBottom: "0.5rem", color: "white" }}
          >
            {Math.round(totalCost).toLocaleString()} €
          </Title>
          <Title level={4} style={{ opacity: 0.9, margin: 0, color: "white" }}>
            Coût Total de Possession Annuel
          </Title>
        </Card>

        {/* Cost Breakdown */}
        <div style={{ marginBottom: "2rem" }}>
          <Title level={4} style={{ marginBottom: "1rem", fontWeight: 600 }}>
            Répartition des coûts
            {!includeDepreciation && (
              <Text
                style={{
                  fontSize: "14px",
                  color: "#666",
                  fontWeight: 400,
                  marginLeft: "8px",
                }}
              >
                (dépréciation exclue)
              </Text>
            )}
          </Title>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            {Object.entries(breakdown)
              .filter(
                ([key, value]) =>
                  key !== "depreciation" || (includeDepreciation && value > 0)
              )
              .map(([key, value]) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                  }}
                >
                  <Text style={{ fontWeight: 500 }}>{costLabels[key]}</Text>
                  <Tag color="blue" style={{ fontWeight: 600 }}>
                    {Math.round(value).toLocaleString()} €
                  </Tag>
                </div>
              ))}
          </Space>
        </div>

        {/* Pie Chart */}
        <div style={{ marginBottom: "2rem" }}>
          <Title level={4} style={{ marginBottom: "1rem", fontWeight: 600 }}>
            Répartition visuelle
          </Title>
          <div
            style={{
              height: "350px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              padding: "1rem",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) =>
                    `${Math.round(Number(value)).toLocaleString()} €`
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Comparison Chart */}
        {comparisonChartData.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <Title level={4} style={{ marginBottom: "1rem", fontWeight: 600 }}>
              Comparaison avec la moyenne française
            </Title>
            <div
              style={{
                height: "350px",
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
                padding: "1rem",
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) =>
                      `${Math.round(Number(value)).toLocaleString()} €`
                    }
                  />
                  <Legend />
                  <Bar dataKey="yours" fill="#2196f3" name="Vos coûts" />
                  <Bar
                    dataKey="average"
                    fill="#1976d2"
                    name="Moyenne française"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Comparison Summary */}
        {comparisonAverage && (
          <Alert
            type={isAboveAverage ? "warning" : "success"}
            icon={isAboveAverage ? <RiseOutlined /> : <FallOutlined />}
            message={
              <div>
                <Text style={{ fontWeight: 500 }}>
                  <strong>Comparaison totale:</strong> Vos coûts (
                  {Math.round(totalCost).toLocaleString()} €) vs moyenne
                  française (
                  {Math.round(comparisonAverage.Total).toLocaleString()} €)
                </Text>
                <div style={{ marginTop: "0.5rem" }}>
                  <Text>
                    {isAboveAverage ? (
                      <>
                        Vous dépensez{" "}
                        <strong>
                          {Math.round(difference).toLocaleString()} € de plus
                        </strong>{" "}
                        que la moyenne
                      </>
                    ) : (
                      <>
                        Vous économisez{" "}
                        <strong>
                          {Math.round(difference).toLocaleString()} €
                        </strong>{" "}
                        par rapport à la moyenne
                      </>
                    )}
                  </Text>
                </div>
              </div>
            }
          />
        )}
      </div>
    </Card>
  );
};

export default TcoResults;
