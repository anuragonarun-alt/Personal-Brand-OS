"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { StatusDot } from "@/components/ui/status-dot";

export const TopBar: React.FC = () => {
  const pathname = usePathname();
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format: YYYY-MM-DD HH:MM:SS UTC
      const datePart = now.toISOString().split("T")[0];
      const timePart = now.toISOString().split("T")[1].substring(0, 8);
      setTimeStr(`${datePart} ${timePart} UTC`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getBreadcrumbs = () => {
    if (pathname === "/") return ["OS", "DASHBOARD"];
    if (pathname.startsWith("/ideas")) return ["OS", "IDEA_VAULT"];
    if (pathname.startsWith("/pipeline")) return ["OS", "PIPELINE"];
    if (pathname.startsWith("/analytics")) return ["OS", "ANALYTICS"];
    if (pathname.startsWith("/settings")) return ["OS", "SETTINGS"];
    return ["OS", "UNKNOWN"];
  };

  const crumbs = getBreadcrumbs();

  return (
    <header className="h-14 border-b border-edge bg-background/50 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between select-none">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-subtle">
        {crumbs.map((crumb, idx) => (
          <React.Fragment key={`crumb-${idx}-${crumb}`}>
            {idx > 0 && <span className="text-edge-strong">/</span>}
            <span
              className={
                idx === crumbs.length - 1
                  ? "text-muted font-semibold"
                  : "text-subtle"
              }
            >
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Clock and Live Status */}
      <div className="flex items-center gap-4">
        {/* UTC Time */}
        <div className="font-mono text-[10px] text-muted tracking-tight tabular-nums hidden sm:block">
          {timeStr || "0000-00-00 00:00:00 UTC"}
        </div>

        {/* Separator */}
        <div className="w-px h-3 bg-edge hidden sm:block" />

        {/* Status */}
        <div className="flex items-center gap-2">
          <StatusDot status="success" pulse />
          <span className="font-mono text-[9px] text-muted tracking-wider uppercase">
            SYS_OK
          </span>
        </div>
      </div>
    </header>
  );
};
