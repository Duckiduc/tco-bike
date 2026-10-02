import React, { useState } from "react";
import { Typography, Card, Tag, Alert, Space, Select, Table, Tabs } from "antd";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  PieChartOutlined,
  LineChartOutlined,
  SwapOutlined,
  BarChartOutlined,
  RiseOutlined,
  FallOutlined,
} from "@ant-design/icons";
import type { TcoBreakdown, TcoData, BikeData, ComparisonData } from "../types";
import { computeTco, formatEuro, presetFromBike } from "../lib/tco";
import {
  CO2_PER_KM,
  carBareme,
  critAirClass,
  motoBareme,
} from "../lib/reference";

const { Title, Text } = Typography;

interface TcoResultsProps {
  data: TcoData;
  comparisonData: ComparisonData[];
  bikeData: BikeData[];
}

const sectionTitleStyle = { marginBottom: "1rem", fontWeight: 600 };

// One fixed colour per cost item, in a colour-blind-safe order
const costColors: Record<keyof TcoBreakdown, string> = {
  depreciation: "#2a78d6",
  insurance: "#eb6834",
  maintenance: "#1baf7a",
  fuel: "#eda100",
  tires: "#e87ba4",
  technical: "#008300",
  parking: "#4a3aa7",
  acquisition: "#e34948",
};

const chartColors = {
  primary: "#2a78d6",
  secondary: "#eb6834",
  context: "#b5b3ab",
  grid: "#e1e0d9",
  axis: "#898781",
};

const axisProps = {
  tick: { fill: chartColors.axis, fontSize: 12 },
  axisLine: { stroke: chartColors.grid },
  tickLine: false,
};

const euroTick = (value: number) =>
  value >= 1000 ? `${(value / 1000).toLocaleString("fr-FR")} k€` : `${value} €`;

const plural = (years: number) => `${years} an${years > 1 ? "s" : ""}`;

