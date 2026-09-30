import React, { useState } from 'react';
import { CameraFeed, PpeRule, AlertContact } from '../types';

interface SettingsViewProps {
  cameras: CameraFeed[];
  ppeRules: PpeRule[];
  contacts: AlertContact[];
  onUpdatePpeRules: (rules: PpeRule[]) => void;
  onUpdateCameras: (cams: CameraFeed[]) => void;
  onOpenAddCamera: () => void;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  cameras,
  ppeRules,
  contacts: initialContacts,
  onUpdatePpeRules,
  onUpdateCameras,
  onOpenAddCamera,
  onShowToast
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'cameras' | 'rules' | 'alerts' | 'health'>('cameras');
  const [localRules, setLocalRules] = useState<PpeRule[]>(ppeRules);
  const [localCameras, setLocalCameras] = useState<CameraFeed[]>(cameras);
  const [contacts, setContacts] = useState<AlertContact[]>(initialContacts);
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [persistenceThreshold, setPersistenceThreshold] = useState(3);
  const [chimeEnabled, setChimeEnabled] = useState(true);
  const [chimeVolume, setChimeVolume] = useState(70);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Calibration simulation state
  const [calibratingCamId, setCalibratingCamId] = useState<string | null>(null);

  const handleConfidenceChange = (ruleId: string, value: number) => {
    setLocalRules(prev =>
      prev.map(r => (r.id === ruleId ? { ...r, minConfidence: value } : r))
    );
    setHasUnsavedChanges(true);
  };

  const handleToggleRule = (ruleId: string) => {
    setLocalRules(prev =>
      prev.map(r => (r.id === ruleId ? { ...r, active: !r.active } : r))
    );
    setHasUnsavedChanges(true);
  };

  const handleAddZoneToRule = (ruleId: string) => {
    const zoneName = prompt('Enter new zone name to enforce (e.g. Pastry Station, Steward Bay):');
    if (zoneName && zoneName.trim()) {
      setLocalRules(prev =>
        prev.map(r =>
          r.id === ruleId
            ? { ...r, enforcedZones: [...r.enforcedZones.filter(z => !z.includes('None')), zoneName.trim()] }
            : r
        )
      );
      setHasUnsavedChanges(true);
      onShowToast(`Zone "${zoneName}" added to safety rule.`);
    }
  };

  const handleTestStream = (cam: CameraFeed) => {
    onShowToast(`Probing RTSP stream for ${cam.camNumber}... Ping: ${cam.latencyMs}ms. Stream healthy (30fps).`);
  };

  const handleRecalibrate = (cam: CameraFeed) => {
    setCalibratingCamId(cam.id);
    onShowToast(`Optical sensor calibration running for ${cam.camNumber}...`);
    setTimeout(() => {
      setCalibratingCamId(null);
      onShowToast(`Calibration finished for ${cam.camNumber}. Zero optical distortion.`);
    }, 2000);
  };

  const handleToggleCamStatus = (camId: string) => {
    setLocalCameras(prev =>
      prev.map(c => {
        if (c.id === camId) {
          const newStatus = c.status === 'online' ? 'standby' : 'online';
          return { ...c, status: newStatus };
        }
        return c;
      })
    );
    setHasUnsavedChanges(true);
  };

  const handleDeleteCamera = (camId: string) => {
    if (confirm('Are you sure you want to remove this camera feed from active monitoring?')) {
      const updated = localCameras.filter(c => c.id !== camId);
      setLocalCameras(updated);
      onUpdateCameras(updated);
      onShowToast('Camera feed removed.');
    }
  };

