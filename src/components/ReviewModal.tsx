import React, { useState } from 'react';
import { Incident } from '../types';

interface ReviewModalProps {
  isOpen: boolean;
  incident: Incident | null;
  onClose: () => void;
  onSubmitReview: (incidentId: string, feedback: string, coachingDelivered: boolean) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  incident,
  onClose,
  onSubmitReview
}) => {
  const [feedback, setFeedback] = useState('');
  const [coachingDelivered, setCoachingDelivered] = useState(true);

  if (!isOpen || !incident) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReview(incident.id, feedback, coachingDelivered);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-xs flex items-center justify-center p-space-md">
      <div className="bg-surface-card rounded-xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col border border-border-strong animate-in fade-in zoom-in duration-150">
        <div className="px-space-lg py-space-md bg-surface-panel flex items-center justify-between border-b border-border-subtle">
          <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">
            Manager Review &amp; Sign-off
          </span>
          <button
            onClick={onClose}
            className="text-secondary hover:text-on-surface p-1 rounded-md cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-space-lg flex flex-col gap-space-md">
          <p className="font-body-md text-body-md text-secondary">
            Reviewing event <strong className="text-on-surface">{incident.id}</strong> ({incident.classification} by {incident.worker.name}). Assign corrective coaching or commit sign-off.
          </p>

          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-secondary uppercase font-semibold">
              Supervisor Feedback Notes
            </label>
            <textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              className="w-full bg-surface-base border border-border-subtle p-space-sm rounded font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Provide context or verbal coaching documentation..."
              rows={3}
            />
          </div>

          <div className="flex items-center gap-space-sm">
            <input
              checked={coachingDelivered}
              onChange={e => setCoachingDelivered(e.target.checked)}
              className="rounded text-primary focus:ring-primary h-4 w-4 cursor-pointer"
              id="coaching-delivered"
              type="checkbox"
            />
            <label
              className="font-label-md text-label-md text-on-surface cursor-pointer select-none"
              htmlFor="coaching-delivered"
            >
              Immediate verbal corrective coaching delivered
            </label>
          </div>

          <div className="px-space-lg py-space-md -mx-space-lg -mb-space-lg bg-surface-panel flex items-center justify-end gap-space-sm border-t border-border-subtle mt-2">
            <button
              type="button"
              className="px-4 py-2 rounded bg-surface-card text-on-surface font-label-md text-label-md shadow-sm hover:bg-surface-base transition-colors cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">check</span>
              <span>Sign &amp; Acknowledge</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
