import React, { useState, useEffect } from "react";
import { Typography, Card, Row, Col, Space } from "antd";
import {
  EuroOutlined,
  ToolOutlined,
  CarOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import TcoForm from "./TcoForm";
import TcoResults from "./TcoResults";
import DataExplanation from "./DataExplanation";
import type { TcoData, BikeData, BrandData, ComparisonData } from "../types";

const { Title, Text } = Typography;

const TcoCalculator: React.FC = () => {
  const [tcoData, setTcoData] = useState<TcoData | null>(null);
  const [bikeData, setBikeData] = useState<BikeData[]>([]);
  const [brandData, setBrandData] = useState<BrandData[]>([]);
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);

  useEffect(() => {
    // Load JSON data
    const loadData = async () => {
      try {
        const [bikesRes, brandsRes, comparisonRes] = await Promise.all([
          fetch("/motos_populaires_france_2024.json"),
          fetch("/couts_marques_moto_france_2024.json"),
          fetch("/comparaison_couts_moto.json"),
        ]);

        const bikes = await bikesRes.json();
        const brands = await brandsRes.json();
        const comparison = await comparisonRes.json();

        setBikeData(bikes);
        setBrandData(brands);
        setComparisonData(comparison);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  const handleTcoCalculation = (data: TcoData) => {
    setTcoData(data);
  };

  const InfoCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    items: Array<{ label: string; value: string }>;
  }> = ({ icon, title, items }) => (
    <Card
      style={{
        height: "100%",
        boxShadow:
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        border: "1px solid #f1f5f9",
      }}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Space align="center">
          {icon}
          <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
            {title}
          </Title>
        </Space>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          {items.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text>{item.label}</Text>
              <Text strong style={{ color: "#2196f3" }}>
                {item.value}
              </Text>
            </div>
          ))}
        </Space>
      </Space>
    </Card>
  );

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Info Cards Section */}
      <Space
        direction="vertical"
        size="large"
        style={{ width: "100%", marginBottom: 48 }}
      >
        <Title
          level={2}
          style={{
            textAlign: "center",
            color: "#1a1a1a",
            fontWeight: 600,
            marginBottom: 32,
          }}
        >
          Données du marché français 2024
        </Title>

        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={6}>
            <InfoCard
              icon={<EuroOutlined style={{ color: "#2196f3", fontSize: 24 }} />}
              title="Coûts d'Achat"
              items={[
                { label: "Occasion débutant", value: "1 500 - 2 500 €" },
                { label: "125cc neuf", value: "3 000 - 5 500 €" },
                { label: "Moyenne cylindrée", value: "6 500 - 10 000 €" },
                { label: "Grosse cylindrée", value: "15 000 - 30 000 €" },
              ]}
            />
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <InfoCard
              icon={<CarOutlined style={{ color: "#2196f3", fontSize: 24 }} />}
              title="Assurance 2024"
              items={[
                { label: "Au tiers", value: "455 € / an" },
                { label: "Intermédiaire", value: "648 € / an" },
                { label: "Tous risques", value: "907 € / an" },
                { label: "Jeune conducteur", value: "+600 € / an" },
              ]}
            />
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <InfoCard
              icon={<ToolOutlined style={{ color: "#2196f3", fontSize: 24 }} />}
              title="Entretien Annuel"
              items={[
                { label: "Révision générale", value: "250 - 400 €" },
                { label: "Pneus (paire)", value: "150 - 500 €" },
                { label: "Consommables", value: "100 - 200 €" },
                { label: "Réparations imprévues", value: "200 - 800 €" },
              ]}
            />
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <InfoCard
              icon={
                <DashboardOutlined style={{ color: "#2196f3", fontSize: 24 }} />
              }
              title="Carburant 2024"
              items={[
                { label: "Prix moyen SP95", value: "1.65 € / litre" },
                { label: "Conso 125cc", value: "2.5 - 3.5 L/100km" },
                { label: "Conso moyenne cyl.", value: "4.5 - 6 L/100km" },
                { label: "Conso grosse cyl.", value: "6 - 9+ L/100km" },
              ]}
            />
          </Col>
        </Row>
      </Space>

      {/* Calculator Section */}
      <Space
        direction="vertical"
        size="large"
        style={{ width: "100%", marginBottom: 48 }}
      >
        <Title
          level={2}
          style={{
            textAlign: "center",
            color: "#1a1a1a",
            fontWeight: 600,
            marginBottom: 32,
          }}
        >
          Calculateur TCO
        </Title>

        <Row gutter={[32, 32]}>
          <Col xs={24} lg={12}>
            <TcoForm onCalculate={handleTcoCalculation} />
          </Col>
          <Col xs={24} lg={12}>
            <TcoResults data={tcoData} comparisonData={comparisonData} />
          </Col>
        </Row>
      </Space>

      {/* Data Explanation */}
      <DataExplanation bikeData={bikeData} brandData={brandData} />

      {/* Disclaimer */}
      <Card
        style={{
          marginTop: "4rem",
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          border: "1px solid #dee2e6",
        }}
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Title
            level={4}
            style={{
              margin: 0,
              fontWeight: 600,
              color: "#6c757d",
              textAlign: "center",
            }}
          >
            ⚠️ Avertissement
          </Title>
          <Text
            style={{
              textAlign: "center",
              color: "#6c757d",
              lineHeight: 1.6,
              fontSize: "0.95rem",
            }}
          >
            <strong>Projet Open Source :</strong> Ce calculateur TCO est un
            projet open source développé pendant mon temps libre. Les données
            proviennent de diverses sources publiques que j'ai croisées et
            consolidées. Les résultats peuvent être imprécis et ne doivent être
            utilisés qu'à titre indicatif. Pour des décisions d'achat
            importantes, consultez toujours des professionnels et vérifiez les
            données auprès de sources officielles.
          </Text>
          <div style={{ textAlign: "center" }}>
            <Text style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
              Données compilées en 2024 • Sources multiples • Calculs
              approximatifs
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default TcoCalculator;
