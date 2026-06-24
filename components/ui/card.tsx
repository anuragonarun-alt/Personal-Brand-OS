import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  header,
  footer,
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={`bg-surface border border-edge rounded-[12px] overflow-hidden flex flex-col ${
        hoverable ? "hover:border-edge-strong transition-colors duration-150" : ""
      } ${className}`}
      {...props}
    >
      {header && (
        <div className="border-b border-edge px-4 py-3 flex items-center justify-between text-xs font-medium tracking-tight">
          {header}
        </div>
      )}
      <div className="p-4 flex-1">{children}</div>
      {footer && (
        <div className="border-t border-edge px-4 py-2.5 bg-surface-2 text-[10px] text-subtle font-mono flex items-center justify-between">
          {footer}
        </div>
      )}
    </div>
  );
};
