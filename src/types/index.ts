export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  index: string;
  code: string;
  title: string;
  subtitle: string;
  status: string;
  isWip: boolean;
  category: string;
  shortDescription: string;
  fullDescription: string;
  metrics: ProjectMetric[];
  techStack: string[];
  highlights: string[];
  repoUrl?: string;
  githubUrl?: string;
}

export interface ArmTelemetryData {
  theta1: number;
  theta2: number;
  turretDeg: number;
  endX: number;
  endY: number;
  aperture: number;
  isHoldingBlock: boolean;
  isClosed: boolean;
  isResettingBlock: boolean;
}
