import { Controller, Get } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { HealthCheck, HealthCheckResult, HealthCheckService, MicroserviceHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly microservice: MicroserviceHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      () =>
        this.microservice.pingCheck('tcp', {
          transport: Transport.TCP,
          options: { host: 'localhost', port: 3000 },
        }),
    ]);
  }
}
