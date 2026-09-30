/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ActiveTab, CameraFeed, Incident, PpeRule, AlertContact } from './types';
import { INITIAL_CAMERAS, INITIAL_INCIDENTS, INITIAL_PPE_RULES, INITIAL_CONTACTS } from './data/initialData';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { LogsReportsView } from './components/LogsReportsView';
import { SettingsView } from './components/SettingsView';
import { DispatchModal } from './components/DispatchModal';
import { SnapshotModal } from './components/SnapshotModal';
import { ReviewModal } from './components/ReviewModal';
import { BroadcastModal } from './components/BroadcastModal';
import { PTZModal } from './components/PTZModal';
import { AddCameraModal } from './components/AddCameraModal';
import { Toast } from './components/Toast';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [cameras, setCameras] = useState<CameraFeed[]>(INITIAL_CAMERAS);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [ppeRules, setPpeRules] = useState<PpeRule[]>(INITIAL_PPE_RULES);
  const [contacts] = useState<AlertContact[]>(INITIAL_CONTACTS);

  // Modals state
  const [dispatchIncident, setDispatchIncident] = useState<Incident | null>(null);
  const [snapshotIncident, setSnapshotIncident] = useState<Incident | null>(null);
  const [reviewIncident, setReviewIncident] = useState<Incident | null>(null);
  const [ptzCamera, setPtzCamera] = useState<CameraFeed | null>(null);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [isAddCameraOpen, setIsAddCameraOpen] = useState(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'warning' | 'info'>('success');

  const showToast = (msg: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3200);
  };

  // Incident Actions
  const handleAcknowledgeIncident = (incidentId: string) => {
    setIncidents(prev =>
      prev.map(inc =>
        inc.id === incidentId
          ? { ...inc, status: 'acknowledged' as const, reviewedBy: 'Elena Rostova (Shift Lead)' }
          : inc
      )
    );
    showToast('Incident acknowledged and logged into shift safety report.');
  };

  const handleConfirmDispatch = (incident: Incident) => {
    setDispatchIncident(null);
    showToast(`Emergency alert dispatched for ${incident.cameraName} (${incident.classification}). Kitchen pager & SMS alerted.`);
  };

  const handleSubmitReview = (incidentId: string, feedback: string, coachingDelivered: boolean) => {
    setIncidents(prev =>
      prev.map(inc =>
        inc.id === incidentId
          ? {
              ...inc,
              status: 'acknowledged' as const,
              supervisorNote: feedback || (coachingDelivered ? 'Verbal corrective coaching delivered.' : ''),
              reviewedBy: 'Elena Rostova'
            }
          : inc
      )
    );
    showToast(`Violation ${incidentId} sign-off committed to audit trail.`);
  };

  const handleAddSupervisorNote = (incidentId: string, note: string) => {
    setIncidents(prev =>
      prev.map(inc => (inc.id === incidentId ? { ...inc, supervisorNote: note } : inc))
    );
    showToast(`Supervisor note added to log ${incidentId}.`);
  };

  const handleEscalateIncident = (incidentId: string) => {
    setIncidents(prev =>
      prev.map(inc => (inc.id === incidentId ? { ...inc, status: 'escalated' as const } : inc))
    );
    showToast(`Incident ${incidentId} escalated to General Safety Director.`);
  };

  const handleSendBroadcast = (message: string, targetZones: string[]) => {
    showToast(`PA Broadcast transmitted to ${targetZones.join(', ')}: "${message.slice(0, 40)}..."`);
  };

  const handleAddCamera = (newCamData: Partial<CameraFeed>) => {
    const camIndex = cameras.length + 1;
    const newCam: CameraFeed = {
      id: `cam-0${camIndex}`,
      camNumber: `CAM 0${camIndex}`,
      name: newCamData.name || `STATION 0${camIndex}`,
      subZone: newCamData.subZone || 'General Area',
      zone: 'kitchen',
      rtspUrl: newCamData.rtspUrl || `rtsp://192.168.1.13${camIndex}:554/live/ch0`,
      status: 'online',
      fps: newCamData.fps || 30,
      resolution: '1080p',
      bitrate: '4.0 Mbps',
      latencyMs: newCamData.latencyMs || 22,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjQAjYxhBT0Bvbtv2zTdhtWkrgQ8qVHa4HKnX4i8C9pgPp3_dcnOX37wmiBC0V3WYOW5_2mamlprMavq1g-lEJY9k_ulF_mX1NZ_c5ekWA_iG7bHW0CUwk2WC3F3Aws0i6mbPJdQf08DPzG9jz58xq64AhtvvhG4g2mIFXI_7zxAjEm_KLRovLijUzaugsJ8YtzVCNPVevH9S79dra976ysu22FCiDka95i4pxmk6eK1ctG11SzvKsEA',
      imageAlt: 'Newly connected CCTV camera stream feed',
      workerTag: {
        id: `WK-0${Math.floor(Math.random() * 800) + 100}`,
        name: 'Floor Operator',
        role: 'Station Tech',
        station: newCamData.subZone || 'Prep Station',
        initials: 'OP'
      },
      workerStatusText: 'Full PPE Verified',
      workerStatusType: 'safe',
      violationsCount: 0,
      warningsCount: 0,
      complianceRate: 100,
      requiredGear: ['Gloves', 'Hairnets Required'],
      boundingBoxes: []
    };

    setCameras(prev => [...prev, newCam]);
    showToast(`New stream connected: ${newCam.camNumber} (${newCam.name}). Optical calibration passed.`);
  };

  return (
    <div className="min-h-screen bg-surface-base text-on-surface antialiased flex flex-col justify-between">
      {/* Fixed Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        incidents={incidents}
        onOpenIncidentSnapshot={setSnapshotIncident}
      />

      {/* Main Content Area */}
      <main className="w-full pt-16 bg-surface-base min-h-screen flex-1">
        {activeTab === 'dashboard' && (
          <DashboardView
            cameras={cameras}
            incidents={incidents}
            onOpenDispatch={setDispatchIncident}
            onOpenSnapshot={setSnapshotIncident}
            onOpenBroadcast={() => setIsBroadcastOpen(true)}
            onOpenPTZ={setPtzCamera}
            onAcknowledgeIncident={handleAcknowledgeIncident}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'logs-and-reports' && (
          <LogsReportsView
            incidents={incidents}
            onOpenSnapshot={setSnapshotIncident}
            onOpenReview={setReviewIncident}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            cameras={cameras}
            ppeRules={ppeRules}
            contacts={contacts}
            onUpdatePpeRules={setPpeRules}
            onUpdateCameras={setCameras}
            onOpenAddCamera={() => setIsAddCameraOpen(true)}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Global Interactive Modals */}
      <DispatchModal
        isOpen={Boolean(dispatchIncident)}
        incident={dispatchIncident}
        onClose={() => setDispatchIncident(null)}
        onConfirm={handleConfirmDispatch}
      />

      <SnapshotModal
        isOpen={Boolean(snapshotIncident)}
        incident={snapshotIncident}
        onClose={() => setSnapshotIncident(null)}
        onAddNote={handleAddSupervisorNote}
        onEscalate={handleEscalateIncident}
      />

      <ReviewModal
        isOpen={Boolean(reviewIncident)}
        incident={reviewIncident}
        onClose={() => setReviewIncident(null)}
        onSubmitReview={handleSubmitReview}
      />

      <BroadcastModal
        isOpen={isBroadcastOpen}
        onClose={() => setIsBroadcastOpen(false)}
        onSendBroadcast={handleSendBroadcast}
      />

      <PTZModal
        isOpen={Boolean(ptzCamera)}
        camera={ptzCamera}
        onClose={() => setPtzCamera(null)}
      />

      <AddCameraModal
        isOpen={isAddCameraOpen}
        onClose={() => setIsAddCameraOpen(false)}
        onAddCamera={handleAddCamera}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} type={toastType} />

      {/* Global Standard Footer */}
      <footer className="w-full bg-surface-card border-t border-border-subtle py-space-md px-margin shrink-0">
        <div className="w-full max-w-[1920px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-space-sm text-secondary font-label-sm text-label-sm">
          <span>© 2025 SafeStay Guard Systems Inc. Real-time Edge PPE Telemetry.</span>
          <div className="flex items-center gap-space-md flex-wrap">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-status-safe"></span>
              Edge Inference: 24ms
            </span>
            <span>Station Node #GP-04</span>
            <span className="text-on-surface-variant font-medium">Compliance Target: 98.5%</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
