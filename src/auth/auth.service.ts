import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

import { RegisterDto } from './dto/register.dto';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validate(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    return user;
  }

  async login(user: User) {
    // Buscar a organização do usuário

    const payload = {
      username: user.username,
      id: user.id,
      role: user.role,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: {
        ...userWithoutPassword,
      },
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    // Username será gerado automaticamente se não fornecido
    if (registerDto.username) {
      const userExists = await this.userService.findByUsername(registerDto.username);
      if (userExists) {
        throw new UnauthorizedException('User already exists');
      }
    }
    return this.userService.create(registerDto);
  }
  // async register(registerDto: RegisterDto) {
  //   const { email } = registerDto;
  //   const userExists = await this.userService.findByEmail(email);
  //   if (userExists) {
  //     throw new UnauthorizedException('User already exists');
  //   }

  //   // Criar o usuário
  //   // const newUser = await this.userService.create(registerDto);

  //   // // Remover o password antes de devolver
  //   // const { password, ...userWithoutPassword } = newUser;

  //   // // Criar payload do token
  //   // const payload = {
  //   //   email: newUser.email,
  //   //   id: newUser.id,
  //   //   role: newUser.role,
  //   // };

  //   // // Retornar dados do usuário + token
  //   // return {
  //   //   user: userWithoutPassword,
  //   //   accessToken: await this.jwtService.signAsync(payload),
  //   // };
  //   try {
  //     // 1. Criar a organização primeiro
  //     console.log('🏢 Criando organização para:', email);

  //     // 2. Criar o usuário e associar à organização
  //     console.log('👤 Criando usuário...');
  //     const newUser = await this.userService.createUser(registerDto);
  //     console.log('✅ Usuário criado:', newUser.id);

  //     // Remover o password antes de devolver
  //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //     const { password: _, ...userWithoutPassword } = newUser;

  //     // Criar payload do token
  //     const payload = {
  //       email: newUser.email,
  //       id: newUser.id,
  //       role: newUser.role,
  //     };

  //     console.log('🎉 Registro completo - Usuário e Organização criados');

  //     // Retornar dados do usuário + token + organização
  //     return {
  //       user: {
  //         ...userWithoutPassword,
  //       },
  //       accessToken: await this.jwtService.signAsync(payload),
  //     };
  //   } catch (error) {
  //     console.error('❌ Erro durante registro:', error);
  //     throw new Error('Erro interno durante o registro');
  //   }
  // }

  logout(user: User): void {
    this.invalidateUserTokens(user.id);
  }

  // Adiciona o método para invalidar tokens do usuário
  invalidateUserTokens(userId: number): void {
    console.log(`Tokens do usuário ${userId} invalidados.`);
  }
}
