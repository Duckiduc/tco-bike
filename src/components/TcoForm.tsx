import React from "react";
import {
  Card,
  Typography,
  Input,
  Button,
  Space,
  Tag,
  Row,
  Col,
  Checkbox,
  Select,
  Slider,
  Collapse,
} from "antd";
import { CarOutlined } from "@ant-design/icons";
import type {
  BikeData,
  Category,
  Energy,
  LiveFuelPrice,
  TcoFormData,
} from "../types";
import {
  MAX_YEARS,
  categoryDefaults,
  cityParkingCost,
  presetFromBike,
} from "../lib/tco";
import { REGIONS, YOUNG_RIDER_SURCHARGE } from "../lib/reference";

const { Title, Text } = Typography;

interface TcoFormProps {
  value: TcoFormData;
  onChange: (data: TcoFormData) => void;
  bikeData: BikeData[];
  liveFuelPrice: LiveFuelPrice | null;
}

const tagStyle: React.CSSProperties = {
  padding: "8px 12px",
  fontSize: "14px",
  cursor: "pointer",
  borderRadius: 6,
  minWidth: "fit-content",
  textAlign: "center",
  display: "inline-block",
};

const categoryLabels: Record<Category, string> = {
  small: "Petite (≤125cc)",
  medium: "Moyenne (126-599cc)",
  large: "Grosse (≥600cc)",
};

const energyLabels: Record<Energy, string> = {
  petrol: "Essence",
  electric: "Électrique",
};

const NumberField: React.FC<{
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix: string;
  step?: number;
  hint?: React.ReactNode;
}> = ({ label, value, onChange, suffix, step, hint }) => (
  <Space direction="vertical" size="small" style={{ width: "100%" }}>
    <Text>{label}</Text>
    <Input
      size="large"
      type="number"
      min={0}
      step={step}
      value={value}
      onChange={(event) => onChange(parseFloat(event.target.value) || 0)}
      suffix={suffix}
      style={{ borderRadius: 8 }}
    />
    {hint}
  </Space>
);

