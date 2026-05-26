import { Controller, Get } from "@nestjs/common";
import type { HealthStatus, ServiceStatus } from "@muqsit/shared-types";
import { PrismaService } from "../prisma/prisma.service";

@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check(): Promise<HealthStatus> {
    let database: ServiceStatus = "ok";
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      database = "down";
    }

    return {
      status: database === "ok" ? "ok" : "degraded",
      service: "muqsit-api",
      timestamp: new Date().toISOString(),
      dependencies: { database },
    };
  }
}
