// src/auth/jwt/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? '',
    });
  }

  async validate(payload: User) {
    // console.log('🔍 JWT Payload recebido:', payload);

    // ✅ USAR findById em vez de findOne
    const user = await this.userService.findById(payload.id);

    if (!user) {
      // console.log('❌ Usuário não encontrado:', payload.id);
      return null;
    }

    if (user.role !== payload.role) {
      // console.log('❌ Role não confere:', {
      //   userRole: user.role,
      //   payloadRole: payload.role,
      // });
      return null;
    }

    // console.log('✅ Usuário validado:', {
    //   id: user.id,
    //   username: user.username,
    //   role: user.role,
    // });

    return {
      id: payload.id,
      username: payload['username'],
      role: payload.role,
    };
  }
}
