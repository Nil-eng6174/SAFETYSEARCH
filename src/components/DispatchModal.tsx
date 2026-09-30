import React from 'react';
import { Incident } from '../types';

interface DispatchModalProps {
  isOpen: boolean;
  incident: Incident | null;
  onClose: () => void;
  onConfirm: (incident: Incident) => void;
}

export const DispatchModal: React.FC<DispatchModalProps> = ({
  isOpen,
  incident,
  onClose,
  onConfirm
}) => {
  if (!isOpen || !incident) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-space-xl flex flex-col gap-space-md border border-border-strong animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-1 border-b border-border-subtle">
          <div className="flex items-center gap-2 text-status-violation font-headline-sm font-bold">
            <span className="material-symbols-outlined text-2xl">emergency_home</span>
            <span>Dispatch Safety Alert</span>
          </div>
          <button
            onClick={onClose}
            className="text-secondary hover:text-on-surface p-1 rounded-md hover:bg-surface-panel transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Description */}
        <p className="font-body-md text-body-md text-on-surface-variant">
          This will immediately ping the Chef de Cuisine, shift supervisor pager, and initiate an edge snapshot log for:
        </p>

        {/* Infraction Card */}
        <div className="bg-status-violation-bg p-space-md rounded-lg border border-status-violation-border font-label-sm text-status-violation flex flex-col gap-1">
          <strong className="flex items-center gap-1.5 font-bold">
            <span className="material-symbols-outlined text-base">warning</span>
            {incident.cameraName}: {incident.classification}
          </strong>
          <span className="text-on-surface text-xs font-normal">
            Location: {incident.zoneName} ({incident.worker.name} - #{incident.worker.id})
          </span>
          <span className="text-secondary text-[11px] font-mono mt-0.5">
            Detection Confidence: {incident.aiConfidence}% · Log: {incident.id}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-space-sm mt-3 pt-2 border-t border-border-subtle">
          <button
            onClick={onClose}
            className="px-space-md py-2 rounded-lg bg-surface-panel hover:bg-surface-container font-label-md text-secondary text-xs cursor-pointer transition-colors"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(incident)}
            className="px-space-md py-2 rounded-lg bg-status-violation text-on-error hover:bg-red-700 font-label-md text-xs font-semibold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">campaign</span>
            <span>Confirm &amp; Alert Kitchen Pager</span>
          </button>
        </div>
      </div>
    </div>
  );
};
