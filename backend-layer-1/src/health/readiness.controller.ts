import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { AppController } from '../app.controller';

@Controller('ready')
export class ReadinessController {
  constructor(
    private health: HealthCheckService,
    private typeorm: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private controller: AppController,
  ) {}

  // Create a custom health check that checks the value of    __DATABASE_INITIALIZED__ inside AppController
  // When it changes to true, declare it as ready.
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => {
        console.log(AppController.__DATABASE_INITIALIZED__);
        if (AppController.__DATABASE_INITIALIZED__) {
          return Promise.resolve({
            database: {
              status: 'up',
            },
          });
        }
        return Promise.resolve({
          database: {
            status: 'down',
            info: {
              error: 'Database not initialized',
              message: 'Database not initialized',
            },
          },
        });
      },
    ]);
  }
}
