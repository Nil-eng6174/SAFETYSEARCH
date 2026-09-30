import React, { useState, useMemo } from 'react';
import { Incident } from '../types';

interface LogsReportsViewProps {
  incidents: Incident[];
  onOpenSnapshot: (incident: Incident) => void;
  onOpenReview: (incident: Incident) => void;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

export const LogsReportsView: React.FC<LogsReportsViewProps> = ({
  incidents,
  onOpenSnapshot,
  onOpenReview,
  onShowToast
}) => {
  const [dateFilter, setDateFilter] = useState<'today' | 'yesterday' | '7d' | 'mtd' | 'custom'>('7d');
  const [locationFilter, setLocationFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryPill, setCategoryPill] = useState<'all' | 'gloves' | 'hairnet' | 'goggles' | 'footwear'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleEmail, setScheduleEmail] = useState('elena.rostova@grandplaza.com');
  const [scheduleFrequency, setScheduleFrequency] = useState('Daily Morning Summary (06:00)');

  // Filtered dataset
  const filteredIncidents = useMemo(() => {
    return incidents.filter(inc => {
      // Category pill filter
      if (categoryPill !== 'all' && inc.category !== categoryPill) {
        return false;
      }
      // Status dropdown filter
      if (statusFilter !== 'all' && inc.status !== statusFilter) {
        return false;
      }
      // Location dropdown filter
      if (locationFilter !== 'all') {
        if (locationFilter === 'kitchen-1' && !inc.zoneName.includes('Kitchen Station #1')) return false;
        if (locationFilter === 'prep-2' && !inc.zoneName.includes('Prep Line #2')) return false;
        if (locationFilter === 'stewarding' && !inc.zoneName.includes('Stewarding')) return false;
        if (locationFilter === 'laundry' && !inc.zoneName.includes('Laundry')) return false;
        if (locationFilter === 'dock' && !inc.zoneName.includes('Dock') && !inc.zoneName.includes('Receiving')) return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesId = inc.id.toLowerCase().includes(query);
        const matchesWorker = inc.worker.name.toLowerCase().includes(query) || inc.worker.id.toLowerCase().includes(query);
        const matchesClass = inc.classification.toLowerCase().includes(query);
        if (!matchesId && !matchesWorker && !matchesClass) {
          return false;
        }
      }
      return true;
    });
  }, [incidents, categoryPill, statusFilter, locationFilter, searchTerm]);

