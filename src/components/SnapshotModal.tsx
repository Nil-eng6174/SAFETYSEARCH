import React, { useState } from 'react';
import { Incident } from '../types';

interface SnapshotModalProps {
  isOpen: boolean;
  incident: Incident | null;
  onClose: () => void;
  onAddNote: (incidentId: string, note: string) => void;
  onEscalate: (incidentId: string) => void;
}

export const SnapshotModal: React.FC<SnapshotModalProps> = ({
  isOpen,
  incident,
  onClose,
  onAddNote,
  onEscalate
}) => {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState('');

  if (!isOpen || !incident) return null;

  const handleSaveNote = () => {
    if (noteText.trim()) {
      onAddNote(incident.id, noteText);
      setNoteText('');
      setShowNoteInput(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-xs flex items-center justify-center p-space-md">
      <div className="bg-surface-card rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col border border-border-strong animate-in fade-in zoom-in duration-150">
        {/* Modal Header */}
        <div className="px-space-lg py-space-md bg-surface-panel flex items-center justify-between border-b border-border-subtle">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-status-violation">center_focus_strong</span>
            <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">
              {incident.id}
            </span>
            <span className="px-2 py-0.5 rounded bg-status-safe-bg text-status-safe font-label-sm text-label-sm font-bold">
              {incident.aiConfidence}% Confidence
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-secondary hover:text-on-surface p-1 rounded hover:bg-surface-card transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Modal Body Preview */}
        <div className="p-space-lg flex flex-col gap-space-md">
          {/* Expanded Image Feed with Bounding Box Simulator */}
          <div className="relative w-full h-80 bg-inverse-surface rounded-lg overflow-hidden flex items-center justify-center">
            <img
              alt={incident.snapshotAlt}
              className="w-full h-full object-cover"
              src={incident.snapshotUrl}
            />

            {/* Tactical HUD Telemetry Overlay */}
            <div className="absolute top-3 left-3 bg-inverse-surface/85 backdrop-blur-sm px-2.5 py-1.5 rounded text-white font-label-sm text-[10px] space-y-0.5 border border-white/10">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-status-violation animate-ping"></span>
                <span className="font-bold tracking-wider uppercase text-status-violation">
                  Inference Target: {incident.classification}
                </span>
              </div>
              <div className="text-border-subtle">
                {incident.zoneName}
              </div>
            </div>

            {/* Bounding Box Simulation Overlay */}
            <div className="absolute top-1/3 left-1/4 w-48 h-36 border-2 border-status-violation rounded bg-status-violation/15 flex flex-col justify-between p-1.5 pointer-events-none shadow-lg">
              <span className="bg-status-violation text-on-error font-label-sm text-[9px] px-1 py-0.5 rounded self-start font-bold">
                MISSING_PPE: {incident.classification.toUpperCase()} ({incident.aiConfidence}%)
              </span>
              <span className="text-white font-label-sm text-[8px] bg-inverse-surface/90 px-1 py-0.5 rounded self-end">
                NODE_ID: {incident.cameraId.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Telemetry Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm bg-surface-base p-space-md rounded-lg border border-border-subtle">
            <div>
              <span className="font-label-sm text-[10px] text-secondary uppercase block font-semibold">
                Worker Target
              </span>
              <span className="font-label-md text-label-md font-semibold text-on-surface">
                {incident.worker.name}
              </span>
            </div>
            <div>
              <span className="font-label-sm text-[10px] text-secondary uppercase block font-semibold">
                Violation Class
              </span>
              <span className={`font-label-md text-label-md font-semibold ${incident.severity === 'critical' ? 'text-status-violation' : 'text-status-warning'}`}>
                {incident.classification}
              </span>
            </div>
            <div>
              <span className="font-label-sm text-[10px] text-secondary uppercase block font-semibold">
                Timestamp
              </span>
              <span className="font-label-md text-label-md font-semibold text-on-surface font-mono">
                {incident.timeString}
              </span>
            </div>
            <div>
              <span className="font-label-sm text-[10px] text-secondary uppercase block font-semibold">
                Severity Tier
              </span>
              <span className={`font-label-md text-label-md font-semibold ${incident.severity === 'critical' ? 'text-status-violation' : 'text-status-warning'}`}>
                {incident.severity === 'critical' ? 'Tier 1 (Critical)' : 'Tier 2 (Warning)'}
              </span>
            </div>
          </div>

          {/* Supervisor Note Input / Display */}
          {incident.supervisorNote && (
            <div className="p-space-sm rounded-lg bg-surface-panel border border-border-subtle text-xs">
              <span className="font-bold text-on-surface block mb-1">Supervisor Note:</span>
              <p className="text-secondary">{incident.supervisorNote}</p>
            </div>
          )}

          {showNoteInput && (
            <div className="flex flex-col gap-2 pt-2 border-t border-border-subtle">
              <textarea
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Enter supervisor observation or corrective action details..."
                rows={2}
                className="w-full bg-surface-panel p-2 rounded text-xs border border-border-strong focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNoteInput(false)}
                  className="px-2 py-1 text-xs text-secondary hover:text-on-surface"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveNote}
                  className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded"
                >
                  Save Note
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-space-lg py-space-md bg-surface-panel flex items-center justify-between border-t border-border-subtle">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-surface-card hover:bg-surface-base text-on-surface font-label-md text-label-md transition-colors shadow-sm cursor-pointer"
            type="button"
          >
            Dismiss
          </button>
          <div className="flex items-center gap-space-sm">
            <button
              onClick={() => setShowNoteInput(!showNoteInput)}
              className="px-4 py-2 rounded bg-surface-card hover:bg-surface-base text-on-surface font-label-md text-label-md transition-colors shadow-sm cursor-pointer"
              type="button"
            >
              Add Supervisor Note
            </button>
            <button
              onClick={() => {
                onEscalate(incident.id);
                onClose();
              }}
              className="px-4 py-2 rounded bg-status-violation text-on-error font-label-md text-label-md font-semibold hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
              type="button"
            >
              Escalate Incident
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
