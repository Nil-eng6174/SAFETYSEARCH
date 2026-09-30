import React, { useState, useEffect } from 'react';
import { CameraFeed, Incident } from '../types';

interface DashboardViewProps {
  cameras: CameraFeed[];
  incidents: Incident[];
  onOpenDispatch: (incident: Incident) => void;
  onOpenSnapshot: (incident: Incident) => void;
  onOpenBroadcast: () => void;
  onOpenPTZ: (cam: CameraFeed) => void;
  onAcknowledgeIncident: (incidentId: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  cameras,
  incidents,
  onOpenDispatch,
  onOpenSnapshot,
  onOpenBroadcast,
  onOpenPTZ,
  onAcknowledgeIncident,
  onShowToast
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'focus'>('grid');
  const [selectedZone, setSelectedZone] = useState('all');
  const [incidentFilter, setIncidentFilter] = useState<'all' | 'critical' | 'warning'>('all');
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isShiftMuted, setIsShiftMuted] = useState(false);
  const [focusCamId, setFocusCamId] = useState<string>('cam-01');

  // Real-time clock ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        'LIVE ' +
          now.toLocaleTimeString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filtered cameras based on zone
  const filteredCameras = cameras.filter(cam => {
    if (selectedZone === 'all') return true;
    return cam.zone === selectedZone;
  });

  // Filtered incidents based on severity
  const filteredIncidents = incidents.filter(inc => {
    if (incidentFilter === 'all') return true;
    return inc.severity === incidentFilter;
  });

