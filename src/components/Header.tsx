import React, { useState } from 'react';
import { ActiveTab, Incident } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  incidents: Incident[];
  onOpenIncidentSnapshot: (incident: Incident) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  incidents,
  onOpenIncidentSnapshot
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreviewedCount = incidents.filter(i => i.status === 'unreviewed').length;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border-subtle shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 w-full px-margin flex items-center justify-between gap-space-lg">
        {/* Brand & System Status */}
        <div className="flex items-center gap-space-lg shrink-0">
          <button
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-space-md text-left cursor-pointer group"
          >
            {/* Emerald Shield Logo */}
            <div className="w-8 h-8 rounded-lg bg-[#006948] flex items-center justify-center text-white shadow-sm group-hover:opacity-95 transition-opacity">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-on-surface leading-tight tracking-tight font-bold">
                SafeStay AI
              </span>
              <span className="font-label-sm text-[10px] text-secondary uppercase tracking-wider font-semibold">
                Worker Safety Monitor
              </span>
            </div>
          </button>

          {/* Hotel & Feeds Status Badge */}
          <div className="hidden xl:flex items-center gap-space-sm pl-space-md border-l border-border-subtle">
            <div className="inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded bg-status-safe-bg border border-status-safe-border">
              <span className="w-2 h-2 rounded-full bg-status-safe animate-pulse"></span>
              <span className="font-label-sm text-label-sm text-status-safe font-semibold">
                All Systems Operational (4/4 Feeds Live)
              </span>
            </div>
            <div className="inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded bg-surface-panel border border-border-subtle text-secondary">
              <span className="material-symbols-outlined text-sm">hotel</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                Grand Plaza Hotel
              </span>
              <span className="text-border-strong">•</span>
              <span className="font-label-sm text-label-sm text-secondary">
                Morning Prep (06:00 - 14:00)
              </span>
            </div>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav
          className="flex items-center gap-space-xs bg-surface-panel p-1 rounded-lg border border-border-subtle"
          aria-label="Main Navigation"
        >
          <button
            type="button"
            onClick={() => onSelectTab('dashboard')}
            className={`px-space-md py-1.5 rounded transition-all font-label-md text-label-md cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-primary text-on-primary font-semibold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-card'
            }`}
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('logs-and-reports')}
            className={`px-space-md py-1.5 rounded transition-all font-label-md text-label-md cursor-pointer ${
              activeTab === 'logs-and-reports'
                ? 'bg-primary text-on-primary font-semibold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-card'
            }`}
          >
            Logs &amp; Reports
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('settings')}
            className={`px-space-md py-1.5 rounded transition-all font-label-md text-label-md cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-primary text-on-primary font-semibold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-card'
            }`}
          >
            Settings
          </button>
        </nav>

        {/* Right Controls: Notifications & Safety Director Profile */}
        <div className="flex items-center gap-space-md shrink-0 relative">
          <div className="flex items-center gap-space-xs border-r border-border-subtle pr-space-md">
            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded hover:bg-surface-panel text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                title="Active Safety Alerts"
                aria-label="View notifications"
              >
                <span className="material-symbols-outlined text-xl">notifications</span>
                {unreviewedCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-status-violation text-on-error font-label-sm text-[9px] font-bold rounded-full animate-pulse">
                    {unreviewedCount}
                  </span>
                )}
              </button>

              {/* Quick Notifications Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-border-strong p-3 z-50 flex flex-col gap-2">
                  <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                    <span className="font-label-sm uppercase font-bold text-on-surface">
                      Pending Action Alerts ({unreviewedCount})
                    </span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-secondary hover:text-on-surface text-xs"
                    >
                      Close
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto flex flex-col gap-2">
                    {incidents.slice(0, 4).map(inc => (
                      <div
                        key={inc.id}
                        onClick={() => {
                          setShowNotifications(false);
                          onOpenIncidentSnapshot(inc);
                        }}
                        className="p-2 rounded bg-surface-panel hover:bg-surface-container transition-colors cursor-pointer text-left flex flex-col gap-0.5"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className={inc.severity === 'critical' ? 'text-status-violation font-bold' : 'text-status-warning font-semibold'}>
                            {inc.id} · {inc.timeString}
                          </span>
                          <span className="uppercase text-[9px] px-1 py-0.2 rounded bg-white font-semibold">
                            {inc.status}
                          </span>
                        </div>
                        <span className="font-label-md text-xs text-on-surface font-semibold truncate">
                          {inc.classification}
                        </span>
                        <span className="font-body-sm text-[10px] text-secondary truncate">
                          {inc.zoneName}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      onSelectTab('logs-and-reports');
                    }}
                    className="w-full py-1 text-center font-label-sm text-xs text-primary font-semibold hover:underline"
                  >
                    View All in Audit Log →
                  </button>
                </div>
              )}
            </div>

            {/* Quick Settings Icon */}
            <button
              type="button"
              onClick={() => onSelectTab('settings')}
              className={`p-2 rounded hover:bg-surface-panel transition-colors cursor-pointer ${
                activeTab === 'settings' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
              }`}
              title="System Configuration"
              aria-label="Settings"
            >
              <span className="material-symbols-outlined text-xl">settings</span>
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-space-sm">
            <img
              alt="Elena Rostova, Safety Director"
              className="w-8 h-8 rounded-full object-cover ring-1 ring-border-strong"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSuPORHw8I_agHKpzWlooFVtUujYy_6KGU0aPeOGZd2Hle8nRQyZ1k7isVFIIKtstV3tb4hzN9chuOwmX4l65dWE27PAvdzulYCYNNgqNB_d4mD1tf5gNXIfCEFRlkosqC8ggsXnJ67Gc-MAMVooLr557H9MPUOnICS8TYktc0iRYv6UZXK-m2Ok_mwwgGRNaPC-dFv7QhWf4htorEH8hHXW0ctGzofJdXeB9u_nekGgKdWkXf-ordeA"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="font-label-md text-label-md text-on-surface font-semibold leading-tight">
                Elena Rostova
              </span>
              <span className="font-label-sm text-[10px] text-secondary">
                Safety Director
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
