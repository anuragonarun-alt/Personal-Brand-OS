import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "success" | "warning" | "danger" | "subtle";
  className?: string;
}

const variantStyles = {
  default: "bg-surface border-edge text-muted",
  accent: "bg-accent/5 border-accent/20 text-accent",
  success: "bg-success/5 border-success/20 text-success",
  warning: "bg-warning/5 border-warning/20 text-warning",
  danger: "bg-danger/5 border-danger/20 text-danger",
  subtle: "bg-transparent border-edge text-subtle",
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className = "",
}) => {
  const baseStyles = "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono tracking-tight border";
  const statusStyles = variantStyles[variant] || variantStyles.default;

  return (
    <span className={`${baseStyles} ${statusStyles} ${className}`}>
      {children}
    </span>
  );
};
