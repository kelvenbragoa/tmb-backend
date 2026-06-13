import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { DataSource } from 'typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  // Array com os dados de vários usuários
  const usersDto: CreateUserDto[] = [
    {
      name: 'Admin',
      username: 'admin',
      password: '12345678',
    },
    {
      name: 'User1',
      username: 'user1',
      password: '12345678',
    },
    {
      name: 'User2',
      username: 'user2',
      password: '12345678',
    },
    {
      name: 'User3',
      username: 'user3',
      password: '12345678',
    },
  ];


  // Criar cada usuário
  for (const userDto of usersDto) {
    try {
      // await UserService.(userDto);
      console.log(`✅ User created: ${userDto.name}`);
    } catch (error) {
      console.error(`❌ Failed to create user ${userDto.name}:`, error);
    }
  }



  // Usar QueryRunner para transação
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    await queryRunner.commitTransaction();
    console.log('🎉 All seeds created successfully!');
  } catch (error) {
    // Reverter transação em caso de erro
    await queryRunner.rollbackTransaction();
    console.error('💥 Transaction failed, rolling back:', error);
  } finally {
    // Liberar queryRunner
    await queryRunner.release();
  }

  await app.close();
}

bootstrap();
