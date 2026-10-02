import React from "react";
import { Button } from "antd";
import { ShareAltOutlined } from "@ant-design/icons";
import type { TcoData } from "../types";
import { formatEuro } from "../lib/tco";
import { useAnimatedNumber } from "../lib/useAnimatedNumber";

interface TcoSummaryProps {
  data: TcoData;
  onShare: () => void;
}

const TcoSummary: React.FC<TcoSummaryProps> = ({ data, onShare }) => {
  const total = useAnimatedNumber(data.totalCost);
  const perMonth = useAnimatedNumber(data.totalCost / 12);
  const perKm = useAnimatedNumber(data.costPerKm);
  const overPeriod = useAnimatedNumber(data.totalOverPeriod);

  const stats = [
    { label: "par mois", value: formatEuro(perMonth) },
    {
      label: "par km",
      value: `${perKm.toLocaleString("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} €`,
    },
    {
      label: `sur ${data.years} an${data.years > 1 ? "s" : ""}`,
      value: formatEuro(overPeriod),
    },
  ];

  return (
    <div className="tco-summary reveal">
      <div className="tco-summary-main">
        <span className="tco-summary-label">
          Coût total de possession{data.model ? ` • ${data.model}` : ""}
        </span>
        <span className="tco-summary-value">
          {formatEuro(total)} <small>par an</small>
        </span>
      </div>
      <div className="tco-summary-stats">
        {stats.map((stat) => (
          <div key={stat.label} className="tco-summary-stat">
            <span className="tco-summary-stat-value">{stat.value}</span>
            <span className="tco-summary-stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
      <Button
        ghost
        icon={<ShareAltOutlined />}
        onClick={onShare}
        className="tco-summary-share"
      >
        Copier le lien
      </Button>
    </div>
  );
};

export default TcoSummary;
