import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SKIP_LICENSE } from './skip-license.decorator';
import { SKIP_AUTH } from '../auth/jwt/skip-auth.decorator';
import { LicenseService } from './license.service';

/**
 * Bloqueia o acesso à API quando não existe uma licença válida em vigor.
 *
 * Rotas marcadas com @SkipLicense() ou @SkipAuth() (ex.: login e o próprio
 * módulo de licença) continuam acessíveis para permitir a ativação.
 */
@Injectable()
export class LicenseGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly licenseService: LicenseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_LICENSE, [
      context.getHandler(),
      context.getClass(),
    ]);
    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skip || skipAuth) {
      return true;
    }

    const valid = await this.licenseService.isLicenseValid();
    if (!valid) {
      throw new ForbiddenException(
        'Licença inválida ou expirada. Por favor, ative uma licença válida.',
      );
    }

    return true;
  }
}