  // Action handlers
  const handleDownloadSummary = () => {
    onShowToast('Compiling Shift Safety PDF Report (Morning Prep 06:00 - 14:00)...');
    setTimeout(() => {
      // Create a lightweight CSV summary file download as proof
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        'Incident_ID,Timestamp,Camera,Zone,Classification,Worker,Status\n' +
        incidents
          .map(
            i =>
              `${i.id},${i.timeString},"${i.cameraName}","${i.zoneName}","${i.classification}","${i.worker.name}",${i.status}`
          )
          .join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `SafeStay_Shift_Summary_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onShowToast('Shift Summary downloaded successfully!');
    }, 600);
  };

  const handleCaptureSnapshot = (cam: CameraFeed) => {
    onShowToast(`Frame captured from ${cam.camNumber} (${cam.name}). Saved to audit archive.`);
  };

  const handleToggleFullscreen = (cam: CameraFeed) => {
    setFocusCamId(cam.id);
    setViewMode('focus');
    onShowToast(`Focusing feed: ${cam.camNumber} · ${cam.name}`);
  };

  const handleMute15m = () => {
    setIsShiftMuted(!isShiftMuted);
    onShowToast(
      !isShiftMuted
        ? 'Shift alarm chime silenced for 15 minutes.'
        : 'Safety alarm chimes re-enabled.'
    );
  };

  const handleToggleAudio = () => {
    setIsAudioMuted(!isAudioMuted);
    onShowToast(
      !isAudioMuted
        ? 'Incident stream audio chime muted.'
        : 'Incident stream audio chime unmuted.'
    );
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Operational Overview Section / Metric Strip */}
      <div className="w-full px-margin py-space-lg flex flex-col gap-space-lg max-w-[1920px] mx-auto">
        {/* Top System Telemetry Banner & Action Toolbar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-md bg-surface-card p-space-md rounded-xl shadow-xs border border-border-subtle">
          <div className="flex flex-wrap items-center gap-space-md">
            <div className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-lg bg-status-safe-bg text-status-safe font-label-md">
              <span className="w-2.5 h-2.5 rounded-full bg-status-safe animate-pulse"></span>
              <span className="font-semibold tracking-wide">ALL SYSTEMS OPERATIONAL</span>
            </div>
            <div className="h-4 w-[1px] bg-border-subtle hidden sm:block"></div>
            <div className="flex items-center gap-space-lg text-secondary font-label-sm">
              <span className="inline-flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-status-safe">videocam</span>
                <strong className="text-on-surface font-semibold">{cameras.length} Active</strong> / 0 Offline
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-primary">verified</span>
                <strong className="text-on-surface font-semibold">99.8%</strong> 30d Uptime
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-secondary">memory</span>
                Edge Latency: <strong className="text-on-surface font-semibold">18ms</strong>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-space-xs self-stretch sm:self-auto justify-end">
            <button
              onClick={onOpenBroadcast}
              className="inline-flex items-center gap-1.5 px-space-md py-1.5 rounded-lg bg-surface-panel hover:bg-surface-container text-on-surface-variant font-label-md transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-sm text-primary">campaign</span>
              <span>Broadcast PA</span>
            </button>
            <button
              onClick={handleDownloadSummary}
              className="inline-flex items-center gap-1.5 px-space-md py-1.5 rounded-lg bg-surface-panel hover:bg-surface-container text-on-surface-variant font-label-md transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              <span>Shift Summary</span>
            </button>
            <button
              onClick={handleMute15m}
              className={`inline-flex items-center gap-1.5 px-space-md py-1.5 rounded-lg font-label-md transition-colors cursor-pointer ${
                isShiftMuted
                  ? 'bg-status-warning-bg text-status-warning font-semibold border border-status-warning-border'
                  : 'bg-surface-panel hover:bg-surface-container text-secondary'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-sm">
                {isShiftMuted ? 'volume_off' : 'snooze'}
              </span>
              <span>{isShiftMuted ? 'Muted' : 'Mute 15m'}</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
          {/* Metric 1: Current Compliance */}
          <div className="bg-surface-card p-space-lg rounded-xl shadow-xs border border-border-subtle relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-sm text-secondary uppercase tracking-wider font-semibold">
                  Current Shift Compliance
                </span>
                <span className="font-metric-display text-metric-display text-on-surface mt-1 font-bold">
                  94.2%
                </span>
              </div>
              {/* Micro Ring Chart SVG */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-surface-panel"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  />
                  <path
                    className="text-status-safe"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="94.2, 100"
                    strokeLinecap="round"
                    strokeWidth="3.5"
                  />
                </svg>
                <span className="material-symbols-outlined absolute text-status-safe text-sm">shield</span>
              </div>
            </div>
            <div className="mt-space-md pt-space-xs flex items-center justify-between">
              <span className="inline-flex items-center gap-1 font-label-sm text-status-safe font-semibold bg-status-safe-bg px-1.5 py-0.5 rounded">
                <span className="material-symbols-outlined text-xs">trending_up</span>+2.4% vs last shift
              </span>
              <span className="font-label-sm text-secondary">Target: 98.0%</span>
            </div>
          </div>

          {/* Metric 2: Active Workers Detected */}
          <div className="bg-surface-card p-space-lg rounded-xl shadow-xs border border-border-subtle flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-sm text-secondary uppercase tracking-wider font-semibold">
                  Active Workers On Floor
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-metric-display text-metric-display text-on-surface font-bold">28</span>
                  <span className="font-label-sm text-status-safe font-medium">all tagged</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-surface-panel flex items-center justify-center text-on-surface">
                <span className="material-symbols-outlined text-xl">groups</span>
              </div>
            </div>
            <div className="mt-space-md pt-space-xs flex items-center gap-space-sm text-secondary font-label-sm">
              <span className="px-1.5 py-0.5 rounded bg-surface-panel text-on-surface-variant font-medium">Kit: 12</span>
              <span className="px-1.5 py-0.5 rounded bg-surface-panel text-on-surface-variant font-medium">Hsk: 9</span>
              <span className="px-1.5 py-0.5 rounded bg-surface-panel text-on-surface-variant font-medium">Lnd: 7</span>
            </div>
          </div>

          {/* Metric 3: Violations Today */}
          <div className="bg-surface-card p-space-lg rounded-xl shadow-xs border border-border-subtle flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-status-violation"></div>
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-sm text-secondary uppercase tracking-wider font-semibold">
                  Shift Violations Logged
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-metric-display text-metric-display text-status-violation font-bold">5</span>
                  <span className="font-label-sm text-secondary">incidents</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-status-violation-bg flex items-center justify-center text-status-violation">
                <span className="material-symbols-outlined text-xl">warning</span>
              </div>
            </div>
            <div className="mt-space-md pt-space-xs flex items-center justify-between font-label-sm">
              <span className="text-status-violation font-semibold inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-status-violation"></span>2 High Priority
              </span>
              <span className="text-status-warning font-medium inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-status-warning"></span>3 Warnings
              </span>
            </div>
          </div>

          {/* Metric 4: AI Stream Infrastructure */}
          <div className="bg-surface-card p-space-lg rounded-xl shadow-xs border border-border-subtle flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-sm text-secondary uppercase tracking-wider font-semibold">
                  Inference Node Health
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-metric-display text-metric-display text-on-surface font-bold">4 / 4</span>
                  <span className="font-label-sm text-status-safe font-medium">1080p 30fps</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary-fixed text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">speed</span>
              </div>
            </div>
            <div className="mt-space-md pt-space-xs flex items-center justify-between font-label-sm text-secondary">
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-status-safe"></span>Conf. Cutoff: 85%
              </span>
              <span className="text-on-surface font-mono font-medium">YOLOv8-Safety</span>
            </div>
          </div>
        </div>

        {/* Main Workspace Split Grid: Video Monitoring (Left 8 Cols) vs Live Incident Stream (Right 4 Cols) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg">
          {/* LEFT MONITORING PLANE (8 cols on XL screens) */}
          <section className="xl:col-span-8 flex flex-col gap-space-md min-w-0">
            {/* Stream Controls & Matrix Selectors */}
            <div className="bg-surface-card p-space-md rounded-xl shadow-xs border border-border-subtle flex flex-wrap items-center justify-between gap-space-md">
              <div className="flex items-center gap-space-sm">
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Live Video Matrix
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-panel text-secondary font-label-sm font-semibold">
                  Station #GP-04
                </span>
              </div>

              {/* Controls: View Modes & Zone Picker */}
              <div className="flex flex-wrap items-center gap-space-sm">
                {/* Filter Dropdown */}
                <div className="relative">
                  <select
                    value={selectedZone}
                    onChange={e => setSelectedZone(e.target.value)}
                    className="bg-surface-panel text-on-surface font-label-md text-label-md px-3 py-1.5 rounded-lg appearance-none pr-8 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary border border-border-subtle"
                  >
                    <option value="all">Zone: All Cameras (4)</option>
                    <option value="kitchen">Zone: Main Kitchen - Hot Line</option>
                    <option value="prep">Zone: Prep &amp; Cold Storage</option>
                    <option value="housekeeping">Zone: Housekeeping Linen Floor</option>
                    <option value="wash">Zone: Stewarding &amp; Dishwash Bay</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-secondary text-sm">
                    expand_more
                  </span>
                </div>

                {/* View Switcher: 2x2 Grid vs Single Focus */}
                <div className="inline-flex items-center p-0.5 bg-surface-panel rounded-lg border border-border-subtle">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-2.5 py-1 rounded font-label-sm inline-flex items-center gap-1 transition-all cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-surface-card text-on-surface font-semibold shadow-xs'
                        : 'text-secondary hover:text-on-surface'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm">grid_view</span>
                    <span>2x2 Grid</span>
                  </button>
                  <button
                    onClick={() => setViewMode('focus')}
                    className={`px-2.5 py-1 rounded font-label-sm inline-flex items-center gap-1 transition-all cursor-pointer ${
                      viewMode === 'focus'
                        ? 'bg-surface-card text-on-surface font-semibold shadow-xs'
                        : 'text-secondary hover:text-on-surface'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm">crop_free</span>
                    <span>Single Focus</span>
                  </button>
                </div>

                {/* Stream Confidence Indicator */}
                <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-panel text-secondary font-label-sm border border-border-subtle">
                  <span className="material-symbols-outlined text-sm text-primary">tune</span>
                  <span>Min Conf: 85%</span>
                </div>
              </div>
            </div>

            {/* Dynamic Cameras Grid */}
            <div
              className={`grid gap-space-md transition-all ${
                viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
              }`}
            >
              {(viewMode === 'focus'
                ? filteredCameras.filter(c => c.id === focusCamId).length > 0
                  ? filteredCameras.filter(c => c.id === focusCamId)
                  : [filteredCameras[0] || cameras[0]]
                : filteredCameras
              ).map(cam => {
                const isViolation = cam.violationsCount > 0;
                const isWarning = cam.warningsCount > 0;

                return (
                  <div
                    key={cam.id}
                    className="bg-inverse-surface rounded-xl overflow-hidden shadow-xs flex flex-col relative group border border-border-strong"
                  >
                    {/* Cam HUD Top */}
                    <div className="px-space-md py-2 bg-[#213145]/90 backdrop-blur-xs flex items-center justify-between text-inverse-on-surface font-label-sm z-20">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            isViolation
                              ? 'bg-status-violation animate-ping'
                              : isWarning
                              ? 'bg-status-warning'
                              : 'bg-status-safe'
                          }`}
                        ></span>
                        <span className="font-bold text-inverse-on-surface">
                          {cam.camNumber} · {cam.name}
                        </span>
                        <span className="text-outline-variant uppercase text-[10px]">
                          {cam.subZone}
                        </span>
                      </div>
                      <div className="flex items-center gap-space-sm font-mono text-xs">
                        {isViolation ? (
                          <span className="text-status-violation font-bold">1 VIOLATION</span>
                        ) : isWarning ? (
                          <span className="text-status-warning font-semibold">1 WARNING</span>
                        ) : (
                          <span className="text-status-safe font-semibold">100% COMPLIANT</span>
                        )}
                        <span className="text-slate-400">
                          {cam.id === 'cam-01' ? currentTimeStr : 'LIVE'}
                        </span>
                      </div>
                    </div>

                    {/* Camera Feed Viewport with Bounding Boxes */}
                    <div className="relative w-full aspect-video bg-neutral-900 overflow-hidden flex items-center justify-center">
                      <img
                        alt={cam.imageAlt}
                        className="w-full h-full object-cover opacity-85 group-hover:scale-101 transition-transform duration-300"
                        src={cam.imageUrl}
                      />

                      {/* AI DETECTION OVERLAYS */}
                      {cam.boundingBoxes.map(box => {
                        const isViolBox = box.type === 'violation';
                        const isWarnBox = box.type === 'warning';

                        return (
                          <div
                            key={box.id}
                            style={{
                              top: box.top,
                              left: box.left,
                              width: box.width,
                              height: box.height
                            }}
                            className={`absolute rounded-xs pointer-events-none flex flex-col ${
                              isViolBox
                                ? 'border-2 border-dashed border-status-violation bg-status-violation/20 p-1 animate-pulse justify-between'
                                : isWarnBox
                                ? 'border-2 border-status-warning bg-status-warning/20 p-0.5 justify-start'
                                : 'border border-status-safe bg-status-safe/10 justify-start'
                            }`}
                          >
                            <span
                              className={`font-label-sm text-[9px] px-1 py-0.5 rounded-br w-max font-semibold uppercase flex items-center gap-0.5 ${
                                isViolBox
                                  ? 'bg-status-violation text-white shadow-xs'
                                  : isWarnBox
                                  ? 'bg-status-warning text-white'
                                  : 'bg-status-safe text-white'
                              }`}
                            >
                              {isViolBox && <span className="material-symbols-outlined text-[10px]">cancel</span>}
                              {isWarnBox && <span className="material-symbols-outlined text-[10px]">warning</span>}
                              {box.label}
                            </span>
                            {box.subtext && (
                              <span className="bg-[#213145]/85 text-white font-label-sm text-[9px] px-1 rounded w-max mt-auto">
                                {box.subtext}
                              </span>
                            )}
                          </div>
                        );
                      })}

                      {/* Camera Grid Scanline Overlay Effect */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none opacity-40"></div>

                      {/* Bottom Stream Quick Action Floating Bar */}
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <div className="bg-[#213145]/90 backdrop-blur-xs px-2 py-1 rounded text-inverse-on-surface font-label-sm text-xs flex items-center gap-2">
                          <span>{cam.fps.toFixed(1)} FPS</span>
                          <span>Bitrate: {cam.bitrate}</span>
                          <span>{cam.latencyMs}ms</span>
                        </div>
                        <div className="flex items-center gap-1 bg-[#213145]/90 backdrop-blur-xs p-1 rounded">
                          <button
                            onClick={() => handleCaptureSnapshot(cam)}
                            className="p-1 hover:bg-slate-700 text-white rounded text-xs flex items-center cursor-pointer"
                            title="Capture Snapshot"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-sm">photo_camera</span>
                          </button>
                          <button
                            onClick={() => onOpenPTZ(cam)}
                            className="p-1 hover:bg-slate-700 text-white rounded text-xs flex items-center cursor-pointer"
                            title="PTZ Controls"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-sm">pan_tool</span>
                          </button>
                          <button
                            onClick={() => handleToggleFullscreen(cam)}
                            className="p-1 hover:bg-slate-700 text-white rounded text-xs flex items-center cursor-pointer"
                            title="Focus Feed"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-sm">fullscreen</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Cam Footer Bar */}
                    <div className="px-space-md py-1.5 bg-surface-card border-t border-border-subtle flex items-center justify-between text-secondary font-label-sm">
                      <span className="text-on-surface-variant font-medium">
                        Worker Tag: #{cam.workerTag.id} ({cam.workerTag.name})
                      </span>
                      <span
                        className={`font-semibold inline-flex items-center gap-1 ${
                          cam.workerStatusType === 'violation'
                            ? 'text-status-violation'
                            : cam.workerStatusType === 'warning'
                            ? 'text-status-warning'
                            : 'text-status-safe'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            cam.workerStatusType === 'violation'
                              ? 'bg-status-violation'
                              : cam.workerStatusType === 'warning'
                              ? 'bg-status-warning'
                              : 'bg-status-safe'
                          }`}
                        ></span>
                        {cam.workerStatusText}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Telemetry Bottom Bar: Equipment Requirements Checklist */}
            <div className="bg-surface-card p-space-md rounded-xl shadow-xs border border-border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-primary text-xl">fact_check</span>
                <div>
                  <span className="font-headline-sm text-sm text-on-surface font-semibold block">
                    Active Hotel PPE Protocol: HACCP &amp; OSHA Level 2
                  </span>
                  <p className="font-body-sm text-secondary text-xs">
                    Kitchen zone requires hairnets, vinyl/nitrile gloves &amp; slip-resistant footwear at all times.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-space-xs shrink-0 font-label-sm flex-wrap">
                <span className="px-2 py-1 bg-status-safe-bg text-status-safe rounded font-medium border border-status-safe-border">
                  Gloves: Enforced
                </span>
                <span className="px-2 py-1 bg-status-safe-bg text-status-safe rounded font-medium border border-status-safe-border">
                  Hairnet: Enforced
                </span>
                <span className="px-2 py-1 bg-status-safe-bg text-status-safe rounded font-medium border border-status-safe-border">
                  Eye Guard: Hazardous Zones
                </span>
              </div>
            </div>
          </section>

          {/* RIGHT AUDIT COLUMN: Live Alerts Feed (4 cols on XL screens) */}
          <aside className="xl:col-span-4 flex flex-col gap-space-md min-w-0">
            {/* Alerts Header Card */}
            <div className="bg-surface-card p-space-md rounded-xl shadow-xs border border-border-subtle flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-status-violation animate-ping"></span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Live Incident Stream
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full bg-status-violation text-on-error font-label-sm font-bold text-xs"
                    id="incidentCountBadge"
                  >
                    {incidents.length} Today
                  </span>
                </div>
                {/* Audio Toggle */}
                <button
                  onClick={handleToggleAudio}
                  className="p-1.5 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-panel transition-colors cursor-pointer"
                  title={isAudioMuted ? 'Unmute Alert Chime' : 'Mute Alert Chime'}
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">
                    {isAudioMuted ? 'volume_off' : 'volume_up'}
                  </span>
                </button>
              </div>

              {/* Alert Category Filter Tabs */}
              <div className="flex items-center gap-1 bg-surface-panel p-1 rounded-lg font-label-sm border border-border-subtle">
                <button
                  onClick={() => setIncidentFilter('all')}
                  className={`alert-filter-btn flex-1 py-1 rounded text-center transition-colors cursor-pointer ${
                    incidentFilter === 'all'
                      ? 'bg-surface-card text-on-surface font-semibold shadow-xs'
                      : 'text-secondary hover:text-on-surface'
                  }`}
                  type="button"
                >
                  All ({incidents.length})
                </button>
                <button
                  onClick={() => setIncidentFilter('critical')}
                  className={`alert-filter-btn flex-1 py-1 rounded text-center transition-colors cursor-pointer ${
                    incidentFilter === 'critical'
                      ? 'bg-surface-card text-on-surface font-semibold shadow-xs'
                      : 'text-secondary hover:text-on-surface'
                  }`}
                  type="button"
                >
                  Critical ({incidents.filter(i => i.severity === 'critical').length})
                </button>
                <button
                  onClick={() => setIncidentFilter('warning')}
                  className={`alert-filter-btn flex-1 py-1 rounded text-center transition-colors cursor-pointer ${
                    incidentFilter === 'warning'
                      ? 'bg-surface-card text-on-surface font-semibold shadow-xs'
                      : 'text-secondary hover:text-on-surface'
                  }`}
                  type="button"
                >
                  Warning ({incidents.filter(i => i.severity === 'warning').length})
                </button>
              </div>
            </div>

            {/* Scrollable Incident Card Queue */}
            <div className="flex flex-col gap-space-md overflow-y-auto max-h-[720px] pr-0.5">
              {filteredIncidents.map(inc => {
                const isCritical = inc.severity === 'critical';
                const isWarning = inc.severity === 'warning';
                const isAcknowledged = inc.status === 'acknowledged';

                return (
                  <div
                    key={inc.id}
                    className="incident-card bg-surface-card rounded-xl p-space-md shadow-xs border border-border-subtle relative overflow-hidden flex flex-col gap-space-sm transition-all hover:shadow-md"
                  >
                    {/* Severity colored left bar */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                        isCritical
                          ? 'bg-status-violation'
                          : isWarning
                          ? 'bg-status-warning'
                          : 'bg-secondary'
                      }`}
                    ></div>

                    <div className="flex items-start justify-between gap-2 pl-1">
                      <div className="flex items-center gap-1.5 font-label-sm">
                        <span
                          className={`font-bold tracking-wide ${
                            isCritical ? 'text-status-violation' : 'text-status-warning'
                          }`}
                        >
                          {inc.timeString}
                        </span>
                        <span className="text-border-strong">•</span>
                        <span className="text-secondary font-medium">{inc.cameraName}</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded font-label-sm text-[10px] font-bold uppercase tracking-wider ${
                          isCritical
                            ? 'bg-status-violation-bg text-status-violation'
                            : isWarning
                            ? 'bg-status-warning-bg text-status-warning'
                            : 'bg-surface-panel text-secondary'
                        }`}
                      >
                        {isCritical ? 'Critical Breach' : isWarning ? 'Warning' : 'Resolved'}
                      </span>
                    </div>

                    <div className="pl-1">
                      <h4 className="font-headline-sm text-sm text-on-surface font-bold leading-tight">
                        {inc.classification}
                      </h4>
                      <p className="font-body-sm text-secondary mt-0.5 text-xs">
                        {inc.description}
                      </p>
                    </div>

                    {/* Incident Snapshot Preview */}
                    <div
                      onClick={() => onOpenSnapshot(inc)}
                      className="pl-1 flex gap-space-sm items-center bg-surface-panel p-2 rounded-lg cursor-pointer hover:bg-surface-container transition-colors"
                    >
                      <div className="w-16 h-12 rounded overflow-hidden relative shrink-0">
                        <img
                          alt={inc.snapshotAlt}
                          className="w-full h-full object-cover"
                          src={inc.snapshotUrl}
                        />
                        <span className="absolute bottom-0 right-0 bg-status-violation text-on-error font-label-sm text-[8px] px-1 font-bold">
                          AI {inc.aiConfidence}%
                        </span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-sm text-xs text-on-surface font-semibold truncate">
                          Worker #{inc.worker.id} ({inc.worker.name})
                        </span>
                        <span className="font-label-sm text-[10px] text-secondary truncate">
                          {inc.zoneName}
                        </span>
                      </div>
                    </div>

                    {/* Escalation & Resolution Controls */}
                    <div className="pl-1 pt-1 flex items-center justify-between gap-space-xs">
                      {isAcknowledged ? (
                        <div className="flex items-center gap-1 text-xs text-status-safe font-semibold py-1">
                          <span className="material-symbols-outlined text-sm">check_circle</span>
                          <span>Shift Lead Acknowledged</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => onAcknowledgeIncident(inc.id)}
                          className="action-review-btn flex-1 py-1.5 rounded-lg bg-on-surface text-surface-card hover:bg-neutral-800 font-label-sm text-xs font-semibold inline-flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-xs">done</span>
                          <span>Review &amp; Log</span>
                        </button>
                      )}

                      <button
                        onClick={() => onOpenDispatch(inc)}
                        className="action-dispatch-btn flex-1 py-1.5 rounded-lg bg-status-violation text-on-error hover:bg-red-700 font-label-sm text-xs font-semibold inline-flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-xs">priority_high</span>
                        <span>Quick Dispatch</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Shift Overview Quick Stats Banner */}
            <div className="bg-surface-card p-space-md rounded-xl shadow-xs border border-border-subtle flex flex-col gap-space-xs border-t-2 border-t-primary">
              <span className="font-label-sm text-secondary uppercase font-semibold">
                Shift Supervisor Note
              </span>
              <p className="font-body-sm text-on-surface-variant text-xs">
                Morning briefing conducted at 06:00. Kitchen team reminded of zero-tolerance policy for unwashed bare hand contact during prep peak.
              </p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-subtle text-secondary font-label-sm">
                <span>Next Briefing: 14:00 (Evening Crew)</span>
                <span className="text-primary font-semibold">Active Shift: AM-1</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