  const handleAddEmail = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newEmail.trim()) {
      e.preventDefault();
      setContacts(prev => [...prev, { id: 'c-' + Date.now(), type: 'email', value: newEmail.trim() }]);
      setNewEmail('');
      setHasUnsavedChanges(true);
      onShowToast('Dispatch email contact added.');
    }
  };

  const handleAddPhone = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newPhone.trim()) {
      e.preventDefault();
      setContacts(prev => [...prev, { id: 'c-' + Date.now(), type: 'phone', value: newPhone.trim(), label: 'Duty Lead' }]);
      setNewPhone('');
      setHasUnsavedChanges(true);
      onShowToast('SMS broadcast contact added.');
    }
  };

  const handleRemoveContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    setHasUnsavedChanges(true);
  };

  const handleDiscardChanges = () => {
    setLocalRules(ppeRules);
    setLocalCameras(cameras);
    setHasUnsavedChanges(false);
    onShowToast('All configuration modifications discarded.');
  };

  const handleSaveChanges = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdatePpeRules(localRules);
      onUpdateCameras(localCameras);
      setIsSaving(false);
      setHasUnsavedChanges(false);
      onShowToast('Configuration Synchronized! Edge nodes updated with new parameters.');
    }, 800);
  };

  return (
    <div className="flex flex-col w-full pb-32">
      {/* Top Context & Header Action Deck */}
      <div className="w-full bg-surface-card shadow-xs border-b border-border-subtle px-margin py-space-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-space-lg">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-sm">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-status-safe-bg text-status-safe font-label-sm text-label-sm font-semibold border border-status-safe-border">
                <span className="w-1.5 h-1.5 rounded-full bg-status-safe"></span>
                EDGE ENGINE ONLINE v2.4.1
              </span>
              <span className="text-secondary font-label-sm text-label-sm">•</span>
              <span className="text-secondary font-label-sm text-label-sm font-mono">NODE ID: GP-SEC-09</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
              System Configuration &amp; Safety Rules
            </h1>
            <p className="font-body-md text-body-md text-secondary">
              Manage IP cameras, AI PPE detection parameters, alert escalation paths, and hotel safety thresholds.
            </p>
          </div>

          {/* Live Pipeline Diagnostic Widget */}
          <div className="flex items-center gap-space-md p-space-md rounded-xl bg-surface-panel shadow-inner border border-border-subtle">
            <div className="flex flex-col text-right">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                Inference Latency
              </span>
              <span className="font-metric-display text-metric-display text-primary leading-none font-bold">
                22<span className="text-sm font-normal text-secondary">ms</span>
              </span>
            </div>
            <div className="w-px h-8 bg-surface-container-highest"></div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                Active Streams
              </span>
              <span className="font-label-md text-label-md font-semibold text-on-surface">
                {localCameras.filter(c => c.status === 'online').length}/{localCameras.length} Synced
              </span>
              <span className="font-label-sm text-label-sm text-status-safe">0 Drops (24h)</span>
            </div>
          </div>
        </div>

        {/* Segmented Navigation Tabs */}
        <div className="max-w-7xl mx-auto mt-space-xl">
          <nav className="flex items-center gap-space-xs overflow-x-auto pb-1" id="config-tabs">
            <button
              onClick={() => setActiveSubTab('cameras')}
              className={`tab-button inline-flex items-center gap-space-xs px-space-md py-2.5 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                activeSubTab === 'cameras'
                  ? 'bg-primary text-on-primary font-semibold shadow-xs'
                  : 'bg-surface-panel text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-base">videocam</span>
              <span>Camera Management</span>
              <span className="ml-1 px-1.5 py-0.2 bg-on-primary/20 text-on-primary rounded text-[10px] font-bold">
                {localCameras.length}
              </span>
            </button>
            <button
              onClick={() => setActiveSubTab('rules')}
              className={`tab-button inline-flex items-center gap-space-xs px-space-md py-2.5 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                activeSubTab === 'rules'
                  ? 'bg-primary text-on-primary font-semibold shadow-xs'
                  : 'bg-surface-panel text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-base">verified_user</span>
              <span>PPE Detection Rules</span>
              <span className="ml-1 px-1.5 py-0.2 bg-status-safe-bg text-status-safe rounded text-[10px] font-bold">
                {localRules.filter(r => r.active).length} Active
              </span>
            </button>
            <button
              onClick={() => setActiveSubTab('alerts')}
              className={`tab-button inline-flex items-center gap-space-xs px-space-md py-2.5 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                activeSubTab === 'alerts'
                  ? 'bg-primary text-on-primary font-semibold shadow-xs'
                  : 'bg-surface-panel text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-base">notification_important</span>
              <span>Alerts &amp; Notifications</span>
            </button>
            <button
              onClick={() => setActiveSubTab('health')}
              className={`tab-button inline-flex items-center gap-space-xs px-space-md py-2.5 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                activeSubTab === 'health'
                  ? 'bg-primary text-on-primary font-semibold shadow-xs'
                  : 'bg-surface-panel text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-base">hub</span>
              <span>System Health &amp; Integrations</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Primary Configuration Container */}
      <div className="w-full px-margin py-space-xl">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
          {/* SUBTAB 1: Camera Management */}
          {activeSubTab === 'cameras' && (
            <section className="flex flex-col gap-space-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                <div className="flex flex-col">
                  <div className="flex items-center gap-space-xs">
                    <span className="w-2.5 h-2.5 rounded bg-primary"></span>
                    <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                      Active RTSP Edge Feeds
                    </h2>
                  </div>
                  <p className="font-body-sm text-body-sm text-secondary">
                    Synchronized IP camera streams feeding the YOLOv8 PPE segmentation pipeline.
                  </p>
                </div>
                <button
                  onClick={onOpenAddCamera}
                  className="inline-flex items-center justify-center gap-space-xs px-space-md py-2 rounded-lg bg-on-surface text-surface-card hover:bg-neutral-800 font-label-md text-label-md font-semibold transition-all shadow-xs cursor-pointer"
                  id="open-add-camera-btn"
                  type="button"
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  <span>+ Add New Camera Feed</span>
                </button>
              </div>

              {/* Camera Rows */}
              <div className="grid grid-cols-1 gap-space-md">
                {localCameras.map(cam => {
                  const isOnline = cam.status === 'online';
                  const isCalibrating = calibratingCamId === cam.id;

                  return (
                    <div
                      key={cam.id}
                      className={`bg-surface-card rounded-xl p-space-md shadow-xs hover:shadow-md transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-md border border-border-subtle ${
                        !isOnline ? 'opacity-85' : ''
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-space-md w-full lg:w-auto">
                        {/* Live Snapshot Preview */}
                        <div className="relative w-36 h-22 rounded-lg overflow-hidden shrink-0 shadow-inner bg-inverse-surface group flex items-center justify-center">
                          {isOnline ? (
                            <>
                              <img
                                alt={cam.imageAlt}
                                className="w-full h-full object-cover object-center brightness-90 group-hover:scale-105 transition-transform duration-300"
                                src={cam.imageUrl}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 flex flex-col justify-between p-1.5 pointer-events-none">
                                <div className="flex items-center justify-between">
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-status-safe font-label-sm text-[9px] font-bold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-status-safe animate-pulse"></span> LIVE
                                  </span>
                                  <span className="text-white/80 font-label-sm text-[9px]">{cam.fps} FPS</span>
                                </div>
                                <span className="text-white font-label-sm text-[10px] truncate">
                                  {cam.resolution} · CH0
                                </span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex flex-col items-center gap-1 text-surface-container-highest z-10">
                                <span className="material-symbols-outlined text-2xl">pause_circle</span>
                                <span className="font-label-sm text-[9px] uppercase tracking-wider font-semibold">Feed Standby</span>
                              </div>
                              <div className="absolute inset-0 bg-black/50"></div>
                              <span className="absolute bottom-1 left-2 text-white/70 font-label-sm text-[9px]">
                                {cam.resolution} · {cam.fps} FPS
                              </span>
                            </>
                          )}
                        </div>

                        {/* Stream Info */}
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-space-sm flex-wrap">
                            <span className="font-headline-sm text-headline-sm text-on-surface font-semibold truncate">
                              {cam.camNumber} ({cam.name})
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-label-sm text-label-sm font-semibold ${
                                isOnline
                                  ? 'bg-status-safe-bg text-status-safe border border-status-safe-border'
                                  : 'bg-surface-panel text-secondary border border-border-subtle'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-status-safe' : 'bg-secondary'}`}
                              ></span>
                              {isOnline ? 'Online' : 'Standby'}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-surface-panel text-on-surface-variant font-label-sm text-label-sm border border-border-subtle">
                              Zone: {cam.subZone}
                            </span>
                          </div>

                          <div className="flex items-center gap-space-sm mt-1 flex-wrap">
                            <span className="font-label-sm text-label-sm text-secondary font-mono select-all">
                              {cam.rtspUrl}
                            </span>
                            <span className="text-border-strong">•</span>
                            <span className="font-label-sm text-label-sm text-secondary font-mono">
                              Latency: {cam.latencyMs}ms
                            </span>
                            <span className="text-border-strong">•</span>
                            <span className="font-label-sm text-label-sm text-primary font-semibold">
                              {cam.requiredGear.join(', ')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Feed Actions */}
                      <div className="flex items-center gap-space-xs shrink-0 self-end lg:self-center">
                        {isOnline ? (
                          <>
                            <button
                              onClick={() => handleTestStream(cam)}
                              className="inline-flex items-center gap-1 px-space-sm py-1.5 rounded bg-surface-panel hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors border border-border-subtle cursor-pointer"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-sm">troubleshoot</span>
                              <span>Test Stream</span>
                            </button>
                            <button
                              onClick={() => handleRecalibrate(cam)}
                              disabled={isCalibrating}
                              className="inline-flex items-center gap-1 px-space-sm py-1.5 rounded bg-surface-panel hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors border border-border-subtle cursor-pointer"
                              type="button"
                            >
                              <span
                                className={`material-symbols-outlined text-sm ${isCalibrating ? 'animate-spin' : ''}`}
                              >
                                {isCalibrating ? 'refresh' : 'crop_free'}
                              </span>
                              <span>{isCalibrating ? 'Calibrating...' : 'Re-calibrate'}</span>
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleToggleCamStatus(cam.id)}
                            className="inline-flex items-center gap-1 px-space-md py-1.5 rounded bg-primary text-on-primary font-label-md text-label-md transition-colors shadow-xs cursor-pointer"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-sm">play_arrow</span>
                            <span>Activate</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteCamera(cam.id)}
                          className="p-1.5 rounded bg-surface-panel hover:bg-status-violation-bg text-on-surface-variant hover:text-status-violation transition-colors cursor-pointer border border-border-subtle"
                          title="Delete Feed"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* SUBTAB 2: PPE Detection Rules & Thresholds */}
          {activeSubTab === 'rules' && (
            <section className="flex flex-col gap-space-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                <div className="flex flex-col">
                  <div className="flex items-center gap-space-xs">
                    <span className="w-2.5 h-2.5 rounded bg-primary"></span>
                    <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                      PPE Detection Rules &amp; Thresholds
                    </h2>
                  </div>
                  <p className="font-body-sm text-body-sm text-secondary">
                    Tune model inference confidence floors, classification toggles, and zone-specific regulatory constraints.
                  </p>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-panel text-on-surface font-label-sm text-label-sm border border-border-subtle">
                    <span className="material-symbols-outlined text-xs text-primary">psychology</span>
                    Model: YOLOv8-Safety-Hotel-v4
                  </span>
                </div>
              </div>

              {/* Rules Table */}
              <div className="bg-surface-card rounded-xl shadow-xs overflow-hidden border border-border-subtle">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-surface-panel text-secondary font-label-sm text-label-sm uppercase tracking-wider border-b border-border-subtle">
                        <th className="py-space-md px-space-lg">Safety Gear Class</th>
                        <th className="py-space-md px-space-lg">Detection State</th>
                        <th className="py-space-md px-space-lg">Min. Confidence Floor</th>
                        <th className="py-space-md px-space-lg">Required Enforced Zones</th>
                        <th className="py-space-md px-space-lg text-right">Model Latency</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container font-body-sm text-body-sm text-on-surface">
                      {localRules.map(rule => (
                        <tr
                          key={rule.id}
                          className={`hover:bg-surface-base/60 transition-colors ${
                            !rule.active ? 'opacity-70' : ''
                          }`}
                        >
                          <td className="py-space-md px-space-lg">
                            <div className="flex items-center gap-space-sm">
                              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                                <span className="material-symbols-outlined text-base">{rule.icon}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="font-label-md text-label-md font-semibold text-on-surface">
                                  {rule.name}
                                </span>
                                <span className="font-label-sm text-label-sm text-secondary">
                                  {rule.subtext}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-space-md px-space-lg">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                checked={rule.active}
                                onChange={() => handleToggleRule(rule.id)}
                                className="sr-only peer"
                                type="checkbox"
                              />
                              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                              <span
                                className={`ml-2.5 font-label-sm text-label-sm font-semibold ${
                                  rule.active ? 'text-status-safe' : 'text-secondary'
                                }`}
                              >
                                {rule.active ? 'ACTIVE' : 'OFFLINE'}
                              </span>
                            </label>
                          </td>

                          <td className="py-space-md px-space-lg">
                            <div className="flex items-center gap-space-md max-w-xs">
                              <input
                                className="w-full accent-primary h-1.5 bg-surface-container rounded-lg cursor-pointer disabled:cursor-not-allowed"
                                disabled={!rule.active}
                                max={98}
                                min={50}
                                value={rule.minConfidence}
                                onChange={e => handleConfidenceChange(rule.id, Number(e.target.value))}
                                type="range"
                              />
                              <span className="font-label-md text-label-md font-bold text-on-surface w-10 text-right font-mono">
                                {rule.minConfidence}%
                              </span>
                            </div>
                          </td>

                          <td className="py-space-md px-space-lg">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {rule.enforcedZones.map((z, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded bg-surface-panel text-on-surface font-label-sm text-label-sm font-medium border border-border-subtle"
                                >
                                  {z}
                                </span>
                              ))}
                              {rule.active && (
                                <button
                                  onClick={() => handleAddZoneToRule(rule.id)}
                                  className="text-primary hover:text-primary-container p-0.5 cursor-pointer"
                                  title="Add Zone"
                                  type="button"
                                >
                                  <span className="material-symbols-outlined text-xs">add</span>
                                </button>
                              )}
                            </div>
                          </td>

                          <td className="py-space-md px-space-lg text-right font-mono font-medium text-secondary">
                            {rule.active ? `${rule.latencyMs}ms` : '--'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* SUBTAB 3: Alerts & Notifications */}
          {activeSubTab === 'alerts' && (
            <section className="flex flex-col gap-space-lg">
              <div className="flex flex-col">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2.5 h-2.5 rounded bg-status-warning"></span>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                    Alert Escalation &amp; Dispatch Thresholds
                  </h2>
                </div>
                <p className="font-body-sm text-body-sm text-secondary">
                  Configure instant SMS relays, supervisory email dispatches, and dashboard auditory alerts.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
                {/* Dispatch Targets Card */}
                <div className="lg:col-span-7 bg-surface-card rounded-xl p-space-xl shadow-xs border border-border-subtle flex flex-col gap-space-lg">
                  <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      Safety Personnel Dispatch Registry
                    </span>
                    <span className="font-label-sm text-label-sm text-secondary font-mono">
                      Active: {contacts.filter(c => c.type === 'email').length} emails,{' '}
                      {contacts.filter(c => c.type === 'phone').length} phones
                    </span>
                  </div>

                  {/* Email Inputs */}
                  <div className="flex flex-col gap-space-xs">
                    <label className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
                      Safety Director &amp; Supervisor Emails (Press Enter to Add)
                    </label>
                    <div className="flex flex-wrap items-center gap-space-xs p-space-sm rounded-lg bg-surface-panel min-h-[46px] border border-border-subtle">
                      {contacts
                        .filter(c => c.type === 'email')
                        .map(c => (
                          <span
                            key={c.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-card text-on-surface font-label-sm text-label-sm font-medium shadow-xs border border-border-subtle"
                          >
                            <span className="material-symbols-outlined text-xs text-primary">mail</span>
                            {c.value}
                            <button
                              onClick={() => handleRemoveContact(c.id)}
                              className="text-secondary hover:text-status-violation ml-1 cursor-pointer"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-xs">close</span>
                            </button>
                          </span>
                        ))}
                      <input
                        value={newEmail}
                        onChange={e => setNewEmail(e.target.value)}
                        onKeyDown={handleAddEmail}
                        className="bg-transparent font-label-md text-label-md text-on-surface placeholder:text-secondary focus:outline-none flex-1 min-w-[160px] px-2"
                        placeholder="Add supervisor email..."
                        type="email"
                      />
                    </div>
                    <span className="font-body-sm text-[11px] text-secondary">
                      Receives instant summary reports with timestamped violation frames.
                    </span>
                  </div>

                  {/* Phone / SMS Inputs */}
                  <div className="flex flex-col gap-space-xs">
                    <label className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
                      SMS / Push Emergency Broadcast (Press Enter to Add)
                    </label>
                    <div className="flex flex-wrap items-center gap-space-xs p-space-sm rounded-lg bg-surface-panel min-h-[46px] border border-border-subtle">
                      {contacts
                        .filter(c => c.type === 'phone')
                        .map(c => (
                          <span
                            key={c.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-card text-on-surface font-label-sm text-label-sm font-medium shadow-xs border border-border-subtle"
                          >
                            <span className="material-symbols-outlined text-xs text-primary">phone_iphone</span>
                            {c.value} {c.label && `(${c.label})`}
                            <button
                              onClick={() => handleRemoveContact(c.id)}
                              className="text-secondary hover:text-status-violation ml-1 cursor-pointer"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-xs">close</span>
                            </button>
                          </span>
                        ))}
                      <input
                        value={newPhone}
                        onChange={e => setNewPhone(e.target.value)}
                        onKeyDown={handleAddPhone}
                        className="bg-transparent font-label-md text-label-md text-on-surface placeholder:text-secondary focus:outline-none flex-1 min-w-[160px] px-2"
                        placeholder="+1 (555) 000-0000"
                        type="tel"
                      />
                    </div>
                    <span className="font-body-sm text-[11px] text-secondary">
                      Critical SMS dispatched automatically when severity hits Level 1.
                    </span>
                  </div>
                </div>

                {/* Persistence Filter & Sound Settings Card */}
                <div className="lg:col-span-5 bg-surface-card rounded-xl p-space-xl shadow-xs border border-border-subtle flex flex-col justify-between gap-space-lg">
                  <div className="flex flex-col gap-space-md">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-semibold pb-2 border-b border-border-subtle">
                      False-Positive Dampening
                    </span>

                    {/* Occlusion Tolerance Slider */}
                    <div className="flex flex-col gap-space-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-label-md text-label-md text-on-surface font-semibold">
                          Violation Persistence Threshold
                        </span>
                        <span className="font-metric-display text-headline-sm text-primary font-bold">
                          {persistenceThreshold} Seconds
                        </span>
                      </div>
                      <input
                        value={persistenceThreshold}
                        onChange={e => {
                          setPersistenceThreshold(Number(e.target.value));
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
                        max={10}
                        min={1}
                        type="range"
                      />
                      <p className="font-body-sm text-[11px] text-secondary">
                        Requires an infraction to sustain continuously for {persistenceThreshold}s before tripping an escalated alert ticket. Mitigates occlusions behind shelves or passing personnel.
                      </p>
                    </div>

                    {/* Audio Chime Toggle & Slider */}
                    <div className="flex flex-col gap-space-sm pt-space-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-space-xs">
                          <span className="material-symbols-outlined text-on-surface text-base">
                            {chimeEnabled ? 'volume_up' : 'volume_off'}
                          </span>
                          <span className="font-label-md text-label-md text-on-surface font-semibold">
                            Console Audio Chime
                          </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            checked={chimeEnabled}
                            onChange={e => {
                              setChimeEnabled(e.target.checked);
                              setHasUnsavedChanges(true);
                            }}
                            className="sr-only peer"
                            type="checkbox"
                          />
                          <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="flex items-center gap-space-md">
                        <span className="font-label-sm text-label-sm text-secondary">Volume</span>
                        <input
                          value={chimeVolume}
                          disabled={!chimeEnabled}
                          onChange={e => {
                            setChimeVolume(Number(e.target.value));
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full accent-primary h-1.5 bg-surface-container rounded-lg cursor-pointer disabled:cursor-not-allowed"
                          max={100}
                          min={0}
                          type="range"
                        />
                        <span className="font-label-sm text-label-sm font-semibold text-on-surface font-mono w-10 text-right">
                          {chimeVolume}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Escalation Policy Quick Select */}
                  <div className="p-space-md rounded-lg bg-surface-panel flex items-center justify-between border border-border-subtle">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-secondary uppercase font-semibold">
                        Shift Escalation Rule
                      </span>
                      <span className="font-label-md text-label-md font-semibold text-on-surface">
                        Standard Hotel OSHA / HACCP
                      </span>
                    </div>
                    <button
                      onClick={() => onShowToast('Escalation Protocol locked to active Grand Plaza HACCP profile.')}
                      className="text-primary font-label-sm text-label-sm font-semibold hover:underline cursor-pointer"
                      type="button"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* SUBTAB 4: System Health & Integrations */}
          {activeSubTab === 'health' && (
            <section className="flex flex-col gap-space-lg">
              <div className="flex flex-col">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2.5 h-2.5 rounded bg-tertiary"></span>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                    Hardware Telemetry &amp; External Webhooks
                  </h2>
                </div>
                <p className="font-body-sm text-body-sm text-secondary">
                  Local edge accelerator TPU temperatures, hotel PMS integrations, and webhook sinks.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                <div className="p-space-lg rounded-xl bg-surface-card shadow-xs border border-border-subtle flex flex-col gap-space-xs">
                  <span className="font-label-sm text-label-sm uppercase text-secondary font-semibold">
                    Edge Inference Engine
                  </span>
                  <span className="font-metric-display text-metric-display text-on-surface font-bold">
                    NVIDIA Orin NX
                  </span>
                  <span className="font-label-sm text-label-sm text-status-safe font-mono">
                    Core Temp: 44°C • GPU Load: 38%
                  </span>
                  <div className="mt-3 pt-2 border-t border-border-subtle flex items-center justify-between text-xs text-secondary font-mono">
                    <span>RAM: 11.2 / 16.0 GB</span>
                    <span className="text-status-safe">Thermal: Nominal</span>
                  </div>
                </div>

                <div className="p-space-lg rounded-xl bg-surface-card shadow-xs border border-border-subtle flex flex-col gap-space-xs">
                  <span className="font-label-sm text-label-sm uppercase text-secondary font-semibold">
                    PMS / HR Integration
                  </span>
                  <span className="font-metric-display text-metric-display text-on-surface font-bold">
                    Opera Cloud Sync
                  </span>
                  <span className="font-label-sm text-label-sm text-status-safe font-mono">
                    Staff Rosters Synced 4m ago
                  </span>
                  <div className="mt-3 pt-2 border-t border-border-subtle flex items-center justify-between">
                    <span className="text-xs text-secondary">28 active tags</span>
                    <button
                      type="button"
                      onClick={() => onShowToast('Manual HR roster sync completed from Opera Cloud PMS.')}
                      className="px-2 py-0.5 rounded bg-surface-panel hover:bg-surface-container text-xs font-semibold text-primary cursor-pointer"
                    >
                      Force Sync
                    </button>
                  </div>
                </div>

                <div className="p-space-lg rounded-xl bg-surface-card shadow-xs border border-border-subtle flex flex-col gap-space-xs">
                  <span className="font-label-sm text-label-sm uppercase text-secondary font-semibold">
                    Security Incident Webhook
                  </span>
                  <span className="font-metric-display text-metric-display text-on-surface font-bold">
                    Slack &amp; Teams
                  </span>
                  <span className="font-label-sm text-label-sm text-status-safe font-mono">
                    Status: 200 OK (Last ping 12s)
                  </span>
                  <div className="mt-3 pt-2 border-t border-border-subtle flex items-center justify-between">
                    <span className="text-xs text-secondary">Webhook endpoint live</span>
                    <button
                      type="button"
                      onClick={() => onShowToast('Test webhook payload delivered to #hotel-safety-alerts (HTTP 200).')}
                      className="px-2 py-0.5 rounded bg-surface-panel hover:bg-surface-container text-xs font-semibold text-primary cursor-pointer"
                    >
                      Test Webhook
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Sticky Save / Discard Ergonomic Action Bar */}
      {hasUnsavedChanges && (
        <aside
          aria-label="Configuration changes toolbar"
          className="fixed bottom-0 left-0 right-0 z-40 bg-surface-card/95 backdrop-blur-md shadow-[0_-4px_16px_rgba(0,0,0,0.08)] px-margin py-space-md border-t border-border-strong animate-in slide-in-from-bottom-2"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-sm">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-warning opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-status-warning"></span>
              </span>
              <span className="font-label-md text-label-md text-on-surface font-medium">
                Unsaved Modifications Detected:
              </span>
              <span className="font-label-sm text-label-sm text-secondary bg-surface-panel px-2 py-0.5 rounded font-mono border border-border-subtle">
                Rule &amp; Camera Thresholds Shifted
              </span>
            </div>
            <div className="flex items-center gap-space-sm w-full sm:w-auto justify-end">
              <button
                onClick={handleDiscardChanges}
                className="px-space-md py-2 rounded-lg bg-surface-panel hover:bg-surface-container text-on-surface font-label-md text-label-md font-medium transition-colors cursor-pointer border border-border-subtle"
                type="button"
              >
                Discard Changes
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-space-xl py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold transition-all shadow-xs cursor-pointer"
                id="save-all-btn"
                type="button"
              >
                <span className={`material-symbols-outlined text-sm ${isSaving ? 'animate-spin' : ''}`}>
                  {isSaving ? 'refresh' : 'cloud_done'}
                </span>
                <span>{isSaving ? 'Applying to Edge Nodes...' : 'Save System Changes'}</span>
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};
