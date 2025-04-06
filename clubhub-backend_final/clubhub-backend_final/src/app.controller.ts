import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guard';

//you can declare @Controller('product') and then you can access to it domain.com/product
//in this case you just have to access on domain.com
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() // Public route, no guard needed
  getRoot() {
    return { message: 'Welcome to the API!' };
  }

  @Get('protected') // Protected route, requires AuthGuard
  @UseGuards(AuthGuard)
  someProtectedRoutes(@Req() req) {
    return { message: 'Accessed Protected Resource', userId: req.userId };
  }
}
