import React, { useState, useEffect, useMemo } from "react";
import { Typography, Card, Row, Col, Space, message } from "antd";
import {
  EuroOutlined,
  ToolOutlined,
  CarOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import TcoForm from "./TcoForm";
import TcoResults from "./TcoResults";
import TcoSummary from "./TcoSummary";
import DataExplanation from "./DataExplanation";
import type {
  TcoFormData,
  BikeData,
  BrandData,
  ComparisonData,
  LiveFuelPrice,
} from "../types";
import { computeTco, fromQuery, toQuery } from "../lib/tco";

const FUEL_PRICE_API =
  "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/records";

const { Title, Text } = Typography;

const TcoCalculator: React.FC = () => {
  const [formData, setFormData] = useState<TcoFormData>(() =>
    fromQuery(window.location.search),
  );
  const [liveFuelPrice, setLiveFuelPrice] = useState<LiveFuelPrice | null>(
    null,
  );
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

  useEffect(() => {
    // National SP95-E10 average over the stations updated in the last 7 days
    const loadFuelPrice = async () => {
      try {
        const since = new Date(Date.now() - 7 * 24 * 3600 * 1000)
          .toISOString()
          .slice(0, 10);
        const params = new URLSearchParams({
          select: "avg(e10_prix) as price",
          where: `e10_maj >= "${since}"`,
          limit: "1",
        });
        const response = await fetch(`${FUEL_PRICE_API}?${params}`);
        const price = (await response.json()).results?.[0]?.price;
        if (typeof price === "number" && price > 0) {
          setLiveFuelPrice({
            price: Math.round(price * 100) / 100,
            date: new Date().toLocaleDateString("fr-FR"),
          });
        }
      } catch (error) {
        console.error("Error loading fuel price:", error);
      }
    };

    loadFuelPrice();
  }, []);

  const tcoData = useMemo(() => computeTco(formData), [formData]);

  // Keep the URL in sync so that it can be shared
  useEffect(() => {
    const query = toQuery(formData);
    window.history.replaceState(
      null,
      "",
      query ? `?${query}` : window.location.pathname,
    );
  }, [formData]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      message.success("Lien copié dans le presse-papiers");
    } catch {
      message.error("Impossible de copier le lien");
    }
  };

  const InfoCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    items: Array<{ label: string; value: string }>;
  }> = ({ icon, title, items }) => (
    <Card className="tco-card hover-lift" style={{ height: "100%" }}>
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
      {/* Calculator Section */}
      <Space
        direction="vertical"
        size="large"
        style={{ width: "100%", marginBottom: 48 }}
      >
        <TcoSummary data={tcoData} onShare={handleShare} />

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={10}>
            <TcoForm
              value={formData}
              onChange={setFormData}
              bikeData={bikeData}
              liveFuelPrice={liveFuelPrice}
            />
          </Col>
          <Col xs={24} lg={14}>
            <TcoResults
              data={tcoData}
              comparisonData={comparisonData}
              bikeData={bikeData}
            />
          </Col>
        </Row>
      </Space>

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
          Repères du marché français
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
              title="Assurance (devis 2024)"
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
              title="Carburant (oct. 2026)"
              items={[
                { label: "Prix moyen SP95-E10", value: "2.16 € / litre" },
                { label: "Conso 125cc", value: "2.5 - 3.5 L/100km" },
                { label: "Conso moyenne cyl.", value: "4.5 - 6 L/100km" },
                { label: "Conso grosse cyl.", value: "6 - 9+ L/100km" },
              ]}
            />
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
              Données compilées en 2024 • Sources officielles mises à jour en
              octobre 2026 • Calculs approximatifs
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default TcoCalculator;
