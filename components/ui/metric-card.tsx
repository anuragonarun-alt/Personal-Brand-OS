import React from "react";
import { Card } from "./card";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  sparklineData?: number[];
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  sparklineData = [10, 15, 8, 12, 19, 14, 25],
  className = "",
}) => {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change !== undefined && change === 0;

  // Generate SVG path for mock sparkline
  const width = 80;
  const height = 24;
  const min = Math.min(...sparklineData);
  const max = Math.max(...sparklineData);
  const range = max - min || 1;

  const points = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2; // pad 2px
      return `${x},${y}`;
    })
    .join(" ");

  const sparklineColor = isPositive
    ? "stroke-success"
    : isNegative
    ? "stroke-danger"
    : "stroke-accent";

  return (
    <Card className={`py-3 px-4 ${className}`}>
      <div className="flex flex-col gap-1.5 justify-between h-full">
        {/* Title */}
        <span className="text-[11px] font-medium text-muted uppercase tracking-wider">
          {title}
        </span>

        {/* Value and Sparkline */}
        <div className="flex items-end justify-between gap-4">
          <span className="text-2xl font-bold font-mono text-foreground leading-none tracking-tight">
            {value}
          </span>
          {sparklineData.length > 0 && (
            <svg
              className="w-20 h-6 overflow-visible"
              width={width}
              height={height}
            >
              <polyline
                fill="none"
                className={sparklineColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
            </svg>
          )}
        </div>

        {/* Change Indicators */}
        {change !== undefined && (
          <div className="flex items-center gap-1.5 text-[10px] font-mono leading-none">
            <span
              className={`flex items-center font-medium ${
                isPositive
                  ? "text-success"
                  : isNegative
                  ? "text-danger"
                  : "text-subtle"
              }`}
            >
              {isPositive && "▲"}
              {isNegative && "▼"}
              {isNeutral && "■"}{" "}
              {change > 0 ? `+${change}%` : `${change}%`}
            </span>
            {changeLabel && (
              <span className="text-subtle">{changeLabel}</span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