  // Pagination (6 items per page for clean table view)
  const pageSize = 6;
  const totalPages = Math.ceil(filteredIncidents.length / pageSize) || 1;
  const paginatedIncidents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredIncidents.slice(start, start + pageSize);
  }, [filteredIncidents, currentPage]);

  const handleExportCSV = () => {
    onShowToast('Generating CSV: 42 verified incidents exported for timeframe Oct 18 - Oct 24.');
    const headers = ['Incident_ID', 'Date', 'Time', 'Camera_Zone', 'Violation_Class', 'Worker_ID', 'Worker_Name', 'Confidence', 'Status'];
    const rows = filteredIncidents.map(i => [
      i.id,
      i.date,
      i.timeString,
      `"${i.zoneName}"`,
      `"${i.classification}"`,
      i.worker.id,
      `"${i.worker.name}"`,
      `${i.aiConfidence}%`,
      i.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `SafeStay_Compliance_Audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    onShowToast('Compiling Executive PDF Compliance Audit for SafeStay Guard Station GP-04...');
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowScheduleModal(false);
    onShowToast(`Automated report schedule committed: ${scheduleFrequency} to ${scheduleEmail}`);
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Command Header & Filter Bar Area */}
      <div className="w-full bg-surface-card shadow-xs border-b border-border-subtle px-margin py-space-lg flex flex-col gap-space-lg">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-md">
          <div className="flex flex-col">
            <div className="flex items-center gap-space-sm mb-1">
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold">
                Incident Audit Archive
              </span>
              <span className="text-secondary font-label-sm text-label-sm">•</span>
              <span className="font-label-sm text-label-sm text-secondary">
                Telemetry Node GP-04-A
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
              Safety Logs &amp; Compliance Analytics
            </h1>
            <p className="font-body-md text-body-md text-secondary">
              Historical log of AI-detected PPE infractions and multi-spectral edge safety telemetry.
            </p>
          </div>

          {/* Quick Export & Reporting Suite */}
          <div className="flex flex-wrap items-center gap-space-sm">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-space-xs px-space-md py-2 rounded bg-surface-panel hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors shadow-xs border border-border-subtle cursor-pointer"
              id="btn-export-csv"
              type="button"
            >
              <span className="material-symbols-outlined text-sm text-secondary">table_view</span>
              Export CSV
            </button>
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-space-xs px-space-md py-2 rounded bg-surface-panel hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors shadow-xs border border-border-subtle cursor-pointer"
              id="btn-download-pdf"
              type="button"
            >
              <span className="material-symbols-outlined text-sm text-secondary">picture_as_pdf</span>
              Compliance PDF
            </button>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="inline-flex items-center gap-space-xs px-space-md py-2 rounded bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors shadow-xs cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-sm">event_repeat</span>
              Schedule Automated Report
            </button>
          </div>
        </div>

        {/* Parameter Filter Matrix */}
        <div className="bg-surface-base p-space-md rounded-lg flex flex-col lg:flex-row lg:items-center justify-between gap-space-md border border-border-subtle">
          {/* Left Filters */}
          <div className="flex flex-wrap items-center gap-space-md">
            {/* Date Selector Preset Group */}
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-secondary uppercase font-semibold">
                Observation Period
              </label>
              <div className="flex items-center bg-surface-card rounded shadow-xs p-0.5 border border-border-subtle">
                <button
                  type="button"
                  onClick={() => setDateFilter('today')}
                  className={`filter-date-btn px-space-sm py-1 rounded font-label-sm text-label-sm cursor-pointer transition-colors ${
                    dateFilter === 'today' ? 'bg-primary text-on-primary font-semibold' : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setDateFilter('yesterday')}
                  className={`filter-date-btn px-space-sm py-1 rounded font-label-sm text-label-sm cursor-pointer transition-colors ${
                    dateFilter === 'yesterday' ? 'bg-primary text-on-primary font-semibold' : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  Yesterday
                </button>
                <button
                  type="button"
                  onClick={() => setDateFilter('7d')}
                  className={`filter-date-btn px-space-sm py-1 rounded font-label-sm text-label-sm cursor-pointer transition-colors ${
                    dateFilter === '7d' ? 'bg-primary text-on-primary font-semibold' : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  Last 7D
                </button>
                <button
                  type="button"
                  onClick={() => setDateFilter('mtd')}
                  className={`filter-date-btn px-space-sm py-1 rounded font-label-sm text-label-sm cursor-pointer transition-colors ${
                    dateFilter === 'mtd' ? 'bg-primary text-on-primary font-semibold' : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  MTD
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDateFilter('custom');
                    onShowToast('Custom Date Range: Oct 18 - Oct 24 active.');
                  }}
                  className={`filter-date-btn px-space-sm py-1 rounded font-label-sm text-label-sm cursor-pointer transition-colors flex items-center gap-1 ${
                    dateFilter === 'custom' ? 'bg-primary text-on-primary font-semibold' : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  <span>Oct 18 - Oct 24</span>
                  <span className="material-symbols-outlined text-xs">calendar_today</span>
                </button>
              </div>
            </div>

            {/* Camera Node Selector */}
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-secondary uppercase font-semibold">
                Sensor Location
              </label>
              <div className="relative min-w-[210px]">
                <select
                  value={locationFilter}
                  onChange={e => setLocationFilter(e.target.value)}
                  className="w-full appearance-none bg-surface-card text-on-surface font-label-md text-label-md px-3 py-1.5 rounded shadow-xs focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer pr-8 border border-border-subtle"
                  id="camera-filter"
                >
                  <option value="all">All Locations (5 Feeds Active)</option>
                  <option value="kitchen-1">Kitchen Station #1 (Prep Cold Area)</option>
                  <option value="prep-2">Prep Line #2 (Main Hot Line)</option>
                  <option value="stewarding">Stewarding &amp; Dish Pit Zone</option>
                  <option value="laundry">Commercial Laundry Bay</option>
                  <option value="dock">Receiving &amp; Loading Dock</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none text-base">
                  expand_more
                </span>
              </div>
            </div>

            {/* Review Status Filter */}
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-secondary uppercase font-semibold">
                Review State
              </label>
              <div className="relative min-w-[170px]">
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="w-full appearance-none bg-surface-card text-on-surface font-label-md text-label-md px-3 py-1.5 rounded shadow-xs focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer pr-8 border border-border-subtle"
                  id="status-filter"
                >
                  <option value="all">All Incident Statuses</option>
                  <option value="unreviewed">Unreviewed (Needs Action)</option>
                  <option value="acknowledged">Acknowledged</option>
                  <option value="escalated">Escalated to GM</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none text-base">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Search Input */}
          <div className="flex flex-col gap-1 min-w-[240px]">
            <label className="font-label-sm text-label-sm text-secondary uppercase font-semibold">
              Incident / Personnel ID
            </label>
            <div className="relative">
              <input
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-surface-card text-on-surface placeholder:text-secondary font-label-md text-label-md pl-8 pr-3 py-1.5 rounded shadow-xs focus:outline-none focus:ring-1 focus:ring-primary border border-border-subtle"
                id="table-search"
                placeholder="Filter by ID (e.g. #SEC-8921)..."
                type="text"
              />
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-secondary text-sm">
                search
              </span>
            </div>
          </div>
        </div>

        {/* Multiselect Violation Classification Pills */}
        <div className="flex flex-wrap items-center gap-space-xs pt-1">
          <span className="font-label-sm text-label-sm text-secondary uppercase mr-space-sm font-semibold">
            Violation Category:
          </span>
          <button
            type="button"
            onClick={() => {
              setCategoryPill('all');
              setCurrentPage(1);
            }}
            className={`violation-pill px-3 py-1 rounded font-label-sm text-label-sm font-medium shadow-xs transition-all cursor-pointer ${
              categoryPill === 'all'
                ? 'bg-on-background text-on-primary'
                : 'bg-surface-panel hover:bg-surface-container text-on-surface'
            }`}
          >
            All Categories (42)
          </button>
          <button
            type="button"
            onClick={() => {
              setCategoryPill('gloves');
              setCurrentPage(1);
            }}
            className={`violation-pill px-3 py-1 rounded font-label-sm text-label-sm transition-all flex items-center gap-1.5 cursor-pointer ${
              categoryPill === 'gloves'
                ? 'bg-on-background text-on-primary font-medium'
                : 'bg-surface-panel hover:bg-surface-container text-on-surface'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-status-violation"></span>
            <span>Missing Gloves (18)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setCategoryPill('hairnet');
              setCurrentPage(1);
            }}
            className={`violation-pill px-3 py-1 rounded font-label-sm text-label-sm transition-all flex items-center gap-1.5 cursor-pointer ${
              categoryPill === 'hairnet'
                ? 'bg-on-background text-on-primary font-medium'
                : 'bg-surface-panel hover:bg-surface-container text-on-surface'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-status-warning"></span>
            <span>No Hairnet/Cap (12)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setCategoryPill('goggles');
              setCurrentPage(1);
            }}
            className={`violation-pill px-3 py-1 rounded font-label-sm text-label-sm transition-all flex items-center gap-1.5 cursor-pointer ${
              categoryPill === 'goggles'
                ? 'bg-on-background text-on-primary font-medium'
                : 'bg-surface-panel hover:bg-surface-container text-on-surface'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-tertiary"></span>
            <span>Missing Eye Protection (8)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setCategoryPill('footwear');
              setCurrentPage(1);
            }}
            className={`violation-pill px-3 py-1 rounded font-label-sm text-label-sm transition-all flex items-center gap-1.5 cursor-pointer ${
              categoryPill === 'footwear'
                ? 'bg-on-background text-on-primary font-medium'
                : 'bg-surface-panel hover:bg-surface-container text-on-surface'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span>Non-Compliant Footwear (4)</span>
          </button>
        </div>
      </div>

      {/* Main Telemetry Body */}
      <div className="w-full px-margin py-space-xl flex flex-col gap-space-xl max-w-[1920px] mx-auto">
        {/* Top KPI Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-space-lg">
          {/* Metric 1: Total Infractions */}
          <div className="bg-surface-card p-space-lg rounded-xl shadow-xs border border-border-subtle flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-status-warning"></div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-sm text-label-sm uppercase text-secondary font-semibold">
                Total PPE Infractions
              </span>
              <span className="inline-flex p-1.5 rounded-md bg-status-warning-bg text-status-warning">
                <span className="material-symbols-outlined text-base">report_problem</span>
              </span>
            </div>
            <div className="flex items-baseline gap-space-sm mb-1">
              <span className="font-metric-display text-metric-display font-bold text-on-surface">
                42
              </span>
              <span className="font-label-md text-label-md text-status-safe font-semibold flex items-center">
                <span className="material-symbols-outlined text-sm">trending_down</span> -14.2%
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-secondary">
              vs. prior 7-day observation window (49)
            </span>
          </div>

          {/* Metric 2: Mean Resolution Time */}
          <div className="bg-surface-card p-space-lg rounded-xl shadow-xs border border-border-subtle flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-sm text-label-sm uppercase text-secondary font-semibold">
                Mean Supervisor Response
              </span>
              <span className="inline-flex p-1.5 rounded-md bg-status-safe-bg text-status-safe">
                <span className="material-symbols-outlined text-base">timer</span>
              </span>
            </div>
            <div className="flex items-baseline gap-space-sm mb-1">
              <span className="font-metric-display text-metric-display font-bold text-on-surface">
                4.2
              </span>
              <span className="font-label-lg text-label-lg font-medium text-secondary">mins</span>
              <span className="font-label-md text-label-md text-status-safe font-semibold ml-auto flex items-center">
                <span className="material-symbols-outlined text-sm">arrow_downward</span> -1.1m
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-secondary">Target SLA: under 10.0 minutes</span>
          </div>

          {/* Metric 3: Repeat Offender Rate */}
          <div className="bg-surface-card p-space-lg rounded-xl shadow-xs border border-border-subtle flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-status-safe"></div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-sm text-label-sm uppercase text-secondary font-semibold">
                Repeat Breaches
              </span>
              <span className="inline-flex p-1.5 rounded-md bg-status-safe-bg text-status-safe">
                <span className="material-symbols-outlined text-base">verified_user</span>
              </span>
            </div>
            <div className="flex items-baseline gap-space-sm mb-1">
              <span className="font-metric-display text-metric-display font-bold text-status-safe">
                0
              </span>
              <span className="font-label-md text-label-md text-status-safe font-semibold bg-status-safe-bg px-2 py-0.5 rounded ml-2 border border-status-safe-border">
                Target Achieved
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-secondary">
              Zero secondary breaches recorded post-coaching
            </span>
          </div>

          {/* Metric 4: Gross Shift Safety Index */}
          <div className="bg-surface-card p-space-lg rounded-xl shadow-xs border border-border-subtle flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-tertiary"></div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-sm text-label-sm uppercase text-secondary font-semibold">
                Current Audit Compliance
              </span>
              <span className="inline-flex p-1.5 rounded-md bg-surface-container text-tertiary">
                <span className="material-symbols-outlined text-base">analytics</span>
              </span>
            </div>
            <div className="flex items-baseline gap-space-sm mb-1">
              <span className="font-metric-display text-metric-display font-bold text-on-surface">
                97.8%
              </span>
              <span className="font-label-sm text-label-sm text-secondary ml-1">/ 98.5% goal</span>
            </div>
            <div className="w-full bg-surface-panel h-2 rounded-full overflow-hidden mt-1 border border-border-subtle">
              <div className="bg-primary h-full rounded-full transition-all" style={{ width: '97.8%' }}></div>
            </div>
          </div>
        </div>

        {/* Analytics Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          {/* Left Chart: Violations by Day of Week (7 Cols) */}
          <div className="lg:col-span-7 bg-surface-card p-space-xl rounded-xl shadow-xs border border-border-subtle flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-md gap-space-sm">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold tracking-tight">
                  Violations by Day of Week
                </h2>
                <p className="font-label-sm text-label-sm text-secondary">
                  Trailing 7 Calendar Days with 7-Day Running Benchmark Mean
                </p>
              </div>
              <div className="flex items-center gap-space-md">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-primary"></span>
                  <span className="font-label-sm text-label-sm text-secondary">Infractions</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-status-warning"></span>
                  <span className="font-label-sm text-label-sm text-secondary">Benchmark (6.0/d)</span>
                </div>
              </div>
            </div>

            {/* Custom Bar Chart SVG Simulation */}
            <div className="w-full mt-4 h-64 flex flex-col justify-end relative">
              {/* Benchmark Line Guide at 6.0 */}
              <div className="absolute left-10 right-2 top-[50%] flex items-center pointer-events-none z-10">
                <div className="w-full border-t border-dashed border-status-warning opacity-70"></div>
                <span className="font-label-sm text-[9px] font-semibold text-status-warning bg-surface-card px-1 ml-1 shrink-0">
                  AVG 6.0
                </span>
              </div>

              {/* Horizontal Grid Lines */}
              <div className="absolute left-10 right-0 top-0 border-b border-surface-panel"></div>
              <div className="absolute left-10 right-0 top-[25%] border-b border-surface-panel"></div>
              <div className="absolute left-10 right-0 top-[50%] border-b border-surface-panel"></div>
              <div className="absolute left-10 right-0 top-[75%] border-b border-surface-panel"></div>
              <div className="absolute left-10 right-0 bottom-8 border-b border-border-strong"></div>

              {/* Y-Axis Labels */}
              <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between font-label-sm text-[10px] text-secondary w-8 text-right pr-2">
                <span>12</span>
                <span>9</span>
                <span>6</span>
                <span>3</span>
                <span>0</span>
              </div>

              {/* Bar Columns */}
              <div className="ml-10 h-full flex items-end justify-around pb-8 pt-4">
                {/* Mon: 8 */}
                <div className="flex flex-col items-center group relative h-full justify-end w-10">
                  <div className="font-label-sm text-label-sm text-on-surface font-semibold mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    8
                  </div>
                  <div className="w-7 bg-primary rounded-t group-hover:bg-primary-container transition-all" style={{ height: '66.6%' }}></div>
                  <span className="font-label-sm text-label-sm text-secondary mt-2">Mon</span>
                </div>

                {/* Tue: 5 */}
                <div className="flex flex-col items-center group relative h-full justify-end w-10">
                  <div className="font-label-sm text-label-sm text-on-surface font-semibold mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    5
                  </div>
                  <div className="w-7 bg-primary rounded-t group-hover:bg-primary-container transition-all" style={{ height: '41.6%' }}></div>
                  <span className="font-label-sm text-label-sm text-secondary mt-2">Tue</span>
                </div>

                {/* Wed: 11 (Peak) */}
                <div className="flex flex-col items-center group relative h-full justify-end w-10">
                  <span className="px-1 py-0.5 rounded bg-status-violation-bg text-status-violation font-label-sm text-[9px] font-bold absolute -top-1">
                    PEAK
                  </span>
                  <div className="font-label-sm text-label-sm text-status-violation font-bold mb-1">
                    11
                  </div>
                  <div className="w-7 bg-status-violation rounded-t group-hover:opacity-90 transition-all shadow-xs" style={{ height: '91.6%' }}></div>
                  <span className="font-label-sm text-label-sm text-on-surface font-bold mt-2">Wed</span>
                </div>

                {/* Thu: 4 */}
                <div className="flex flex-col items-center group relative h-full justify-end w-10">
                  <div className="font-label-sm text-label-sm text-on-surface font-semibold mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    4
                  </div>
                  <div className="w-7 bg-primary rounded-t group-hover:bg-primary-container transition-all" style={{ height: '33.3%' }}></div>
                  <span className="font-label-sm text-label-sm text-secondary mt-2">Thu</span>
                </div>

                {/* Fri: 9 */}
                <div className="flex flex-col items-center group relative h-full justify-end w-10">
                  <div className="font-label-sm text-label-sm text-on-surface font-semibold mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    9
                  </div>
                  <div className="w-7 bg-primary rounded-t group-hover:bg-primary-container transition-all" style={{ height: '75.0%' }}></div>
                  <span className="font-label-sm text-label-sm text-secondary mt-2">Fri</span>
                </div>

                {/* Sat: 3 */}
                <div className="flex flex-col items-center group relative h-full justify-end w-10">
                  <div className="font-label-sm text-label-sm text-on-surface font-semibold mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    3
                  </div>
                  <div className="w-7 bg-status-safe rounded-t group-hover:opacity-90 transition-all" style={{ height: '25.0%' }}></div>
                  <span className="font-label-sm text-label-sm text-secondary mt-2">Sat</span>
                </div>

                {/* Sun: 2 */}
                <div className="flex flex-col items-center group relative h-full justify-end w-10">
                  <div className="font-label-sm text-label-sm text-on-surface font-semibold mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    2
                  </div>
                  <div className="w-7 bg-status-safe rounded-t group-hover:opacity-90 transition-all" style={{ height: '16.6%' }}></div>
                  <span className="font-label-sm text-label-sm text-secondary mt-2">Sun</span>
                </div>
              </div>
            </div>

            <div className="mt-space-sm pt-space-sm bg-surface-panel p-space-sm rounded flex items-center justify-between border border-border-subtle">
              <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-primary">lightbulb</span>
                Insight: Wednesday rush hour (11:00-13:00) represents 45% of prep-line breaches.
              </span>
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                Total Sample: 42 Incidents
              </span>
            </div>
          </div>

          {/* Right Chart: Most Common Violation Types (5 Cols) */}
          <div className="lg:col-span-5 bg-surface-card p-space-xl rounded-xl shadow-xs border border-border-subtle flex flex-col justify-between">
            <div className="pb-space-sm">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold tracking-tight">
                Most Common Violation Types
              </h2>
              <p className="font-label-sm text-label-sm text-secondary">
                Distribution by flagged sensor taxonomy
              </p>
            </div>

            {/* Donut Vector Representation */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-space-lg py-4">
              <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-surface-panel"
                    cx="50"
                    cy="50"
                    fill="transparent"
                    r="38"
                    stroke="currentColor"
                    strokeWidth="16"
                  ></circle>
                  {/* Gloves: 43% */}
                  <circle
                    className="text-status-violation"
                    cx="50"
                    cy="50"
                    fill="transparent"
                    r="38"
                    stroke="currentColor"
                    strokeDasharray="102.6 238.7"
                    strokeDashoffset="0"
                    strokeWidth="16"
                  ></circle>
                  {/* Hairnet: 29% */}
                  <circle
                    className="text-status-warning"
                    cx="50"
                    cy="50"
                    fill="transparent"
                    r="38"
                    stroke="currentColor"
                    strokeDasharray="69.2 238.7"
                    strokeDashoffset="-102.6"
                    strokeWidth="16"
                  ></circle>
                  {/* Goggles: 19% */}
                  <circle
                    className="text-tertiary"
                    cx="50"
                    cy="50"
                    fill="transparent"
                    r="38"
                    stroke="currentColor"
                    strokeDasharray="45.3 238.7"
                    strokeDashoffset="-171.8"
                    strokeWidth="16"
                  ></circle>
                  {/* Footwear: 9% */}
                  <circle
                    className="text-secondary"
                    cx="50"
                    cy="50"
                    fill="transparent"
                    r="38"
                    stroke="currentColor"
                    strokeDasharray="21.5 238.7"
                    strokeDashoffset="-217.1"
                    strokeWidth="16"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="font-headline-lg text-headline-lg font-bold text-on-surface leading-none">
                    42
                  </span>
                  <span className="font-label-sm text-[10px] text-secondary uppercase font-semibold mt-0.5">
                    Events
                  </span>
                </div>
              </div>

              {/* Legend List */}
              <div className="flex flex-col gap-2.5 w-full">
                <div className="flex items-center justify-between text-on-surface">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-xs bg-status-violation"></span>
                    <span className="font-label-md text-label-md font-medium">Missing Gloves</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-label-sm text-label-sm font-semibold">18</span>
                    <span className="font-label-sm text-label-sm text-secondary w-8 text-right">43%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-on-surface">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-xs bg-status-warning"></span>
                    <span className="font-label-md text-label-md font-medium">No Hairnet / Cap</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-label-sm text-label-sm font-semibold">12</span>
                    <span className="font-label-sm text-label-sm text-secondary w-8 text-right">29%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-on-surface">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-xs bg-tertiary"></span>
                    <span className="font-label-md text-label-md font-medium">Eye Goggles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-label-sm text-label-sm font-semibold">8</span>
                    <span className="font-label-sm text-label-sm text-secondary w-8 text-right">19%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-on-surface">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-xs bg-secondary"></span>
                    <span className="font-label-md text-label-md font-medium">Footwear Breaches</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-label-sm text-label-sm font-semibold">4</span>
                    <span className="font-label-sm text-label-sm text-secondary w-8 text-right">9%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-space-sm rounded bg-status-violation-bg flex items-center justify-between border border-status-violation-border">
              <span className="font-label-sm text-label-sm text-status-violation font-medium">
                Primary Risk Factor: Raw Poultry Prep Glove Lapses
              </span>
              <span className="font-label-sm text-label-sm text-status-violation font-bold">
                Action Mandated
              </span>
            </div>
          </div>
        </div>

        {/* Historical Data Table Section */}
        <div className="w-full bg-surface-card rounded-xl shadow-xs border border-border-subtle overflow-hidden flex flex-col">
          {/* Table Header Bar */}
          <div className="px-space-xl py-space-lg flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm bg-surface-card border-b border-border-subtle">
            <div className="flex items-center gap-space-md">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Verified Incident Audit Log
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-panel text-on-surface font-label-sm text-label-sm font-semibold border border-border-subtle">
                {filteredIncidents.length} Records
              </span>
            </div>
            <div className="flex items-center gap-space-md">
              <span className="font-label-sm text-label-sm text-secondary">
                Showing {paginatedIncidents.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-
                {Math.min(currentPage * pageSize, filteredIncidents.length)} of {filteredIncidents.length} incidents
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded bg-surface-panel hover:bg-surface-container text-secondary disabled:opacity-40 cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="p-1 rounded bg-surface-panel hover:bg-surface-container text-on-surface disabled:opacity-40 cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* High-Density Responsive Table Container */}
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-panel text-secondary font-label-sm text-label-sm uppercase tracking-wider border-b border-border-subtle">
                  <th className="py-3 px-4 font-semibold">Incident ID &amp; Time</th>
                  <th className="py-3 px-4 font-semibold">Camera Node &amp; Zone</th>
                  <th className="py-3 px-4 font-semibold">Violation Classification</th>
                  <th className="py-3 px-4 font-semibold text-center">AI Snapshot</th>
                  <th className="py-3 px-4 font-semibold">Personnel / Target</th>
                  <th className="py-3 px-4 font-semibold text-right">Confidence</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-panel font-body-sm text-body-sm text-on-surface">
                {paginatedIncidents.map(inc => {
                  const isUnreviewed = inc.status === 'unreviewed';
                  const isEscalated = inc.status === 'escalated';

                  return (
                    <tr key={inc.id} className="hover:bg-surface-base transition-colors group">
                      {/* ID & Time */}
                      <td className="py-3.5 px-4 font-label-md text-label-md">
                        <div className="flex flex-col">
                          <span className="font-semibold text-primary font-mono">{inc.id}</span>
                          <span className="text-secondary text-[11px] font-mono">
                            {inc.date} · {inc.timeString}
                          </span>
                        </div>
                      </td>

                      {/* Camera & Zone */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-on-surface">
                            {inc.cameraName.replace(/CAM \d+ · /, '')}
                          </span>
                          <span className="text-secondary font-label-sm text-[10px]">
                            {inc.zoneName}
                          </span>
                        </div>
                      </td>

                      {/* Classification */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-label-sm text-label-sm font-semibold ${
                            inc.category === 'gloves'
                              ? 'bg-status-violation-bg text-status-violation border border-status-violation-border'
                              : inc.category === 'hairnet'
                              ? 'bg-status-warning-bg text-status-warning border border-status-warning-border'
                              : inc.category === 'goggles'
                              ? 'bg-tertiary/10 text-tertiary border border-tertiary/20'
                              : 'bg-surface-panel text-secondary border border-border-subtle'
                          }`}
                        >
                          <span className="material-symbols-outlined text-xs">
                            {inc.category === 'gloves'
                              ? 'back_hand'
                              : inc.category === 'hairnet'
                              ? 'face'
                              : inc.category === 'goggles'
                              ? 'visibility_off'
                              : 'roller_skating'}
                          </span>
                          {inc.classification}
                        </span>
                      </td>

                      {/* Snapshot Thumbnail */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => onOpenSnapshot(inc)}
                          className="relative inline-block cursor-pointer group/snap"
                        >
                          <img
                            alt={inc.snapshotAlt}
                            className="w-12 h-9 rounded object-cover shadow-xs group-hover/snap:ring-2 group-hover/snap:ring-primary transition-all border border-border-subtle"
                            src={inc.snapshotUrl}
                          />
                          <div className="absolute inset-0 bg-[#213145]/30 opacity-0 group-hover/snap:opacity-100 rounded flex items-center justify-center transition-opacity text-white">
                            <span className="material-symbols-outlined text-xs">zoom_in</span>
                          </div>
                        </button>
                      </td>

                      {/* Personnel */}
                      <td className="py-3.5 px-4 font-label-md text-label-md">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center font-label-sm text-[10px] font-bold text-on-surface">
                            {inc.worker.initials}
                          </span>
                          <div>
                            <span className="font-medium text-xs text-on-surface block">
                              {inc.worker.name}
                            </span>
                            <span className="text-secondary block text-[10px] font-mono">
                              ID: {inc.worker.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Confidence */}
                      <td className="py-3.5 px-4 text-right font-label-md text-label-md font-semibold text-on-surface font-mono">
                        {inc.aiConfidence}%
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {isUnreviewed ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-status-warning-bg text-status-warning font-label-sm text-label-sm font-semibold border border-status-warning-border">
                            <span className="w-1.5 h-1.5 rounded-full bg-status-warning animate-pulse"></span>
                            Unreviewed
                          </span>
                        ) : isEscalated ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-status-violation-bg text-status-violation font-label-sm text-label-sm font-semibold border border-status-violation-border">
                            <span className="material-symbols-outlined text-xs">priority_high</span>
                            Escalated (GM)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-status-safe-bg text-status-safe font-label-sm text-label-sm font-semibold border border-status-safe-border">
                            <span className="material-symbols-outlined text-xs">check</span>
                            Acknowledged
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        {isUnreviewed ? (
                          <button
                            onClick={() => onOpenReview(inc)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-on-background text-on-primary font-label-sm text-label-sm font-semibold hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
                            type="button"
                          >
                            Review
                          </button>
                        ) : (
                          <button
                            onClick={() => onOpenSnapshot(inc)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-panel hover:bg-surface-container text-on-surface font-label-sm text-label-sm transition-colors border border-border-subtle cursor-pointer"
                            type="button"
                          >
                            Details
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-space-xl py-space-md bg-surface-card flex flex-col sm:flex-row items-center justify-between gap-space-sm border-t border-border-subtle">
            <span className="font-label-sm text-label-sm text-secondary">
              Displaying rows {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredIncidents.length)} of {filteredIncidents.length} recorded anomalies
            </span>
            <div className="flex items-center gap-space-xs font-label-sm text-label-sm">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1.5 rounded font-semibold shadow-xs cursor-pointer transition-colors ${
                    currentPage === i + 1
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-panel hover:bg-surface-container text-on-surface'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              {currentPage < totalPages && (
                <button
                  type="button"
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="px-3 py-1.5 rounded bg-surface-panel hover:bg-surface-container text-on-surface cursor-pointer"
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Automated Report Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-space-xl flex flex-col gap-space-md border border-border-strong animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
              <div className="flex items-center gap-2 text-primary font-headline-sm font-semibold">
                <span className="material-symbols-outlined text-2xl">event_repeat</span>
                <span>Schedule Automated Compliance Report</span>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-secondary hover:text-on-surface p-1 rounded cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase font-bold text-secondary">Recipient Email</label>
                <input
                  type="email"
                  value={scheduleEmail}
                  onChange={e => setScheduleEmail(e.target.value)}
                  className="w-full bg-surface-panel border border-border-subtle p-2 rounded text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase font-bold text-secondary">Dispatch Cadence</label>
                <select
                  value={scheduleFrequency}
                  onChange={e => setScheduleFrequency(e.target.value)}
                  className="w-full bg-surface-panel border border-border-subtle p-2 rounded text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option>Daily Morning Summary (06:00)</option>
                  <option>End-of-Shift Digest (14:00 &amp; 22:00)</option>
                  <option>Weekly HACCP &amp; OSHA Audit (Mondays)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase font-bold text-secondary">Export Format</label>
                <div className="flex items-center gap-4 text-xs pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="format" defaultChecked className="accent-primary" />
                    <span>Executive PDF Summary</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="format" className="accent-primary" />
                    <span>Raw CSV Telemetry Data</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-3 py-1.5 text-xs text-secondary hover:text-on-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded hover:bg-primary-container shadow-xs cursor-pointer"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
