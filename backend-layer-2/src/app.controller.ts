import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('download')
  getUrl(@Body() payload: { url: string }): Promise<string> {
    // Get the url from the request body
    // Download the file
    // save it to the disk under the environment Variable DOWNLOAD_PATH
    // return the status of the download
    return this.appService.downloadFile(payload.url);
  }

  @Get()
  getProble(): string {
    return 'Readiness probe';
  }
}