const TcoResults: React.FC<TcoResultsProps> = ({
  data,
  comparisonData,
  bikeData,
}) => {
  const [compareModel, setCompareModel] = useState<string>();

  const {
    totalCost,
    breakdown,
    category,
    includeDepreciation,
    years,
    annualKm,
    firstYear,
  } = data;
  const electric = data.energy === "electric";

  const costLabels: Record<keyof TcoBreakdown, string> = {
    depreciation: "Dépréciation",
    insurance: "Assurance",
    maintenance: "Entretien",
    fuel: electric ? "Électricité" : "Carburant",
    tires: "Pneus",
    technical: "Contrôle technique",
    parking: "Stationnement",
    acquisition: "Frais d'acquisition",
  };

  const breakdownRows = (Object.keys(breakdown) as Array<keyof TcoBreakdown>)
    .filter((key) => key !== "depreciation" || includeDepreciation)
    .map((key) => ({
      key,
      label: costLabels[key],
      color: costColors[key],
      value: breakdown[key],
      share: totalCost > 0 ? breakdown[key] / totalCost : 0,
    }));
  const largestShare = Math.max(...breakdownRows.map((row) => row.share), 0);

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
    (item) => item.Catégorie === getCategoryLabel(category),
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
          category: costLabels.fuel,
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

  const isAboveAverage =
    comparisonAverage && totalCost > comparisonAverage.Total;
  const difference = comparisonAverage
    ? Math.abs(totalCost - comparisonAverage.Total)
    : 0;

  // Official mileage scale: covers everything except parking and tolls
  const baremeAmount = motoBareme(data.fiscalHp, annualKm, electric);
  const baremeComparable = totalCost - breakdown.parking;
  const baremeCovers = baremeAmount >= baremeComparable;

  const motoCo2 = electric
    ? CO2_PER_KM.motoElectric
    : category === "small"
      ? CO2_PER_KM.motoSmall
      : CO2_PER_KM.motoLarge;
  const alternatives = [
    {
      key: "moto",
      mode: data.model || "Votre moto",
      cost: totalCost,
      co2: motoCo2,
    },
    {
      key: "car",
      mode: "Voiture (barème fiscal 5 CV)",
      cost: carBareme(annualKm),
      co2: CO2_PER_KM.car,
    },
    {
      key: "transit",
      mode: "Transports en commun",
      cost: data.transitPass * 12,
      co2: CO2_PER_KM.metro,
    },
  ].map((row) => ({ ...row, co2: (row.co2 * annualKm) / 1000 }));
  const highestAlternativeCost = Math.max(
    ...alternatives.map((row) => row.cost),
  );

  const alternativeColumns = [
    { title: "Mode", dataIndex: "mode", key: "mode" },
    {
      title: "Coût annuel",
      dataIndex: "cost",
      key: "cost",
      render: (cost: number, row: { key: string }) => (
        <div>
          <Text strong>{formatEuro(cost)}</Text>
          <div className="tco-bar-track">
            <div
              className="tco-bar-fill"
              style={{
                width: `${(cost / highestAlternativeCost) * 100}%`,
                background:
                  row.key === "moto"
                    ? chartColors.primary
                    : chartColors.context,
              }}
            />
          </div>
        </div>
      ),
    },
    {
      title: "CO2e par an",
      dataIndex: "co2",
      key: "co2",
      render: (co2: number) => `${Math.round(co2).toLocaleString("fr-FR")} kg`,
    },
  ];

  const critAir = critAirClass(
    new Date().getFullYear() - data.bikeAge,
    electric,
  );
  const critAirRestricted = ["3", "4", "Non classé"].includes(critAir);

  const otherBike = bikeData.find((bike) => bike.Modèle === compareModel);
  const otherTco = otherBike
    ? computeTco({ ...data, ...presetFromBike(otherBike) })
    : null;

  const breakdownTab = (
    <div>
      <Title level={4} style={sectionTitleStyle}>
        Où part votre budget, en moyenne par an
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

      <div className="tco-stack">
        {breakdownRows
          .filter((row) => row.value > 0)
          .map((row) => (
            <div
              key={row.key}
              className="tco-stack-segment"
              title={`${row.label} : ${formatEuro(row.value)}`}
              style={{ flexGrow: row.value, background: row.color }}
            />
          ))}
      </div>

      <div className="tco-rows">
        {breakdownRows.map((row) => (
          <div key={row.key} className="tco-row">
            <span
              className="tco-row-swatch"
              style={{ background: row.color }}
            />
            <span className="tco-row-label">{row.label}</span>
            <span className="tco-bar-track tco-row-bar">
              <span
                className="tco-bar-fill"
                style={{
                  width: `${largestShare > 0 ? (row.share / largestShare) * 100 : 0}%`,
                  background: row.color,
                }}
              />
            </span>
            <span className="tco-row-value">{formatEuro(row.value)}</span>
            <span className="tco-row-share">
              {Math.round(row.share * 100)} %
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const projectionTab = (
    <div>
      <Title level={4} style={sectionTitleStyle}>
        Coût cumulé et valeur de revente sur {plural(years)}
      </Title>
      <div className="tco-chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.timeline}>
            <CartesianGrid stroke={chartColors.grid} vertical={false} />
            <XAxis
              dataKey="year"
              tickFormatter={(year) => `An ${year}`}
              {...axisProps}
            />
            <YAxis tickFormatter={euroTick} width={56} {...axisProps} />
            <Tooltip
              formatter={(value) => formatEuro(Number(value))}
              labelFormatter={(year) => `Année ${year}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="cumulative"
              stroke={chartColors.primary}
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Coût cumulé"
            />
            <Line
              type="monotone"
              dataKey="resale"
              stroke={chartColors.secondary}
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Valeur de revente"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Text type="secondary">
        Valeur de revente estimée après {plural(years)} :{" "}
        <strong>{formatEuro(data.resaleValue)}</strong>
      </Text>

      <Title level={4} style={{ ...sectionTitleStyle, marginTop: "2rem" }}>
        Frais d'acquisition (première année)
      </Title>
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        {[
          { label: "Carte grise", value: firstYear.registration },
          { label: "Équipement", value: firstYear.gear },
          { label: "Permis ou formation", value: firstYear.licence },
          { label: "Vignette Crit'Air", value: firstYear.critAir },
        ]
          .filter((item) => item.value > 0)
          .map((item) => (
            <div key={item.label} className="tco-breakdown-item">
              <Text style={{ fontWeight: 500 }}>{item.label}</Text>
              <Text strong>{formatEuro(item.value)}</Text>
            </div>
          ))}
        <div className="tco-breakdown-item tco-breakdown-total">
          <Text strong>Total, en plus du prix d'achat</Text>
          <Text strong>{formatEuro(firstYear.total)}</Text>
        </div>
        <div className="tco-breakdown-item">
          <Text style={{ fontWeight: 500 }}>Classe Crit'Air estimée</Text>
          <Tag color={critAirRestricted ? "red" : "green"}>{critAir}</Tag>
        </div>
      </Space>
      {critAirRestricted && data.city === "paris" && (
        <Alert
          type="warning"
          showIcon
          style={{ marginTop: "1rem" }}
          message="Cette moto est concernée par les restrictions de circulation de la zone à faibles émissions du Grand Paris. Vérifiez les règles en vigueur avant d'acheter."
        />
      )}
    </div>
  );

  const alternativesTab = (
    <div>
      <Title level={4} style={sectionTitleStyle}>
        Moto, voiture ou transports en commun
      </Title>
      <Table
        columns={alternativeColumns}
        dataSource={alternatives}
        pagination={false}
        size="small"
      />
      <Text
        type="secondary"
        style={{ fontSize: "0.85rem", display: "block", marginTop: "0.5rem" }}
      >
        Pour {annualKm.toLocaleString("fr-FR")} km par an. Émissions ADEME,
        fabrication comprise (métro pour les transports en commun).
      </Text>

      <Title level={4} style={{ ...sectionTitleStyle, marginTop: "2rem" }}>
        Frais réels
      </Title>
      <Alert
        type={baremeCovers ? "success" : "info"}
        message={
          <div>
            <Text style={{ fontWeight: 500 }}>
              Le barème kilométrique{" "}
              {electric ? "(majoré de 20 % en électrique) " : ""}vous accorde{" "}
              <strong>{formatEuro(baremeAmount)}</strong> pour{" "}
              {annualKm.toLocaleString("fr-FR")} km, contre{" "}
              <strong>{formatEuro(baremeComparable)}</strong> de coûts hors
              stationnement
            </Text>
            <div style={{ marginTop: "0.5rem" }}>
              <Text>
                {baremeCovers ? (
                  <>
                    Le barème couvre vos coûts, avec{" "}
                    <strong>
                      {formatEuro(baremeAmount - baremeComparable)} de marge
                    </strong>
                  </>
                ) : (
                  <>
                    Le barème laisse{" "}
                    <strong>
                      {formatEuro(baremeComparable - baremeAmount)}
                    </strong>{" "}
                    à votre charge
                  </>
                )}
                . Il s'applique aux seuls kilomètres professionnels.
              </Text>
            </div>
          </div>
        }
      />
    </div>
  );

  const comparisonTab = (
    <div>
      <Title level={4} style={sectionTitleStyle}>
        Comparer avec un autre modèle
      </Title>
      <Select
        size="large"
        showSearch
        allowClear
        placeholder="Choisir un modèle"
        value={compareModel}
        onChange={setCompareModel}
        options={bikeData.map((bike) => ({
          value: bike.Modèle,
          label: bike.Modèle,
        }))}
        style={{ width: "100%", marginBottom: "1rem" }}
      />
      {otherTco && (
        <Space
          direction="vertical"
          size="small"
          style={{ width: "100%" }}
          className="fade-in"
        >
          {[
            { label: data.model || "Votre moto", tco: data },
            { label: otherTco.model, tco: otherTco },
          ].map((item) => (
            <div key={item.label} className="tco-breakdown-item">
              <Text style={{ fontWeight: 500 }}>{item.label}</Text>
              <Text strong>{formatEuro(item.tco.totalCost)} par an</Text>
            </div>
          ))}
          <Text type="secondary">
            {otherTco.model} neuve, avec le même kilométrage, la même durée et
            le même stationnement :{" "}
            <strong>
              {formatEuro(Math.abs(otherTco.totalCost - totalCost))} par an de{" "}
              {otherTco.totalCost > totalCost ? "plus" : "moins"}
            </strong>
            .
          </Text>
        </Space>
      )}

      {comparisonAverage && (
        <>
          <Title level={4} style={{ ...sectionTitleStyle, marginTop: "2rem" }}>
            Comparaison avec la moyenne française
          </Title>
          <div className="tco-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonChartData} barGap={2}>
                <CartesianGrid stroke={chartColors.grid} vertical={false} />
                <XAxis dataKey="category" {...axisProps} />
                <YAxis tickFormatter={euroTick} width={56} {...axisProps} />
                <Tooltip
                  cursor={{ fill: "rgba(0, 0, 0, 0.04)" }}
                  formatter={(value) => formatEuro(Number(value))}
                />
                <Legend />
                <Bar
                  dataKey="yours"
                  fill={chartColors.primary}
                  radius={[4, 4, 0, 0]}
                  name="Vos coûts"
                />
                <Bar
                  dataKey="average"
                  fill={chartColors.context}
                  radius={[4, 4, 0, 0]}
                  name="Moyenne française"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <Alert
            type={isAboveAverage ? "warning" : "success"}
            icon={isAboveAverage ? <RiseOutlined /> : <FallOutlined />}
            showIcon
            style={{ marginTop: "1rem" }}
            message={
              <Text>
                Vos coûts ({formatEuro(totalCost)}) contre une moyenne française
                de {formatEuro(comparisonAverage.Total)} :{" "}
                <strong>
                  {formatEuro(difference)} de{" "}
                  {isAboveAverage ? "plus" : "moins"}
                </strong>{" "}
                par an
              </Text>
            }
          />
        </>
      )}
    </div>
  );

  return (
    <Card
      className="tco-card reveal"
      style={{ "--delay": "160ms" } as React.CSSProperties}
    >
      <div className="tco-results-container">
        <Tabs
          className="tco-tabs"
          size="large"
          items={[
            {
              key: "breakdown",
              label: "Répartition",
              icon: <PieChartOutlined />,
              children: breakdownTab,
            },
            {
              key: "projection",
              label: "Projection",
              icon: <LineChartOutlined />,
              children: projectionTab,
            },
            {
              key: "alternatives",
              label: "Alternatives",
              icon: <SwapOutlined />,
              children: alternativesTab,
            },
            {
              key: "comparison",
              label: "Comparaison",
              icon: <BarChartOutlined />,
              children: comparisonTab,
            },
          ]}
        />
      </div>
    </Card>
  );
};

export default TcoResults;
