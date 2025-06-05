import React, { useState } from "react";
import { Card, Typography, Input, Button, Space, Tag, Row, Col } from "antd";
import { CalculatorOutlined, CarOutlined } from "@ant-design/icons";
import type { TcoData, TcoFormData } from "../types";

const { Title, Text } = Typography;

interface TcoFormProps {
  onCalculate: (data: TcoData) => void;
}

const defaultValues: Record<string, TcoFormData> = {
  small: {
    category: "small",
    purchasePrice: 4250,
    annualKm: 10000,
    insuranceCost: 450,
    maintenanceCost: 225,
    fuelConsumption: 2.5,
    fuelPrice: 1.9,
    tireCost: 150,
    tireLifespan: 15000,
    parkingCost: 50,
  },
  medium: {
    category: "medium",
    purchasePrice: 8250,
    annualKm: 10000,
    insuranceCost: 670,
    maintenanceCost: 375,
    fuelConsumption: 5.0,
    fuelPrice: 1.9,
    tireCost: 250,
    tireLifespan: 12000,
    parkingCost: 50,
  },
  large: {
    category: "large",
    purchasePrice: 15000,
    annualKm: 10000,
    insuranceCost: 850,
    maintenanceCost: 575,
    fuelConsumption: 6.5,
    fuelPrice: 1.9,
    tireCost: 400,
    tireLifespan: 10000,
    parkingCost: 50,
  },
};

