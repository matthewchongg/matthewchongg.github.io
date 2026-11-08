export const PROJECTS_DATA = [
  {
    id: 'loopday',
    index: '01',
    code: 'GA-01',
    title: 'LoopDay',
    subtitle: 'AI Academic Assistant // Google Workspace Add-on',
    status: 'DEPLOYED',
    isWip: false,
    category: 'Google Workspace Add-on & Gemini AI Automation',
    shortDescription:
      'An automated Google Workspace Add-on using Gemini AI to extract coursework deadlines and class updates from Gmail directly into Google Calendar.',
    fullDescription:
      'An intelligent Google Workspace™ Add-on designed for university students to automatically parse academic emails (Canvas, Moodle, university notifications) and sync assignment deadlines and class updates directly into Google Calendar™ using the Gemini™ API.',
    metrics: [
      { label: 'AI PARSER', value: 'Gemini 3.5' },
      { label: 'SYNC TRIGGER', value: '1-Hr Auto' },
      { label: 'DEDUPLICATION', value: '24h Window' },
    ],
    techStack: ['JavaScript', 'Google Apps Script', 'Gemini API', 'Gmail API', 'Calendar API', 'HTML'],
    highlights: [
      'Multi-Model Gemini Parsing: Uses gemini-3.5-flash-lite with fallback protection to extract exact dates, times, and course codes.',
      'Intelligent Rescheduling: Detects class updates or time changes within a 24-hour window and updates existing calendar events in-place without duplicates.',
      'Automated Background Sync & Separated Dashboard: Runs on a 1-hour trigger with split [COURSEWORK] and [CLASSUPDATES] views plus snooze controls.',
    ],
    repoUrl: 'https://matthewchongg.github.io/loopday/',
    githubUrl: 'https://github.com/matthewchongg/loopday',
  },
  {
    id: 'friendly-feud',
    index: '02',
    code: 'GR-01',
    title: 'Friendly-Feud',
    subtitle: 'A Family Feud Recreation',
    status: 'ACTIVE BUILD',
    isWip: false,
    category: 'Real-Time Multiplayer State & Interactive Broadcast UI',
    shortDescription:
      'Friendly-Feud: A customizable Family Feud recreation. A low-latency, multi-client trivia arena featuring flip boards, buzzer arbitration, and live host controls.',
    fullDescription:
      'Friendly-Feud is a customizable interactive web recreation of the classic Family Feud broadcast system. Engineered around deterministic state synchronization, it features a dedicated Host Control Deck, millisecond-accurate web buzzer lockout arbitration, custom survey JSON packs, and kinetic card-flip animations.',
    metrics: [
      { label: 'BUZZER LOCK', value: '±2.4ms' },
      { label: 'CLIENTS', value: 'Multi-Node' },
      { label: 'FRAME RATE', value: '60 FPS' },
    ],
    techStack: ['JavaScript', 'HTML5', 'CSS3', 'WebSockets', 'State Machine', 'Audio API'],
    highlights: [
      'Real-time host control surface with instant strike triggers, round multipliers, and score transfers.',
      'Hardware-inspired split-flap board animations with synchronized sound cues.',
      'Custom JSON survey pack support for rapid game customization and live audience play.',
    ],
    repoUrl: 'https://github.com/matthewchongg/friendly-feud',
    githubUrl: 'https://github.com/matthewchongg/friendly-feud',
  },
  {
    id: 'wip-kinematics',
    index: '03',
    code: 'WIP-03',
    title: 'Work in Progress',
    subtitle: '6-DOF Inverse Kinematics & Edge Servo Controller',
    status: 'WORK IN PROGRESS',
    isWip: true,
    category: 'Embedded Robotics & Physical AI Control',
    shortDescription:
      'Work in Progress — Closed-loop robotic actuator firmware and real-time spatial trajectory planner bridging Python ML inference with embedded CAN-bus servo nodes.',
    fullDescription:
      'Currently under active hardware-in-the-loop (HIL) validation at HKPolyU. This system couples a lightweight vision-language spatial target estimator with a damped least-squares inverse kinematics solver, streaming real-time torque and angle setpoints to brushless actuator modules.',
    metrics: [
      { label: 'CONTROL LOOP', value: '500 Hz' },
      { label: 'DOF TARGET', value: '6-Axis' },
      { label: 'PHASE', value: 'HIL Testing' },
    ],
    techStack: ['Python', 'C++', 'PyTorch', 'ROS 2', 'Three.js', 'CAN-Bus'],
    highlights: [
      'Damped Least-Squares (DLS) Jacobian solver with singularity avoidance and joint-limit clamping.',
      'Browser-based WebGL digital twin for real-time telemetry visualization and trajectory replay.',
      'Hardware torque profiling and thermal derating heuristics for continuous autonomous operation.',
    ],
    repoUrl: 'https://github.com/matthewchongg',
  },
  {
    id: 'wip-telemetry',
    index: '04',
    code: 'WIP-04',
    title: 'Work in Progress',
    subtitle: 'Autonomous Sensor Fusion & Anomaly Pipeline',
    status: 'WORK IN PROGRESS',
    isWip: true,
    category: 'Data Science & Autonomous Systems Telemetry',
    shortDescription:
      'Work in Progress — High-throughput multivariate sensor fusion engine for detecting mechanical vibration and thermal anomalies in autonomous hardware rigs.',
    fullDescription:
      'An ongoing Data Science & AI research module focused on real-time time-series anomaly detection for physical hardware. Ingests high-frequency IMU, current-sense, and thermal telemetry streams to predict actuator wear and mechanical drift before failure occurs.',
    metrics: [
      { label: 'THROUGHPUT', value: '12.5k msg/s' },
      { label: 'INFERENCE', value: 'Quantized INT8' },
      { label: 'PHASE', value: 'Model Training' },
    ],
    techStack: ['Python', 'SQL', 'FastAPI', 'PyTorch', 'Time-Series', 'Docker'],
    highlights: [
      'Unsupervised reconstruction-error scoring across 18 concurrent hardware telemetry channels.',
      'Zero-copy ring-buffer ingestion pipeline tailored for edge compute modules.',
      'Interactive monochromatic diagnostic dashboard with spectral density heatmaps.',
    ],
    repoUrl: 'https://github.com/matthewchongg',
  },
  {
    id: 'wip-vla-policy',
    index: '05',
    code: 'WIP-05',
    title: 'Template Module',
    subtitle: 'Vision-Language Robotic Manipulation Policy',
    status: 'TEMPLATE // WIP',
    isWip: true,
    category: 'Embodied AI & Spatial Affordance Learning',
    shortDescription:
      'Template Module — Multimodal spatial affordance policy mapping RGB-D camera streams directly to 6-DOF end-effector grasp trajectories.',
    fullDescription:
      'Reserved hardware/AI architecture template for upcoming embodied manipulation research. Evaluates quantized vision-language action tokens for zero-shot tabletop object grasping and obstacle-aware motion planning.',
    metrics: [
      { label: 'LATENCY', value: '18.5 ms' },
      { label: 'BACKBONE', value: 'VLA-Tiny' },
      { label: 'PHASE', value: 'Sim2Real' },
    ],
    techStack: ['Python', 'PyTorch', 'OpenCV', 'CUDA', 'ONNX Runtime', 'ROS 2'],
    highlights: [
      'Keypoint-guided grasp affordance heatmaps projected onto 3D point clouds.',
      'Closed-loop visual servoing for dynamic target re-acquisition.',
      'Sim-to-real domain randomization pipeline for metallic and deformable objects.',
    ],
    repoUrl: 'https://github.com/matthewchongg',
  },
  {
    id: 'wip-stm32-pcb',
    index: '06',
    code: 'WIP-06',
    title: 'Template Module',
    subtitle: 'Custom STM32 Actuator & Power Distribution PCB',
    status: 'TEMPLATE // WIP',
    isWip: true,
    category: 'Embedded Hardware & Mixed-Signal PCB Design',
    shortDescription:
      'Template Module — 4-layer field-oriented control (FOC) motor driver and telemetry carrier board with isolated CAN-FD transceiver bus.',
    fullDescription:
      'Reserved embedded hardware template for a custom 4-layer actuator controller PCB. Integrates an STM32G4 microcontroller, high-side current shunt amplifiers, magnetic encoder SPI interface, anddaisy-chained XT30 power bus.',
    metrics: [
      { label: 'BUS RATE', value: '5 Mbps CAN-FD' },
      { label: 'FOC LOOP', value: '25 kHz' },
      { label: 'PHASE', value: 'Schematic' },
    ],
    techStack: ['C', 'STM32 HAL', 'KiCad', 'CAN-FD', 'FreeRTOS', 'FOC'],
    highlights: [
      '4-layer impedance-controlled layout with separated analog sense and power ground planes.',
      'Real-time phase current reconstruction and over-temperature hardware interlocks.',
      'Daisy-chained bus topology minimizing harness clutter inside robotic limbs.',
    ],
    repoUrl: 'https://github.com/matthewchongg',
  },
  {
    id: 'wip-swarm-mesh',
    index: '07',
    code: 'WIP-07',
    title: 'Template Module',
    subtitle: 'Distributed Multi-Agent Swarm Telemetry Mesh',
    status: 'TEMPLATE // WIP',
    isWip: true,
    category: 'Distributed Systems & Autonomous Coordination',
    shortDescription:
      'Template Module — Decentralized peer-to-peer state estimation and task allocation protocol for cooperative autonomous mobile nodes.',
    fullDescription:
      'Reserved software architecture template for multi-agent coordination. Uses consensus-based state estimation and lightweight UDP multicast heartbeats to synchronize spatial maps across heterogeneous robotic nodes.',
    metrics: [
      { label: 'NODES', value: 'Up to 16' },
      { label: 'SYNC JITTER', value: '< 4.0 ms' },
      { label: 'PHASE', value: 'Architecture' },
    ],
    techStack: ['Rust', 'TypeScript', 'WebSockets', 'WebGL', 'Docker', 'Protobuf'],
    highlights: [
      'Lock-free ring buffer telemetry aggregation with automatic peer discovery.',
      'Conflict-free replicated task auctioning under packet loss conditions.',
      'Real-time 3D browser command deck for multi-node trajectory inspection.',
    ],
    repoUrl: 'https://github.com/matthewchongg',
  },
  {
    id: 'wip-edge-forecast',
    index: '08',
    code: 'WIP-08',
    title: 'Template Module',
    subtitle: 'Neural Time-Series Forecasting & Edge Pipeline',
    status: 'TEMPLATE // WIP',
    isWip: true,
    category: 'Data Science & Predictive Telemetry Analytics',
    shortDescription:
      'Template Module — Low-overhead temporal convolution and attention pipeline for forecasting multi-horizon system load and sensor drift.',
    fullDescription:
      'Reserved Data Science & AI project slot for streaming predictive analytics. Combines reversible instance normalization with patched temporal attention to forecast multi-channel sensor trajectories in real time.',
    metrics: [
      { label: 'HORIZON', value: '512 Steps' },
      { label: 'MEMORY', value: '< 45 MB' },
      { label: 'PHASE', value: 'Benchmarking' },
    ],
    techStack: ['Python', 'PyTorch', 'NumPy', 'Pandas', 'FastAPI', 'TypeScript'],
    highlights: [
      'Streaming sliding-window inference with online drift calibration.',
      'Automated feature importance attribution across correlated telemetry channels.',
      'Exportable ONNX graph for deployment on resource-constrained edge nodes.',
    ],
    repoUrl: 'https://github.com/matthewchongg',
  },
];
