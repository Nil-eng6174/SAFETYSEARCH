import React, { useState } from 'react';
import { CameraFeed } from '../types';

interface PTZModalProps {
  isOpen: boolean;
  camera: CameraFeed | null;
  onClose: () => void;
}

export const PTZModal: React.FC<PTZModalProps> = ({
  isOpen,
  camera,
  onClose
}) => {
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [statusMessage, setStatusMessage] = useState('Servo motors calibrated. Ready.');

  if (!isOpen || !camera) return null;

  const handlePan = (dx: number, dy: number, dirText: string) => {
    setPanOffset(prev => ({
      x: Math.max(-40, Math.min(40, prev.x + dx)),
      y: Math.max(-40, Math.min(40, prev.y + dy))
    }));
    setStatusMessage(`Pan/Tilt adjusted: ${dirText} (X: ${panOffset.x + dx}°, Y: ${panOffset.y + dy}°)`);
  };

  const handleReset = () => {
    setPanOffset({ x: 0, y: 0 });
    setZoomLevel(1.0);
    setStatusMessage('Home position restored.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-space-xl flex flex-col gap-space-md border border-border-strong animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
          <div className="flex items-center gap-2 text-on-surface font-headline-sm font-semibold">
            <span className="material-symbols-outlined text-primary text-xl">pan_tool</span>
            <span>PTZ Controls: {camera.camNumber}</span>
          </div>
          <button
            onClick={onClose}
            className="text-secondary hover:text-on-surface p-1 rounded cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Live Mini Preview with Pan/Zoom Simulation */}
        <div className="relative w-full h-52 bg-black rounded-lg overflow-hidden flex items-center justify-center">
          <img
            alt={camera.imageAlt}
            src={camera.imageUrl}
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
              transition: 'transform 0.15s ease-out'
            }}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 bg-black/75 px-2 py-0.5 rounded text-[10px] text-white font-mono">
            {camera.name} · {camera.subZone}
          </div>
          <div className="absolute bottom-2 right-2 bg-black/75 px-2 py-0.5 rounded text-[10px] text-primary-fixed font-mono">
            Zoom: {zoomLevel.toFixed(1)}x
          </div>
        </div>

        {/* Directional D-Pad & Zoom Controls */}
        <div className="grid grid-cols-2 gap-4 items-center pt-2">
          {/* D-Pad */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-secondary mb-2">Directional Pan / Tilt</span>
            <div className="grid grid-cols-3 gap-1.5 w-32 h-32 items-center justify-items-center bg-surface-panel p-2 rounded-xl">
              <div></div>
              <button
                type="button"
                onClick={() => handlePan(0, 10, 'UP')}
                className="w-8 h-8 rounded bg-white hover:bg-primary hover:text-white flex items-center justify-center shadow-xs cursor-pointer transition-colors"
                title="Pan Up"
              >
                <span className="material-symbols-outlined text-base">arrow_drop_up</span>
              </button>
              <div></div>

              <button
                type="button"
                onClick={() => handlePan(10, 0, 'LEFT')}
                className="w-8 h-8 rounded bg-white hover:bg-primary hover:text-white flex items-center justify-center shadow-xs cursor-pointer transition-colors"
                title="Pan Left"
              >
                <span className="material-symbols-outlined text-base">arrow_left</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="w-8 h-8 rounded bg-surface-container hover:bg-primary hover:text-white flex items-center justify-center text-[10px] font-bold cursor-pointer"
                title="Reset to Home Position"
              >
                HOME
              </button>
              <button
                type="button"
                onClick={() => handlePan(-10, 0, 'RIGHT')}
                className="w-8 h-8 rounded bg-white hover:bg-primary hover:text-white flex items-center justify-center shadow-xs cursor-pointer transition-colors"
                title="Pan Right"
              >
                <span className="material-symbols-outlined text-base">arrow_right</span>
              </button>

              <div></div>
              <button
                type="button"
                onClick={() => handlePan(0, -10, 'DOWN')}
                className="w-8 h-8 rounded bg-white hover:bg-primary hover:text-white flex items-center justify-center shadow-xs cursor-pointer transition-colors"
                title="Pan Down"
              >
                <span className="material-symbols-outlined text-base">arrow_drop_down</span>
              </button>
              <div></div>
            </div>
          </div>

          {/* Optical Zoom Slider */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] uppercase font-bold text-secondary">Optical Zoom Range</span>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-secondary">zoom_out</span>
              <input
                type="range"
                min="1.0"
                max="2.5"
                step="0.1"
                value={zoomLevel}
                onChange={e => setZoomLevel(parseFloat(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <span className="material-symbols-outlined text-sm text-secondary">zoom_in</span>
            </div>
            <div className="flex items-center justify-between text-xs text-secondary font-mono">
              <span>Wide (1.0x)</span>
              <span>Telephoto (2.5x)</span>
            </div>

            <div className="p-2 rounded bg-surface-panel text-[11px] font-mono text-secondary mt-1">
              {statusMessage}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-space-sm pt-2 border-t border-border-subtle">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-primary text-white text-xs font-semibold hover:bg-primary-container cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
