export type ServiceStatus = "ok" | "degraded" | "down";

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface HealthStatus {
  status: ServiceStatus;
  service: string;
  timestamp: string;
  dependencies?: Record<string, ServiceStatus>;
}
