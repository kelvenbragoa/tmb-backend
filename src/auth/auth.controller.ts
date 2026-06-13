import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request as Req,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './local/local-auth.guard';
import { Request } from './types';
import { SkipAuth } from './jwt/skip-auth.decorator';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { RolesGuard } from './roles/roles.guard';
import { Roles } from './roles/roles.decorator';
import { Role } from '../user/entities/role.enum';
import { GetUser } from './decorators/get-user.decorator';
import { User } from 'src/user/entities/user.entity';

@SkipAuth()
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  register(@Body() registerDto: RegisterDto, @GetUser() user: User) {
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Req() req: Request) {
    return {
        message: 'Logout realizado com sucesso',
        statusCode: HttpStatus.OK,
      };
    // try {
    //   this.authService.logout(req.user);
    //   return {
    //     message: 'Logout realizado com sucesso',
    //     statusCode: HttpStatus.OK,
    //   };
    // } catch (error) {
    //   throw new UnauthorizedException(error);
    // }
  }
}
