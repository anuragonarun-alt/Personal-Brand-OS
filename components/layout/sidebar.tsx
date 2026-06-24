"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DashboardIcon,
  IdeasIcon,
  PipelineIcon,
  AnalyticsIcon,
  SettingsIcon,
  SignalIcon,
} from "@/components/ui/icons";
import { StatusDot } from "@/components/ui/status-dot";

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = "" }) => {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/", icon: DashboardIcon },
    { name: "Idea Vault", href: "/ideas", icon: IdeasIcon },
    { name: "Content Pipeline", href: "/pipeline", icon: PipelineIcon },
    { name: "Creator Analytics", href: "/analytics", icon: AnalyticsIcon },
    { name: "System Settings", href: "/settings", icon: SettingsIcon },
  ];

  return (
    <aside
      className={`w-[240px] min-w-[240px] h-screen bg-surface border-r border-edge flex flex-col justify-between select-none ${className}`}
    >
      {/* Brand Header */}
      <div>
        <div className="h-14 px-6 border-b border-edge flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md border border-edge-strong flex items-center justify-center bg-surface-2">
              <span className="font-mono text-[9px] font-bold text-accent">P</span>
            </div>
            <span className="font-bold tracking-tight text-xs uppercase font-sans">
              Personal Brand OS
            </span>
          </div>
          <span className="font-mono text-[9px] text-subtle tracking-tighter">
            v1.0.0
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? "bg-surface-2 text-foreground font-semibold border-l-2 border-accent rounded-l-none"
                    : "text-muted hover:text-foreground hover:bg-surface-2/40"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    size={14}
                    className={`${
                      isActive ? "text-accent" : "text-muted group-hover:text-foreground"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {isActive && (
                  <span className="font-mono text-[9px] text-accent/60 font-normal">
                    ACTIVE
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* System Health / Footer */}
      <div className="p-4 border-t border-edge bg-surface-2/40 space-y-3">
        <div className="flex items-center justify-between text-[10px] font-mono">
          <div className="flex items-center gap-1.5 text-muted">
            <SignalIcon size={12} className="text-subtle" />
            <span>SYNC_STREAM</span>
          </div>
          <div className="flex items-center gap-1">
            <StatusDot status="success" pulse />
            <span className="text-success font-medium">ONLINE</span>
          </div>
        </div>

        <div className="space-y-1 text-[9px] font-mono text-subtle">
          <div className="flex justify-between">
            <span>MEM_UTIL</span>
            <span className="text-muted">42.8 MB</span>
          </div>
          <div className="flex justify-between">
            <span>CPU_LOAD</span>
            <span className="text-muted">0.12%</span>
          </div>
          <div className="flex justify-between">
            <span>API_LATENCY</span>
            <span className="text-muted">14ms</span>
          </div>
        </div>

        <div className="h-1 bg-edge rounded-full overflow-hidden">
          <div className="h-full bg-accent w-2/5 animate-pulse" />
        </div>
      </div>
    </aside>
  );
};
