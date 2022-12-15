import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
const Downloader = require('nodejs-file-downloader');
@Injectable()
export class AppService {
  private logger: Logger;
  constructor() {
    this.logger = new Logger('File Downloader');
  }
  async downloadFile(url: string): Promise<string> {
    console.log(url);
    const downloader = new Downloader({
      url,
      directory: process.env.DOWNLOAD_PATH,
    });
    try {
      const { downloadStatus } = await downloader.download();
      return downloadStatus;
    } catch (error) {
      this.logger.error('Error downloading file with: ', error.message);
    }
    // Get the url from the request body
    // Download the file
    // save it to the disk under the environment Variable DOWNLOAD_PATH
    // return the status of the download
  }
}
