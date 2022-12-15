import { faker } from '@faker-js/faker';
import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { AppService } from './app.service';
import { User } from './entities/user.entity';

@Controller()
export class AppController {
  private NUMBER_OF_USERS = 20;
  public static __DATABASE_INITIALIZED__ = false;
  private UPSTREAM_URL: string;
  private logger = new Logger('Database Initializer');
  constructor(
    private readonly appService: AppService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly configService: ConfigService,
    private readonly httpClient: HttpService,
  ) {
    this.NUMBER_OF_USERS ||= this.configService.get<number>('NUMBER_OF_USERS');
    if (!this.configService.get<string>('UPSTREAM_URL')) {
      this.logger.error('UPSTREAM_URL environment variable not set');
      process.exit(1);
    }
    this.populateDatabase();
  }

  @Get('users')
  getAll(): Promise<User[]> {
    return this.appService.getUsers();
  }

  @Post('upload')
  async uploadFile(@Body() payload: { url: string }) {
    this.httpClient.post(
      this.configService.get('UPSTREAM_URL') + '/download',
      payload,
    );
    return 'File Uploaded Successfully';
  }
  private populateDatabase() {
    // Query the database and see if there are any users. If the count is 0, then use @faker-js/faker to generate NUMBER_OF_USERS users and save them to the database.
    this.userRepo
      .count()
      .then(async (count) => {
        if (count === 0) {
          this.logger.log(
            `Found No users in the database. Generating ${this.NUMBER_OF_USERS} users...`,
          );
          for (let i = 0; i < this.NUMBER_OF_USERS; i++) {
            const user = new User();
            user.username = faker.internet.userName();
            user.password = faker.internet.password();
            await this.userRepo.save(user);
          }
          this.logger.log(
            `Successfully Generated ${this.NUMBER_OF_USERS} users`,
          );
        } else {
          this.logger.log(
            `Found ${count} users in the database. Skipping user Generation`,
          );
          AppController.__DATABASE_INITIALIZED__ = true;
        }
      })
      .catch((err) => {
        this.logger.error('Failed to Initialize database data with :', err);
        throw err;
      });
  }
}
