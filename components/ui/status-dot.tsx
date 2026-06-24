import React from "react";

interface StatusDotProps {
  status?: "success" | "warning" | "danger" | "accent" | "muted";
  pulse?: boolean;
  className?: string;
}

const colorMap = {
  success: "bg-success border-success/30",
  warning: "bg-warning border-warning/30",
  danger: "bg-danger border-danger/30",
  accent: "bg-accent border-accent/30",
  muted: "bg-subtle border-subtle/30",
};

export const StatusDot: React.FC<StatusDotProps> = ({
  status = "muted",
  pulse = false,
  className = "",
}) => {
  const colorClass = colorMap[status] || colorMap.muted;

  return (
    <span className={`relative flex items-center justify-center w-2 h-2 ${className}`}>
      {pulse && status !== "muted" && (
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
            status === "success"
              ? "bg-success"
              : status === "warning"
              ? "bg-warning"
              : status === "danger"
              ? "bg-danger"
              : "bg-accent"
          }`}
        />
      )}
      <span className={`relative inline-flex rounded-full h-2 w-2 ${colorClass}`} />
    </span>
  );
};
