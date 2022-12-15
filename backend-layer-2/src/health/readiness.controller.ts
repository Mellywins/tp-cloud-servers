import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { AppController } from '../app.controller';

@Controller('ready')
export class ReadinessController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}

  // Create a custom health check that checks the value of    __DATABASE_INITIALIZED__ inside AppController
  // When it changes to true, declare it as ready.
  @Get()
  @HealthCheck()
  check() {
    return this.http.pingCheck(
      'Readiness',
      `http://localhost:${process.env.PORT || 3001}`,
    );
  }
}
