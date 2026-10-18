import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Swagger esta en localhost:3000/api';
  }
}
