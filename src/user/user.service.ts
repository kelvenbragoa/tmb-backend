import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private async generateUniqueUsername(name: string): Promise<string> {
    // Pegar os primeiros 4 caracteres do nome (sem espaços e em minúsculas)
    const baseName = name.replace(/\s+/g, '').toLowerCase().substring(0, 4);
    let username = baseName;
    let counter = 1;

    // Verificar se o username já existe
    while (await this.findByUsername(username)) {
      username = `${baseName}${counter}`;
      counter++;
    }

    return username;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { ...userData } = createUserDto;

    // Gerar username se não foi fornecido
    if (!userData.username) {
      userData.username = await this.generateUniqueUsername(userData.name);
    }

    console.log('🔍 Dados para criar usuário:', {
      ...userData,
    });

    // ✅ CORREÇÃO: Criar usuário com organization_id explícito
    const user = this.userRepository.create({
      ...userData,
    });

    console.log('📝 Entidade User criada (antes de salvar):', {
      name: user.name,
      username: user.username,
    });

    const savedUser = await this.userRepository.save(user);

    console.log('💾 Usuário salvo:', {
      id: savedUser.id,
      name: savedUser.name,
      username: savedUser.username,
    });

    return savedUser;
  }

  async create(createUserDto: CreateUserDto) {
    // Gerar username se não foi fornecido
    if (!createUserDto.username) {
      createUserDto.username = await this.generateUniqueUsername(createUserDto.name);
    }

    const user = this.userRepository.create({
      ...createUserDto,
    });
    await this.userRepository.insert(user);
    return user;
  }

  async findAll(options: IPaginationOptions, organizationId?: number) {
    const whereCondition = {};
    return paginate(this.userRepository, options, {
      select: ['id', 'name', 'username', 'role'],
      where: whereCondition,
      order: { name: 'ASC' }
    });
  }

  async findOne(id: number) {
    const result = await this.userRepository.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return result;
  }

  async findByUsername(username: string) {
    return await this.userRepository.findOne({ where: { username } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // Hash password if provided
    let hashedPassword: string | undefined;
    if (updateUserDto.password) {
      hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
    }
    
    const result = await this.userRepository.update(id, {
      name: updateUserDto.name ? updateUserDto.name : undefined,
      username: updateUserDto.username ? updateUserDto.username : undefined,
      password: hashedPassword,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return result;
  }

  async remove(id: number) {
    const result = await this.userRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return result;
  }

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async getProfile(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'name', 'username', 'role', 'is_active', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if username is being changed and if it's already in use
    if (updateProfileDto.username && updateProfileDto.username !== user.username) {
      const existingUser = await this.findByUsername(updateProfileDto.username);
      if (existingUser) {
        throw new BadRequestException('Username already in use');
      }
    }

    await this.userRepository.update(userId, updateProfileDto);
    return await this.getProfile(userId);
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'password'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    // Update password
    await this.userRepository.update(userId, { password: hashedPassword });

    return { message: 'Password changed successfully' };
  }
}
