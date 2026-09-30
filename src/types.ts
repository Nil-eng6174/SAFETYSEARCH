export type ActiveTab = 'dashboard' | 'logs-and-reports' | 'settings';

export interface WorkerTag {
  id: string;
  name: string;
  role: string;
  station: string;
  initials: string;
}

export interface BoundingBox {
  id: string;
  label: string;
  confidence: number;
  type: 'safe' | 'warning' | 'violation';
  top: string;
  left: string;
  width: string;
  height: string;
  subtext?: string;
  isPulsing?: boolean;
}

export interface CameraFeed {
  id: string;
  camNumber: string;
  name: string;
  zone: string;
  subZone: string;
  rtspUrl: string;
  status: 'online' | 'standby' | 'error';
  fps: number;
  resolution: string;
  bitrate: string;
  latencyMs: number;
  imageUrl: string;
  imageAlt: string;
  workerTag: WorkerTag;
  workerStatusText: string;
  workerStatusType: 'safe' | 'warning' | 'violation';
  violationsCount: number;
  warningsCount: number;
  complianceRate: number;
  requiredGear: string[];
  boundingBoxes: BoundingBox[];
}

export interface Incident {
  id: string;
  timeString: string;
  timestamp: string;
  date: string;
  cameraId: string;
  cameraName: string;
  zoneName: string;
  severity: 'critical' | 'warning' | 'resolved';
  classification: string;
  category: 'gloves' | 'hairnet' | 'goggles' | 'footwear' | 'egress';
  description: string;
  worker: WorkerTag;
  aiConfidence: number;
  snapshotUrl: string;
  snapshotAlt: string;
  status: 'unreviewed' | 'acknowledged' | 'escalated' | 'resolved';
  reviewedBy?: string;
  logId?: string;
  resolutionTimeMinutes?: number;
  supervisorNote?: string;
}

export interface PpeRule {
  id: string;
  name: string;
  subtext: string;
  icon: string;
  active: boolean;
  minConfidence: number;
  enforcedZones: string[];
  latencyMs: number;
  categoryKey: string;
}

export interface AlertContact {
  id: string;
  type: 'email' | 'phone';
  value: string;
  label?: string;
}
