import React, { useState } from 'react';

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendBroadcast: (message: string, targetZones: string[]) => void;
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({
  isOpen,
  onClose,
  onSendBroadcast
}) => {
  const [selectedZones, setSelectedZones] = useState<string[]>(['Kitchen & Hot Line', 'Prep & Cold Storage']);
  const [customMessage, setCustomMessage] = useState(
    'Attention kitchen and prep team: Mandatory PPE protocol check in progress. Verify hairnets and protective gloves now.'
  );

  if (!isOpen) return null;

  const presets = [
    'Attention kitchen and prep team: Mandatory PPE protocol check in progress. Verify hairnets and protective gloves now.',
    'Urgent safety alert: Stewarding staff please ensure certified chemical splash goggles are worn before detergent replenishment.',
    'Sanitation reminder: Clean hands and fresh nitrile gloves required before touching plating surfaces.',
    'Emergency corridor clearance: Housekeeping carts must maintain 36-inch clearance from fire egress doors.'
  ];

  const zones = [
    'All Zones (Hotel-wide)',
    'Kitchen & Hot Line',
    'Prep & Cold Storage',
    'Stewarding & Dishwash',
    'Housekeeping Floors',
    'Receiving & Loading Dock'
  ];

  const toggleZone = (z: string) => {
    if (z === 'All Zones (Hotel-wide)') {
      setSelectedZones(['All Zones (Hotel-wide)']);
      return;
    }
    const filtered = selectedZones.filter(item => item !== 'All Zones (Hotel-wide)');
    if (filtered.includes(z)) {
      setSelectedZones(filtered.filter(item => item !== z));
    } else {
      setSelectedZones([...filtered, z]);
    }
  };

  const handleSend = () => {
    if (!customMessage.trim()) return;
    onSendBroadcast(customMessage, selectedZones);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-space-xl flex flex-col gap-space-md border border-border-strong animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
          <div className="flex items-center gap-2 text-primary font-headline-sm font-bold">
            <span className="material-symbols-outlined text-2xl">campaign</span>
            <span>Broadcast PA Safety Announcement</span>
          </div>
          <button
            onClick={onClose}
            className="text-secondary hover:text-on-surface p-1 rounded cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-label-sm text-secondary uppercase font-semibold text-xs">
            Target Speaker Zones
          </label>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {zones.map(z => {
              const active = selectedZones.includes(z);
              return (
                <button
                  key={z}
                  type="button"
                  onClick={() => toggleZone(z)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                    active
                      ? 'bg-primary text-white font-semibold'
                      : 'bg-surface-panel text-secondary hover:text-on-surface'
                  }`}
                >
                  {z}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-label-sm text-secondary uppercase font-semibold text-xs">
            Quick Audio Presets
          </label>
          <div className="flex flex-col gap-1 max-h-36 overflow-y-auto pr-1">
            {presets.map((msg, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCustomMessage(msg)}
                className="text-left text-xs p-2 rounded bg-surface-panel hover:bg-surface-container text-on-surface-variant transition-colors"
              >
                "{msg}"
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-label-sm text-secondary uppercase font-semibold text-xs">
            Announcement Script / Speech-to-Text
          </label>
          <textarea
            value={customMessage}
            onChange={e => setCustomMessage(e.target.value)}
            rows={3}
            className="w-full bg-surface-panel border border-border-subtle p-2 rounded text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex items-center justify-end gap-space-sm pt-2 border-t border-border-subtle">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded text-xs text-secondary hover:text-on-surface"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            className="px-4 py-2 rounded bg-primary text-white font-semibold text-xs flex items-center gap-1.5 hover:bg-primary-container shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">volume_up</span>
            <span>Broadcast Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
