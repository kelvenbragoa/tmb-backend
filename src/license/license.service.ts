import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { License, LicenseStatus } from './entities/license.entity';
import { LicenseActivation } from './entities/license-activation.entity';
import { GenerateLicenseDto } from './dto/generate-license.dto';

@Injectable()
export class LicenseService {
  constructor(
    @InjectRepository(License)
    private readonly licenseRepository: Repository<License>,
    @InjectRepository(LicenseActivation)
    private readonly activationRepository: Repository<LicenseActivation>,
  ) {}

  /**
   * Gera N chaves de licença no catálogo (uso do fornecedor).
   * As chaves geradas são entregues ao cliente para ativação.
   */
  async generate(dto: GenerateLicenseDto): Promise<License[]> {
    const quantity = dto.quantity ?? 1;
    const durationDays = dto.duration_days ?? 365;

    const licenses: License[] = [];
    for (let i = 0; i < quantity; i++) {
      const license = this.licenseRepository.create({
        key: this.generateKey(),
        status: LicenseStatus.UNUSED,
        duration_days: durationDays,
      });
      licenses.push(license);
    }

    return this.licenseRepository.save(licenses);
  }

  /**
   * Ativa uma licença a partir da chave fornecida pelo cliente.
   * - Verifica se a chave existe e ainda não foi usada.
   * - Marca a licença como usada.
   * - Cria o registo da licença em vigor (início = agora, fim = início + duração).
   * - Desativa qualquer licença anteriormente em vigor.
   */
  async activate(key: string, userId?: number): Promise<LicenseActivation> {
    const license = await this.licenseRepository.findOne({
      where: { key: key.trim() },
    });

    if (!license) {
      throw new NotFoundException('Licença inválida.');
    }

    if (license.status === LicenseStatus.USED) {
      throw new ConflictException('Esta licença já foi utilizada.');
    }

    // Desativar a licença atualmente em vigor, se existir
    await this.activationRepository.update(
      { is_active: true },
      { is_active: false },
    );

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + license.duration_days);

    license.status = LicenseStatus.USED;
    license.activated_at = startDate;
    await this.licenseRepository.save(license);

    const activation = this.activationRepository.create({
      license_id: license.id,
      start_date: startDate,
      end_date: endDate,
      is_active: true,
      activated_by: userId,
    });

    return this.activationRepository.save(activation);
  }

  /** Devolve a licença atualmente em vigor (ou null). */
  async getCurrentActivation(): Promise<LicenseActivation | null> {
    return this.activationRepository.findOne({
      where: { is_active: true },
      relations: ['license'],
      order: { start_date: 'DESC' },
    });
  }

  /** Estado da licença em vigor, com dias restantes. */
  async getStatus() {
    const activation = await this.getCurrentActivation();

    if (!activation) {
      return {
        active: false,
        valid: false,
        message: 'Nenhuma licença ativada.',
      };
    }

    const now = new Date();
    const endDate = new Date(activation.end_date);
    const valid = endDate.getTime() >= now.getTime();
    const daysRemaining = Math.max(
      0,
      Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
    );

    return {
      active: true,
      valid,
      start_date: activation.start_date,
      end_date: activation.end_date,
      days_remaining: daysRemaining,
      message: valid
        ? `Licença válida. Expira em ${daysRemaining} dia(s).`
        : 'Licença expirada.',
    };
  }

  /** Indica se existe uma licença válida em vigor. */
  async isLicenseValid(): Promise<boolean> {
    const activation = await this.getCurrentActivation();
    if (!activation) {
      return false;
    }
    return new Date(activation.end_date).getTime() >= Date.now();
  }

  /** Lista o catálogo de licenças. */
  async findAll(): Promise<License[]> {
    return this.licenseRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /** Gera uma chave no formato XXXX-XXXX-XXXX-XXXX. */
  private generateKey(): string {
    const raw = randomBytes(10).toString('hex').toUpperCase();
    return raw.match(/.{1,4}/g)!.slice(0, 4).join('-');
  }
}
