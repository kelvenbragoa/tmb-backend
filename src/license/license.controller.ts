import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { LicenseService } from './license.service';
import { ActivateLicenseDto } from './dto/activate-license.dto';
import { GenerateLicenseDto } from './dto/generate-license.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '../user/entities/role.enum';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { SkipLicense } from './skip-license.decorator';

@Controller({ path: 'license', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@SkipLicense()
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}

  /** Ativa uma licença fornecida ao cliente. */
  @Post('activate')
  @Roles(Role.ADMIN)
  activate(@Body() dto: ActivateLicenseDto, @GetUser() user: User) {
    return this.licenseService.activate(dto.key, user?.id);
  }

  /** Estado da licença em vigor. */
  @Get('status')
  @Roles(Role.ADMIN)
  status() {
    return this.licenseService.getStatus();
  }

  /** Catálogo de licenças (uso interno/fornecedor). */
  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.licenseService.findAll();
  }

  /** Gera novas chaves de licença (uso do fornecedor). */
  @Post('generate')
  @Roles(Role.ADMIN)
  generate(@Body() dto: GenerateLicenseDto) {
    return this.licenseService.generate(dto);
  }
}
