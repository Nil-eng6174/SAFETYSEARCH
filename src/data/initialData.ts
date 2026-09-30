import { CameraFeed, Incident, PpeRule, AlertContact } from '../types';

export const INITIAL_CAMERAS: CameraFeed[] = [
  {
    id: 'cam-01',
    camNumber: 'CAM 01',
    name: 'MAIN KITCHEN',
    subZone: 'HOT LINE PREP',
    zone: 'kitchen',
    rtspUrl: 'rtsp://192.168.1.120:554/live/ch0',
    status: 'online',
    fps: 30.0,
    resolution: '1080p',
    bitrate: '4.2 Mbps',
    latencyMs: 18,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9bX9bXF07TZwUr_-I-lAB4dZzyFacsRIf9XPtBXSl2Vja2bRQpKo3vdWZQV8ShnGoqrE_ZLy-B5z2OpmtCIh89Uhs1-3zYEa8XSbHkzLq5mRdLrP3Lar8Ve4bNR6QaheZK4ijN4aEwwkZisC6WlrFrYi5j32ix5f-uNdZSyzBmOcNjXiNjez-bmeuVtUGv5JFd3Pfw7rzBQpd6o7KrmVAHEVHkWRxhwctcmC_jfTRckxNTqc0wZHFCQ',
    imageAlt: 'Overhead security CCTV camera feed inside a stainless steel luxury commercial hotel kitchen during morning service, bright overhead fluorescent lights, chef wearing white uniform working over food prep station with cutting board.',
    workerTag: {
      id: 'WK-0881',
      name: 'Marco D.',
      role: 'Station Baker #4',
      station: 'Salad & Garnish Line',
      initials: 'B4'
    },
    workerStatusText: 'Immediate Action Needed',
    workerStatusType: 'violation',
    violationsCount: 1,
    warningsCount: 0,
    complianceRate: 82.4,
    requiredGear: ['Gloves', 'Hairnets Required'],
    boundingBoxes: [
      {
        id: 'box-1',
        label: 'Hairnet 98%',
        confidence: 98,
        type: 'safe',
        top: '18%',
        left: '42%',
        width: '16%',
        height: '15%'
      },
      {
        id: 'box-2',
        label: 'Chef Apron 96%',
        confidence: 96,
        type: 'safe',
        top: '34%',
        left: '38%',
        width: '26%',
        height: '38%'
      },
      {
        id: 'box-3',
        label: 'MISSING GLOVES (94%)',
        confidence: 94,
        type: 'violation',
        top: '62%',
        left: '46%',
        width: '22%',
        height: '24%',
        subtext: 'Station #4 Bare Contact',
        isPulsing: true
      }
    ]
  },
  {
    id: 'cam-02',
    camNumber: 'CAM 02',
    name: 'COLD PREP & STORAGE',
    subZone: 'PREP AREA B',
    zone: 'prep',
    rtspUrl: 'rtsp://192.168.1.121:554/live/ch0',
    status: 'online',
    fps: 30.0,
    resolution: '1080p',
    bitrate: '3.9 Mbps',
    latencyMs: 21,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBefi8XxjnP04O3Dgl_NH2DhaeXJ4EDCvSulzDiRT9Rz9knnA5wbxBytVOsrygbu-N6R_F6SAYZP_FtZnM5oqUlqsnNGJxw8PeWd7ko8X-yOphhsJZUtqFAYtIDA38vipvFbZw8CzT1KjWwSGQIfRJrFsmRkUJq3SXhWvi2Rry9p7Xxe9qSOIktP6r7mIltmsUH2ObfqX1FZlBtPpzOo_pmr7SpPb1mVA3bOA_7X--EL9P59zmJFlodvw',
    imageAlt: 'Surveillance security angle inside a commercial walk-in cold food prep pantry in a modern hotel, stainless steel shelving, organized ingredient containers, staff member slicing garnishes under cool LED light.',
    workerTag: {
      id: 'WK-0412',
      name: 'Carlos S.',
      role: 'Sous Chef Assistant',
      station: 'Cold Storage Station B',
      initials: 'SC'
    },
    workerStatusText: 'Full PPE Verified',
    workerStatusType: 'safe',
    violationsCount: 0,
    warningsCount: 0,
    complianceRate: 100,
    requiredGear: ['Gloves', 'Hairnets', 'Slip-Resistant Shoes'],
    boundingBoxes: [
      {
        id: 'box-4',
        label: 'Chef Cap 99%',
        confidence: 99,
        type: 'safe',
        top: '20%',
        left: '35%',
        width: '20%',
        height: '16%'
      },
      {
        id: 'box-5',
        label: 'Latex Gloves 95%',
        confidence: 95,
        type: 'safe',
        top: '55%',
        left: '40%',
        width: '18%',
        height: '18%'
      },
      {
        id: 'box-6',
        label: 'Non-Slip Shoes 92%',
        confidence: 92,
        type: 'safe',
        top: '78%',
        left: '36%',
        width: '24%',
        height: '20%'
      }
    ]
  },
  {
    id: 'cam-03',
    camNumber: 'CAM 03',
    name: 'HOUSEKEEPING FL 4',
    subZone: 'LINEN CORRIDOR',
    zone: 'housekeeping',
    rtspUrl: 'rtsp://192.168.1.124:554/live/ch0',
    status: 'online',
    fps: 30.0,
    resolution: '720p',
    bitrate: '2.8 Mbps',
    latencyMs: 19,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD85BxdSZTtlhZFPNqE6zgjKFTR1403J5FSVC7D22jXx4ZNfcSlA4Hph4e8osgkIzLWU08JAsc_jS_0Mb-IY_1VXe1gMCeedg56owRxBG_MP8lCLn1sGQpX0tiDobgBeM8M0u6g0zmt99CRiGLB9XzdQats-Aw4iSfvu7C6JCZfxiKs34i7HHkg1hyP9FKMYyUxGuSVLoiuhamHRZOKRGkONzVYTKItzJS_rbPIcx2tccBRyUSwGXkqyw',
    imageAlt: 'High quality hotel corridor surveillance footage showing a housekeeping worker pushing a clean service trolley cart along plush carpeted hallway with high visibility badge and closed safety footwear.',
    workerTag: {
      id: 'WK-0921',
      name: 'Maria L.',
      role: 'Housekeeping Lead',
      station: 'Guest Wing Floor 4',
      initials: 'ML'
    },
    workerStatusText: 'Clear Corridor Route',
    workerStatusType: 'safe',
    violationsCount: 0,
    warningsCount: 0,
    complianceRate: 100,
    requiredGear: ['Safety Vest', 'Closed Shoe Required'],
    boundingBoxes: [
      {
        id: 'box-7',
        label: 'Safety Vest 97%',
        confidence: 97,
        type: 'safe',
        top: '28%',
        left: '50%',
        width: '22%',
        height: '32%'
      },
      {
        id: 'box-8',
        label: 'Closed Shoe 98%',
        confidence: 98,
        type: 'safe',
        top: '74%',
        left: '54%',
        width: '18%',
        height: '18%'
      }
    ]
  },
  {
    id: 'cam-04',
    camNumber: 'CAM 04',
    name: 'DISHWASH & CHEMICAL',
    subZone: 'STEWARDING BAY',
    zone: 'wash',
    rtspUrl: 'rtsp://192.168.1.121:554/live/ch0',
    status: 'online',
    fps: 29.9,
    resolution: '1080p',
    bitrate: '4.5 Mbps',
    latencyMs: 21,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAi6Ovn-4M1qy-HlpQJ_bMji6pcDO6k7L6m4DKbnyxkPBOQm-Y8qqGrDuvEzVV6Ijf9QtWgqYkvSDFK5zfooWuJMgWTY9YZvrY81QaLcMAsNyyrtTArUwvlQQe5OQ9YYDp678gx72RKJ5oe5eQa90e4tXZYV9E_dt4G-1ZUyRrS6P7A4aVdw859EGV7TZuvf5l_Uj1ZdA3xfzyoooPPh0MUkdlr30i2nUIqqZewKnNeDMjlgz4-crc1w',
    imageAlt: 'Industrial hotel kitchen stewarding bay with heavy-duty commercial dishwashers and chemical sanitizer dispenser racks, tile walls, moist floor with non-slip yellow warning markers.',
    workerTag: {
      id: 'WK-0319',
      name: 'Jerome K.',
      role: 'Utility Tech #2',
      station: 'Chemical Wash Bay',
      initials: 'UT'
    },
    workerStatusText: 'Eye Shield Reposition Req.',
    workerStatusType: 'warning',
    violationsCount: 0,
    warningsCount: 1,
    complianceRate: 91.8,
    requiredGear: ['Splash Goggles', 'Rubber Apron', 'Boots'],
    boundingBoxes: [
      {
        id: 'box-9',
        label: 'Goggles Ajar (88%)',
        confidence: 88,
        type: 'warning',
        top: '22%',
        left: '45%',
        width: '18%',
        height: '18%'
      },
      {
        id: 'box-10',
        label: 'Rubber Apron 97%',
        confidence: 97,
        type: 'safe',
        top: '44%',
        left: '40%',
        width: '28%',
        height: '42%'
      }
    ]
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: '#SEC-8921',
    timeString: '10:42:18 AM',
    timestamp: '10:42:18',
    date: 'Oct 24, 2024',
    cameraId: 'cam-01',
    cameraName: 'CAM 01 · MAIN KITCHEN',
    zoneName: 'Kitchen Station #1 · Prep Cold Area (Cam-01)',
    severity: 'critical',
    classification: 'Missing Protective Gloves',
    category: 'gloves',
    description: 'Direct contact with raw food plating station #4. Immediate sanitization required.',
    worker: {
      id: 'EMP-4091',
      name: 'Station Baker #4',
      role: 'Station Baker',
      station: 'Salad & Garnish Line',
      initials: 'B4'
    },
    aiConfidence: 94.6,
    snapshotUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIvFqkHHeVAGxm4RHaUb-V5YDsTXNRfpqUGN5rcTZFozNtGCVxyVkMYgsNjvSIVBnzr-5Ai_MaE34MIT67i5xwVXRh5VUiT_gCVTomvzNO_y4iVu4lN44iC8zZArl4YeDXza6PJvfROvRN_eFgTGM16yHhemG3Or-Fvgm2nLG58EQK0ddBYZoAZ4UtUAxOhkczWZkYUldtMlv_Du3iJmAxdsyy2BU8WP8G4UqZZ8mGy-bDYSJVAVEGzg',
    snapshotAlt: 'Surveillance security close up crop of a chef hands preparing food over hotel prep counter without gloves, sharp red detection box outline around bare fingers.',
    status: 'unreviewed'
  },
  {
    id: '#SEC-8919',
    timeString: '09:15:44 AM',
    timestamp: '09:15:44',
    date: 'Oct 24, 2024',
    cameraId: 'cam-02',
    cameraName: 'CAM 02 · COLD PREP',
    zoneName: 'Prep Line #2 · Main Hot Line (Cam-02)',
    severity: 'warning',
    classification: 'No Hairnet / Cap',
    category: 'hairnet',
    description: 'Cold station staff member entered prep quadrant without mandated hair restraint.',
    worker: {
      id: 'EMP-1128',
      name: 'Sous Chef Assnt',
      role: 'Assistant Chef',
      station: 'Cold Prep Area B',
      initials: 'SC'
    },
    aiConfidence: 98.2,
    snapshotUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFFS7api1oM0oOwEAdAruoVk1lKFHGZQcy4I6wU13TpRDLl6PR0bwNR028kSvFtwGU1TDOP3Xwj3ouGjQ7iOE8FEX6HwQbHv22FoRO8xqNKRz7R2JJuOQHZYSVgIWJUqPaS8nl9u1E5UwZIPkepsNTMeQ2E0ZpdD2-1TLpHfpn_mUBUpGDPb6u7kI22mAPHg6RTuMtNlf1RFPS4s_GYVMUu2ghJDFWRhYeqHd9JjF3Q-zISARgMBgArA',
    snapshotAlt: 'Kitchen assistant at hot cook line with exposed hair leaning over hot food pan, amber AI perimeter highlight identifying uncontained hair.',
    status: 'acknowledged',
    reviewedBy: 'Shift Lead Notified'
  },
  {
    id: '#SEC-8914',
    timeString: '08:40:02 AM',
    timestamp: '08:40:02',
    date: 'Oct 23, 2024',
    cameraId: 'cam-04',
    cameraName: 'CAM 04 · DISHWASH & CHEMICAL',
    zoneName: 'Stewarding & Dish Pit · Chemical Wash Bay (Cam-03)',
    severity: 'critical',
    classification: 'Missing Eye Protection',
    category: 'goggles',
    description: 'Chemical detergent refill initiated without certified eye PPE. Handled by Lead Steward.',
    worker: {
      id: 'EMP-8803',
      name: 'Utility Tech #2',
      role: 'Utility Steward',
      station: 'Chemical Sanitizer Pit',
      initials: 'UT'
    },
    aiConfidence: 91.8,
    snapshotUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmlVjILKYupLBE8yunukvg6sgGhHujlX7Z06QeG_FGEOIJuAAhud4-f74ZLoapsVtPQoZVqgsk7knZAVqOYaV45xh5suoXz7QxmCCywGRTETjDFzaJqenWgp22T0nUPnWV94SDsEuPyB6dztoIQbIa467RKX2_Pz9FBju5yNSkjXj_8XzBsvsziXOKWgD1-dVdYTNpMHkP-Bs133cGkZRzWopNWnFPfHk8l66pyFGeYMjXpUQN5efjyw',
    snapshotAlt: 'Worker in commercial wash station handling chemical detergent jugs without required clear protective goggles.',
    status: 'escalated',
    reviewedBy: 'Elena Rostova',
    logId: '#IR-4091'
  },
  {
    id: '#SEC-8907',
    timeString: '07:55:10 AM',
    timestamp: '07:55:10',
    date: 'Oct 23, 2024',
    cameraId: 'cam-03',
    cameraName: 'CAM 03 · LINEN CORRIDOR',
    zoneName: 'Receiving & Dock · Pallet Unload Ramp (Cam-05)',
    severity: 'warning',
    classification: 'Non-Compliant Footwear',
    category: 'footwear',
    description: 'Delivery vendor personnel badge scanned without safety shoe clearance check.',
    worker: {
      id: 'EMP-9021',
      name: 'Dock Handler #1',
      role: 'Dock Logistics',
      station: 'Loading Bay Ramp',
      initials: 'DH'
    },
    aiConfidence: 89.4,
    snapshotUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2Vui0OmLQ5NXFtx6diIizj24RCNkYZbQzq5p_bsKaZwr9ONQWWq6F9o1EPd-wvbLuULtvaRydI3L9UV19TV8O3F-vWVpezRGNwxcn-1jX_DVKJgqX3sibLNKYd5bc4yWOiT2ujXyw0DSS57dcHDDZhttETDUcv_uH66dBqhKucASxn1a0xJRWBmvvx7Jo6ilL716-DlSrZdGyX14HGvmNEla9MeMaqJjJyimLtX92bLUOH0M9cFK78g',
    snapshotAlt: 'Warehouse dock worker moving heavy wooden crate wearing soft fabric athletic sneakers instead of required steel-toe boots.',
    status: 'acknowledged',
    reviewedBy: 'Gate Attendant Checked',
    logId: '#IR-4087'
  },
  {
    id: '#SEC-8898',
    timeString: '06:22:15 AM',
    timestamp: '06:22:15',
    date: 'Oct 23, 2024',
    cameraId: 'cam-01',
    cameraName: 'CAM 01 · HOT LINE',
    zoneName: 'Kitchen Station #1 · Cold Prep Line (Cam-01)',
    severity: 'warning',
    classification: 'Missing Protective Gloves',
    category: 'gloves',
    description: 'Salad bar chef chopping fresh produce with un-gloved hands during prep onset.',
    worker: {
      id: 'EMP-3304',
      name: 'Salad Station #2',
      role: 'Prep Cook',
      station: 'Pantry Station 2',
      initials: 'SS'
    },
    aiConfidence: 96.1,
    snapshotUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2w_AxnqdkmEq8bJpNEZbXmvH7jIa2Jjr21D66qvt748_9SVS2UMeTH7TTRfHy8sPOCddBBH4dc0pTkypZdqZyyhLddbKBLQ1s2HT7T7Mg3PjZ2su4Llpg9L-vgOHZKqr0LoMpdGuwfmzJQQYfiDElvmI1XOTaEHzkkdEbTv3XxURQ_f62-UrSNkKcF_Lg73ppr7QPe5vSNKXqTTGoOYvbBR4ygPXAmhcgjFTvJlYdpdydMkEAsSE_4w',
    snapshotAlt: 'Salad bar chef chopping fresh produce with bare fingers, crisp sharp security footage frame with bounding overlay.',
    status: 'unreviewed'
  },
  {
    id: '#SEC-8884',
    timeString: '16:44:05 PM',
    timestamp: '16:44:05',
    date: 'Oct 22, 2024',
    cameraId: 'cam-03',
    cameraName: 'CAM 03 · HOUSEKEEPING FL 4',
    zoneName: 'Commercial Laundry · Steam Press Area (Cam-04)',
    severity: 'critical',
    classification: 'Missing Eye Protection',
    category: 'goggles',
    description: 'Linen Tech operated high-temperature steam press unit without required protective visor.',
    worker: {
      id: 'EMP-6701',
      name: 'Linen Tech #3',
      role: 'Laundry Specialist',
      station: 'Steam Press Bay',
      initials: 'LT'
    },
    aiConfidence: 93.5,
    snapshotUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyQPLgC-_mmVCBxD_95-CDECh9ctjv0-l2IsFs19j4AYW8CNE9PIAiMCmyz2JhT3SpDB3_7CugOK5G85D3_qeU5Ll9tjw314Hzd2vpZX2Za8YRlnaEJnOPP4uwYaxexStzR8P7OGBY-OlIcbC4DUgXIz1SUTqVn0lI7ujJ0x1l-O6nv19imtn7VKx6s-Nm9sEwzoj-JEhx7umxr7TYPAJx8iEF0jR5bbujfrPr_PSuHOuMJ8tuleCu8Q',
    snapshotAlt: 'Hotel laundry operative operating heavy industrial steam press machinery without wearing high-temperature face shield or eye gear.',
    status: 'acknowledged',
    reviewedBy: 'Elena Rostova',
    logId: '#IR-4072'
  }
];