const TcoForm: React.FC<TcoFormProps> = ({ onCalculate }) => {
  const [formData, setFormData] = useState<TcoFormData>(defaultValues.medium);

  const handleChange =
    (field: keyof TcoFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: field === "category" ? value : parseFloat(value) || 0,
      }));
    };

  const handleCategoryChange = (category: "small" | "medium" | "large") => {
    setFormData(defaultValues[category]);
  };

  const calculateTco = () => {
    const {
      purchasePrice,
      annualKm,
      insuranceCost,
      maintenanceCost,
      fuelConsumption,
      fuelPrice,
      tireCost,
      tireLifespan,
      parkingCost,
    } = formData;

    // Calculations
    const depreciation = purchasePrice * 0.15; // 15% per year
    const fuelAnnualCost = (fuelConsumption * fuelPrice * annualKm) / 100;
    const tireAnnualCost = (tireCost * annualKm) / tireLifespan;
    const technicalCost = 70 / 2; // Technical inspection every 2 years
    const parkingAnnualCost = parkingCost * 12;

    const totalCost =
      depreciation +
      insuranceCost +
      maintenanceCost +
      fuelAnnualCost +
      tireAnnualCost +
      technicalCost +
      parkingAnnualCost;

    const tcoData: TcoData = {
      ...formData,
      totalCost,
      breakdown: {
        depreciation,
        insurance: insuranceCost,
        maintenance: maintenanceCost,
        fuel: fuelAnnualCost,
        tires: tireAnnualCost,
        technical: technicalCost,
        parking: parkingAnnualCost,
      },
    };

    onCalculate(tcoData);
  };

  return (
    <Card
      style={{
        height: "fit-content",
        boxShadow:
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        border: "1px solid #f1f5f9",
      }}
    >
      <Space
        direction="vertical"
        size="large"
        style={{ width: "100%", padding: 32 }}
      >
        <Space align="center">
          <CarOutlined style={{ color: "#2196f3", fontSize: 28 }} />
          <Title level={3} style={{ margin: 0, fontWeight: 600 }}>
            Paramètres de votre moto
          </Title>
        </Space>

        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Category Selection */}
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Text style={{ fontWeight: 500, color: "#666666" }}>
              Catégorie de moto
            </Text>
            <Space wrap>
              <Tag.CheckableTag
                checked={formData.category === "small"}
                onChange={() => handleCategoryChange("small")}
                style={{
                  padding: "6px 12px",
                  fontSize: "14px",
                  cursor: "pointer",
                  borderRadius: 6,
                }}
              >
                Petite cylindrée (≤125cc)
              </Tag.CheckableTag>
              <Tag.CheckableTag
                checked={formData.category === "medium"}
                onChange={() => handleCategoryChange("medium")}
                style={{
                  padding: "6px 12px",
                  fontSize: "14px",
                  cursor: "pointer",
                  borderRadius: 6,
                }}
              >
                Moyenne cylindrée (126-599cc)
              </Tag.CheckableTag>
              <Tag.CheckableTag
                checked={formData.category === "large"}
                onChange={() => handleCategoryChange("large")}
                style={{
                  padding: "6px 12px",
                  fontSize: "14px",
                  cursor: "pointer",
                  borderRadius: 6,
                }}
              >
                Grosse cylindrée (≥600cc)
              </Tag.CheckableTag>
            </Space>
          </Space>

          {/* Form Fields */}
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12}>
              <Space
                direction="vertical"
                size="small"
                style={{ width: "100%" }}
              >
                <Text>Prix d'achat</Text>
                <Input
                  size="large"
                  type="number"
                  value={formData.purchasePrice}
                  onChange={handleChange("purchasePrice")}
                  suffix="€"
                  style={{ borderRadius: 8 }}
                />
              </Space>
            </Col>

            <Col xs={24} sm={12}>
              <Space
                direction="vertical"
                size="small"
                style={{ width: "100%" }}
              >
                <Text>Kilométrage annuel</Text>
                <Input
                  size="large"
                  type="number"
                  value={formData.annualKm}
                  onChange={handleChange("annualKm")}
                  suffix="km"
                  style={{ borderRadius: 8 }}
                />
              </Space>
            </Col>

            <Col xs={24} sm={12}>
              <Space
                direction="vertical"
                size="small"
                style={{ width: "100%" }}
              >
                <Text>Coût assurance annuel</Text>
                <Input
                  size="large"
                  type="number"
                  value={formData.insuranceCost}
                  onChange={handleChange("insuranceCost")}
                  suffix="€"
                  style={{ borderRadius: 8 }}
                />
              </Space>
            </Col>

            <Col xs={24} sm={12}>
              <Space
                direction="vertical"
                size="small"
                style={{ width: "100%" }}
              >
                <Text>Coût entretien annuel</Text>
                <Input
                  size="large"
                  type="number"
                  value={formData.maintenanceCost}
                  onChange={handleChange("maintenanceCost")}
                  suffix="€"
                  style={{ borderRadius: 8 }}
                />
              </Space>
            </Col>

            <Col xs={24} sm={12}>
              <Space
                direction="vertical"
                size="small"
                style={{ width: "100%" }}
              >
                <Text>Consommation</Text>
                <Input
                  size="large"
                  type="number"
                  step={0.1}
                  value={formData.fuelConsumption}
                  onChange={handleChange("fuelConsumption")}
                  suffix="L/100km"
                  style={{ borderRadius: 8 }}
                />
              </Space>
            </Col>

            <Col xs={24} sm={12}>
              <Space
                direction="vertical"
                size="small"
                style={{ width: "100%" }}
              >
                <Text>Prix du carburant</Text>
                <Input
                  size="large"
                  type="number"
                  step={0.01}
                  value={formData.fuelPrice}
                  onChange={handleChange("fuelPrice")}
                  suffix="€/L"
                  style={{ borderRadius: 8 }}
                />
              </Space>
            </Col>

            <Col xs={24} sm={12}>
              <Space
                direction="vertical"
                size="small"
                style={{ width: "100%" }}
              >
                <Text>Coût pneus par changement</Text>
                <Input
                  size="large"
                  type="number"
                  value={formData.tireCost}
                  onChange={handleChange("tireCost")}
                  suffix="€"
                  style={{ borderRadius: 8 }}
                />
              </Space>
            </Col>

            <Col xs={24} sm={12}>
              <Space
                direction="vertical"
                size="small"
                style={{ width: "100%" }}
              >
                <Text>Durée de vie pneus</Text>
                <Input
                  size="large"
                  type="number"
                  value={formData.tireLifespan}
                  onChange={handleChange("tireLifespan")}
                  suffix="km"
                  style={{ borderRadius: 8 }}
                />
              </Space>
            </Col>
          </Row>

          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Text>Coût stationnement mensuel</Text>
            <Input
              size="large"
              type="number"
              value={formData.parkingCost}
              onChange={handleChange("parkingCost")}
              suffix="€"
              style={{ borderRadius: 8 }}
            />
          </Space>

          <Button
            type="primary"
            size="large"
            icon={<CalculatorOutlined />}
            onClick={calculateTco}
            style={{
              marginTop: 16,
              borderRadius: 8,
              background: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)",
              border: "none",
              fontWeight: 600,
              fontSize: "1.1rem",
              height: "auto",
              padding: "12px 24px",
            }}
            block
          >
            Calculer le TCO
          </Button>
        </Space>
      </Space>
    </Card>
  );
};

export default TcoForm;