const TcoForm: React.FC<TcoFormProps> = ({
  value: formData,
  onChange,
  bikeData,
  liveFuelPrice,
}) => {
  const update = (patch: Partial<TcoFormData>) => {
    const next = { ...formData, ...patch };
    // A city profile drives the parking cost until the user edits it
    if ("city" in patch || "energy" in patch) {
      const parking = cityParkingCost(next);
      if (parking !== null) next.parkingCost = parking;
    }
    onChange(next);
  };

  const field = (key: keyof TcoFormData) => (fieldValue: number) =>
    update({ [key]: fieldValue });

  const handleModelChange = (model?: string) => {
    const bike = bikeData.find((item) => item.Modèle === model);
    update(bike ? presetFromBike(bike) : { model: "" });
  };

  const electric = formData.energy === "electric";

  const bikeSection = (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {/* Model Selection */}
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <Text style={{ fontWeight: 500, color: "#666666" }}>
          Préremplir avec un modèle populaire
        </Text>
        <Select
          size="large"
          showSearch
          allowClear
          placeholder="Choisir un modèle (optionnel)"
          value={formData.model || undefined}
          onChange={handleModelChange}
          options={bikeData.map((bike) => ({
            value: bike.Modèle,
            label: bike.Modèle,
          }))}
          style={{ width: "100%" }}
        />
      </Space>

      {/* Category Selection */}
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <Text style={{ fontWeight: 500, color: "#666666" }}>
          Catégorie de moto
        </Text>
        <Space wrap style={{ width: "100%" }}>
          {(Object.keys(categoryLabels) as Category[]).map((category) => (
            <Tag.CheckableTag
              key={category}
              checked={formData.category === category}
              onChange={() =>
                update({
                  ...categoryDefaults[category],
                  category,
                  model: "",
                })
              }
              style={tagStyle}
            >
              {categoryLabels[category]}
            </Tag.CheckableTag>
          ))}
        </Space>
      </Space>

      {/* Energy Selection */}
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <Text style={{ fontWeight: 500, color: "#666666" }}>Énergie</Text>
        <Space wrap style={{ width: "100%" }}>
          {(Object.keys(energyLabels) as Energy[]).map((energy) => (
            <Tag.CheckableTag
              key={energy}
              checked={formData.energy === energy}
              onChange={() => update({ energy })}
              style={tagStyle}
            >
              {energyLabels[energy]}
            </Tag.CheckableTag>
          ))}
        </Space>
      </Space>

      {/* Form Fields */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <NumberField
            label="Prix d'achat"
            value={formData.purchasePrice}
            onChange={field("purchasePrice")}
            suffix="€"
          />
        </Col>

        <Col xs={24} sm={12}>
          <NumberField
            label="Âge à l'achat (0 = neuve)"
            value={formData.bikeAge}
            onChange={field("bikeAge")}
            suffix="ans"
          />
        </Col>

        <Col xs={24}>
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Text>
              Durée de détention :{" "}
              <strong>
                {formData.years} an{formData.years > 1 ? "s" : ""}
              </strong>
            </Text>
            <Slider
              min={1}
              max={MAX_YEARS}
              value={formData.years}
              onChange={field("years")}
            />
          </Space>
        </Col>

        <Col xs={24} sm={12}>
          <NumberField
            label="Kilométrage annuel"
            value={formData.annualKm}
            onChange={field("annualKm")}
            suffix="km"
          />
        </Col>
      </Row>
    </Space>
  );

  const usageSection = (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <NumberField
            label="Coût assurance annuel"
            value={formData.insuranceCost}
            onChange={field("insuranceCost")}
            suffix="€"
          />
        </Col>

        <Col xs={24} sm={12}>
          <NumberField
            label="Coût entretien annuel"
            value={formData.maintenanceCost}
            onChange={field("maintenanceCost")}
            suffix="€"
          />
        </Col>

        {electric ? (
          <>
            <Col xs={24} sm={12}>
              <NumberField
                label="Consommation"
                value={formData.elecConsumption}
                onChange={field("elecConsumption")}
                suffix="kWh/100km"
                step={0.1}
              />
            </Col>
            <Col xs={24} sm={12}>
              <NumberField
                label="Prix de l'électricité"
                value={formData.elecPrice}
                onChange={field("elecPrice")}
                suffix="€/kWh"
                step={0.01}
              />
            </Col>
          </>
        ) : (
          <>
            <Col xs={24} sm={12}>
              <NumberField
                label="Consommation"
                value={formData.fuelConsumption}
                onChange={field("fuelConsumption")}
                suffix="L/100km"
                step={0.1}
              />
            </Col>
            <Col xs={24} sm={12}>
              <NumberField
                label="Prix du carburant"
                value={formData.fuelPrice}
                onChange={field("fuelPrice")}
                suffix="€/L"
                step={0.01}
                hint={
                  liveFuelPrice &&
                  liveFuelPrice.price !== formData.fuelPrice && (
                    <Button
                      type="link"
                      size="small"
                      style={{ padding: 0, height: "auto" }}
                      onClick={() => update({ fuelPrice: liveFuelPrice.price })}
                    >
                      SP95-E10 au {liveFuelPrice.date} :{" "}
                      {liveFuelPrice.price.toLocaleString("fr-FR")} €/L,
                      appliquer
                    </Button>
                  )
                }
              />
            </Col>
          </>
        )}

        <Col xs={24} sm={12}>
          <NumberField
            label="Coût pneus par changement"
            value={formData.tireCost}
            onChange={field("tireCost")}
            suffix="€"
          />
        </Col>

        <Col xs={24} sm={12}>
          <NumberField
            label="Durée de vie pneus"
            value={formData.tireLifespan}
            onChange={field("tireLifespan")}
            suffix="km"
          />
        </Col>
      </Row>

      <Space direction="vertical" size="small">
        <Checkbox
          checked={formData.includeDepreciation}
          onChange={(e) => update({ includeDepreciation: e.target.checked })}
          style={{ fontSize: "14px", fontWeight: 500, color: "#666666" }}
        >
          Inclure la dépréciation (dégressive selon l'âge)
        </Checkbox>
        <Checkbox
          checked={formData.youngRider}
          onChange={(e) => update({ youngRider: e.target.checked })}
          style={{ fontSize: "14px", fontWeight: 500, color: "#666666" }}
        >
          Jeune conducteur (+{YOUNG_RIDER_SURCHARGE} € d'assurance par an)
        </Checkbox>
      </Space>
    </Space>
  );

  const parkingSection = (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Text>Profil ville</Text>
            <Select
              size="large"
              value={formData.city}
              onChange={(city) =>
                update(city === "paris" ? { city, region: "IDF" } : { city })
              }
              options={[
                { value: "none", label: "Aucun" },
                { value: "paris", label: "Paris (résident, voirie)" },
              ]}
              style={{ width: "100%" }}
            />
          </Space>
        </Col>
        <Col xs={24} sm={12}>
          <NumberField
            label="Coût stationnement mensuel"
            value={formData.parkingCost}
            onChange={field("parkingCost")}
            suffix="€"
          />
        </Col>
      </Row>
    </Space>
  );

  const registrationSection = (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Text>Région</Text>
            <Select
              size="large"
              showSearch
              optionFilterProp="label"
              value={formData.region}
              onChange={(region) => update({ region })}
              options={REGIONS.map((region) => ({
                value: region.code,
                label: region.name,
              }))}
              style={{ width: "100%" }}
            />
          </Space>
        </Col>
        <Col xs={24} sm={12}>
          <NumberField
            label="Puissance fiscale (case P.6)"
            value={formData.fiscalHp}
            onChange={field("fiscalHp")}
            suffix="CV"
          />
        </Col>
      </Row>

      <Checkbox
        checked={formData.firstBike}
        onChange={(e) => update({ firstBike: e.target.checked })}
        style={{ fontSize: "14px", fontWeight: 500, color: "#666666" }}
      >
        Premier deux-roues (permis et équipement à prévoir)
      </Checkbox>

      {formData.firstBike && (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <NumberField
              label="Équipement (casque, gants, blouson…)"
              value={formData.gearCost}
              onChange={field("gearCost")}
              suffix="€"
            />
          </Col>
          <Col xs={24} sm={12}>
            <NumberField
              label="Permis ou formation"
              value={formData.licenceCost}
              onChange={field("licenceCost")}
              suffix="€"
            />
          </Col>
          <Col xs={24}>
            <Text type="secondary" style={{ fontSize: "0.85rem" }}>
              Montants indicatifs, à remplacer par vos devis.
            </Text>
          </Col>
        </Row>
      )}
    </Space>
  );

  const alternativesSection = (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <NumberField
        label="Abonnement transports en commun (mensuel)"
        value={formData.transitPass}
        onChange={field("transitPass")}
        suffix="€"
        step={0.1}
      />
    </Space>
  );

  return (
    <Card
      className="tco-card reveal"
      style={
        { "--delay": "80ms", height: "fit-content" } as React.CSSProperties
      }
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Space align="center" style={{ flexWrap: "wrap" }}>
          <CarOutlined style={{ color: "#2196f3", fontSize: 28 }} />
          <Title
            level={3}
            style={{
              margin: 0,
              fontWeight: 600,
              fontSize: window.innerWidth < 480 ? "1.2rem" : "1.5rem",
            }}
          >
            Paramètres de votre moto
          </Title>
        </Space>

        <Collapse
          ghost
          className="tco-form-sections"
          defaultActiveKey={["bike", "usage"]}
          items={[
            { key: "bike", label: "Votre moto", children: bikeSection },
            { key: "usage", label: "Coûts d'usage", children: usageSection },
            {
              key: "parking",
              label: "Stationnement et ville",
              children: parkingSection,
            },
            {
              key: "registration",
              label: "Carte grise et première année",
              children: registrationSection,
            },
            {
              key: "alternatives",
              label: "Alternatives",
              children: alternativesSection,
            },
          ]}
        />
      </Space>
    </Card>
  );
};

export default TcoForm;