export const INITIAL_PPE_RULES: PpeRule[] = [
  {
    id: 'rule-gloves',
    name: 'Food Handling Gloves',
    subtext: 'Latex, Nitrile, Cut-resistant',
    icon: 'front_hand',
    active: true,
    minConfidence: 85,
    enforcedZones: ['Kitchen', 'Bakery'],
    latencyMs: 4.2,
    categoryKey: 'gloves'
  },
  {
    id: 'rule-hairnet',
    name: 'Sanitary Hairnets & Caps',
    subtext: 'Mesh nets, Chef toques, Beard guards',
    icon: 'face_retouching_natural',
    active: true,
    minConfidence: 80,
    enforcedZones: ['All Food Areas'],
    latencyMs: 3.8,
    categoryKey: 'hairnet'
  },
  {
    id: 'rule-goggles',
    name: 'Chemical Splash Goggles',
    subtext: 'ANSI Z87.1 Polycarbonate wrap',
    icon: 'visibility',
    active: true,
    minConfidence: 90,
    enforcedZones: ['Stewarding', 'Chemical Storage'],
    latencyMs: 5.1,
    categoryKey: 'goggles'
  },
  {
    id: 'rule-masks',
    name: 'Face Masks (Respiratory)',
    subtext: '3-Ply surgical, KN95 particulates',
    icon: 'masks',
    active: false,
    minConfidence: 75,
    enforcedZones: ['None (Optional Shift Requirement)'],
    latencyMs: 0,
    categoryKey: 'masks'
  },
  {
    id: 'rule-footwear',
    name: 'Non-Slip Safety Footwear',
    subtext: 'Certified oil/grease resistant tread',
    icon: 'snowshoeing',
    active: true,
    minConfidence: 85,
    enforcedZones: ['Kitchen', 'Laundry'],
    latencyMs: 4.9,
    categoryKey: 'footwear'
  }
];

export const INITIAL_CONTACTS: AlertContact[] = [
  { id: 'c-1', type: 'email', value: 'elena.rostova@grandplaza.com' },
  { id: 'c-2', type: 'email', value: 'safety-team@grandplaza.com' },
  { id: 'c-3', type: 'phone', value: '+1 (555) 019-4821', label: 'Duty Mgr' },
  { id: 'c-4', type: 'phone', value: '+1 (555) 019-9940', label: 'Ops SOC' }
];
