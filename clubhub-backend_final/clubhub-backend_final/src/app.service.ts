import { Injectable } from '@nestjs/common'; //import the service from the @nestjs/common package. In Nest.js

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
