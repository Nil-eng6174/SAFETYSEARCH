import React, { useState } from 'react';
import { CameraFeed } from '../types';

interface AddCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCamera: (newCam: Partial<CameraFeed>) => void;
}

export const AddCameraModal: React.FC<AddCameraModalProps> = ({
  isOpen,
  onClose,
  onAddCamera
}) => {
  const [name, setName] = useState('');
  const [rtspUrl, setRtspUrl] = useState('');
  const [zone, setZone] = useState('Kitchen - Food Prep');
  const [fps, setFps] = useState(30);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !rtspUrl) return;

    onAddCamera({
      name: name.toUpperCase(),
      subZone: zone,
      rtspUrl,
      fps,
      resolution: '1080p',
      status: 'online',
      latencyMs: Math.floor(Math.random() * 10) + 18,
      bitrate: '4.0 Mbps'
    });

    setName('');
    setRtspUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-space-md">
      <div className="bg-surface-card rounded-xl shadow-2xl max-w-lg w-full p-space-xl flex flex-col gap-space-lg transform transition-all border border-border-strong animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-xl">add_a_photo</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              Connect New Camera Stream
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-secondary hover:text-on-surface p-1 rounded cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
              Camera Friendly Name
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-space-md py-2 rounded-lg bg-surface-panel font-label-md text-label-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary border border-border-subtle"
              placeholder="e.g. Pastry Station East"
              required
              type="text"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
              RTSP Stream URL or Webcam Index
            </label>
            <input
              value={rtspUrl}
              onChange={e => setRtspUrl(e.target.value)}
              className="w-full px-space-md py-2 rounded-lg bg-surface-panel font-mono text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary border border-border-subtle"
              placeholder="rtsp://192.168.1.135:554/live/ch0 or /dev/video0"
              required
              type="text"
            />
          </div>

          <div className="grid grid-cols-2 gap-space-md">
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
                Assigned Hotel Zone
              </label>
              <select
                value={zone}
                onChange={e => setZone(e.target.value)}
                className="w-full px-space-md py-2 rounded-lg bg-surface-panel font-label-md text-label-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary border border-border-subtle cursor-pointer"
              >
                <option>Kitchen - Food Prep</option>
                <option>Kitchen - Dishwashing</option>
                <option>Bakery &amp; Pastry</option>
                <option>Laundry &amp; Housekeeping</option>
                <option>Stewarding &amp; Chemical Storage</option>
                <option>Loading Bay &amp; Logistics</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
                FPS Ingestion Target
              </label>
              <select
                value={fps}
                onChange={e => setFps(Number(e.target.value))}
                className="w-full px-space-md py-2 rounded-lg bg-surface-panel font-label-md text-label-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary border border-border-subtle cursor-pointer"
              >
                <option value={30}>30 FPS (Full Stream)</option>
                <option value={25}>25 FPS (Standard)</option>
                <option value={15}>15 FPS (Bandwidth Saver)</option>
              </select>
            </div>
          </div>

          <div className="p-space-md rounded-lg bg-surface-panel flex items-start gap-space-xs text-secondary font-body-sm text-xs border border-border-subtle">
            <span className="material-symbols-outlined text-base text-primary shrink-0">info</span>
            <span>
              New streams undergo a 5-second automatic optical calibration test to assess lighting contrast and distortion before joining the active inference batch.
            </span>
          </div>

          <div className="flex items-center justify-end gap-space-sm pt-space-xs border-t border-border-subtle">
            <button
              onClick={onClose}
              className="px-space-md py-2 rounded-lg bg-surface-panel hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors cursor-pointer"
              type="button"
            >
              Cancel
            </button>
            <button
              className="px-space-xl py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold transition-all shadow-sm cursor-pointer"
              type="submit"
            >
              Save &amp; Start Ingestion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
