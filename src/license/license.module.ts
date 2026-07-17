import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LicenseController } from './license.controller';
import { LicenseService } from './license.service';
import { License } from './entities/license.entity';
import { LicenseActivation } from './entities/license-activation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([License, LicenseActivation])],
  controllers: [LicenseController],
  providers: [LicenseService],
  exports: [LicenseService],
})
export class LicenseModule {}
