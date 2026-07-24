import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Pass } from './entities/pass.entity';
import { PassPayment } from './entities/pass-payment.entity';
import { PassTariff } from './entities/pass-tariff.entity';
import { PassCategory } from './entities/pass-category.entity';
import { Destination } from './entities/destination.entity';
import { PassCardSequence } from './entities/pass-card-sequence.entity';
import { PassReceiptSequence } from './entities/pass-receipt-sequence.entity';
import { CreatePassDto } from './dto/create-pass.dto';
import { UpdatePassDto } from './dto/update-pass.dto';
import { RenewPassDto } from './dto/renew-pass.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { FilterPassDto } from './dto/filter-pass.dto';
import { FilterPaymentDto } from './dto/filter-payment.dto';
import { User } from '../user/entities/user.entity';
import { EntityStatus } from './enums/entity-status.enum';
import { PassStatus } from './enums/pass-status.enum';
import { PaymentType } from './enums/payment-type.enum';
import {
  ReferenceMonth,
  monthIndexToReferenceMonth,
} from './enums/reference-month.enum';

@Injectable()
export class PassService {
  private readonly logger = new Logger(PassService.name);

  constructor(
    @InjectRepository(Pass)
    private readonly passRepository: Repository<Pass>,
    @InjectRepository(PassPayment)
    private readonly paymentRepository: Repository<PassPayment>,
    @InjectRepository(PassTariff)
    private readonly tariffRepository: Repository<PassTariff>,
    @InjectRepository(PassCategory)
    private readonly categoryRepository: Repository<PassCategory>,
    @InjectRepository(Destination)
    private readonly destinationRepository: Repository<Destination>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreatePassDto, user: User): Promise<Pass> {
    const { destination, category, tariff } = await this.validatePassRelations(
      dto.destinationId,
      dto.categoryId,
      dto.tariffId,
    );

    const now = new Date();
    const issueDate =
      dto.issueDate ?? now.toISOString().slice(0, 10);
    const cardYear = new Date(issueDate).getFullYear();
    const referenceMonth =
      dto.referenceMonth ?? monthIndexToReferenceMonth(now.getMonth());
    const referenceYear = dto.referenceYear ?? now.getFullYear();
    const discount = Number(dto.discount ?? 0);

    return this.dataSource.transaction(async (manager) => {
      const cardNumber = await this.generateCardNumber(manager, cardYear);

      const pass = manager.create(Pass, {
        cardNumber,
        cardYear,
        fullName: dto.fullName,
        identityNumber: dto.identityNumber,
        destinationId: destination.id,
        categoryId: category.id,
        tariffId: tariff.id,
        bairro: dto.bairro ?? null,
        rua: dto.rua ?? null,
        quarteirao: dto.quarteirao ?? null,
        casaNumero: dto.casaNumero ?? null,
        andar: dto.andar ?? null,
        unidade: dto.unidade ?? null,
        employerName: dto.employerName ?? null,
        schoolName: dto.schoolName ?? null,
        schoolClass: dto.schoolClass ?? null,
        schoolNumber: dto.schoolNumber ?? null,
        schoolGrade: dto.schoolGrade ?? null,
        bairroConfirmation: dto.bairroConfirmation ?? false,
        employerConfirmation: dto.employerConfirmation ?? false,
        schoolConfirmation: dto.schoolConfirmation ?? false,
        photo: dto.photo ?? null,
        status: dto.status ?? PassStatus.ACTIVE,
        issueDate,
        notes: dto.notes ?? null,
        createdBy: user,
        updatedBy: user,
      });

      const savedPass = await manager.save(Pass, pass);
      this.logger.log(
        `Pass created id=${savedPass.id} card=${cardNumber}/${cardYear}`,
      );

      if (dto.registerPayment !== false) {
        await this.createPaymentInTransaction(
          manager,
          {
            pass: savedPass,
            tariff,
            paymentType: PaymentType.REGISTRATION,
            referenceMonth,
            referenceYear,
            discount,
            notes: dto.notes,
            user,
            includeRegistrationFee: true,
            includeMonthlyAmount: true,
          },
        );
      }

      return this.findOneWithManager(manager, savedPass.id);
    });
  }

  async findAll(
    options: IPaginationOptions,
    filters: FilterPassDto,
  ): Promise<Pagination<Pass>> {
    const qb = this.passRepository
      .createQueryBuilder('pass')
      .leftJoinAndSelect('pass.destination', 'destination')
      .leftJoinAndSelect('pass.category', 'category')
      .leftJoinAndSelect('pass.tariff', 'tariff')
      .leftJoinAndSelect('pass.createdBy', 'createdBy')
      .where('pass.deletedAt IS NULL');

    if (filters.fullName) {
      qb.andWhere('pass.fullName ILIKE :fullName', {
        fullName: `%${filters.fullName}%`,
      });
    }
    if (filters.cardNumber) {
      qb.andWhere('pass.cardNumber ILIKE :cardNumber', {
        cardNumber: `%${filters.cardNumber}%`,
      });
    }
    if (filters.identityNumber) {
      qb.andWhere('pass.identityNumber ILIKE :identityNumber', {
        identityNumber: `%${filters.identityNumber}%`,
      });
    }
    if (filters.destinationId) {
      qb.andWhere('pass.destinationId = :destinationId', {
        destinationId: filters.destinationId,
      });
    }
    if (filters.categoryId) {
      qb.andWhere('pass.categoryId = :categoryId', {
        categoryId: filters.categoryId,
      });
    }
    if (filters.status) {
      qb.andWhere('pass.status = :status', { status: filters.status });
    }
    if (filters.search) {
      qb.andWhere(
        '(pass.fullName ILIKE :search OR pass.cardNumber ILIKE :search OR pass.identityNumber ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    const sortBy = filters.sortBy ?? 'createdAt';
    const sortOrder = filters.sortOrder === 'ASC' ? 'ASC' : 'DESC';
    const allowedSort = [
      'createdAt',
      'fullName',
      'cardNumber',
      'issueDate',
      'status',
    ];
    qb.orderBy(
      `pass.${allowedSort.includes(sortBy) ? sortBy : 'createdAt'}`,
      sortOrder,
    );

    return paginate(qb, options);
  }

  async findOne(id: number): Promise<Pass> {
    const pass = await this.passRepository.findOne({
      where: { id },
      relations: [
        'destination',
        'category',
        'tariff',
        'payments',
        'payments.cashier',
        'createdBy',
        'updatedBy',
      ],
      order: { payments: { paymentDate: 'DESC' } },
    });
    if (!pass) {
      throw new NotFoundException(`Pass with id ${id} not found`);
    }
    return pass;
  }

  async update(id: number, dto: UpdatePassDto, user: User): Promise<Pass> {
    const pass = await this.findOne(id);

    if (
      dto.destinationId ||
      dto.categoryId ||
      dto.tariffId
    ) {
      await this.validatePassRelations(
        dto.destinationId ?? pass.destinationId,
        dto.categoryId ?? pass.categoryId,
        dto.tariffId ?? pass.tariffId,
      );
    }

    Object.assign(pass, {
      ...dto,
      updatedBy: user,
    });

    await this.passRepository.save(pass);
    this.logger.log(`Pass updated id=${id}`);
    return this.findOne(id);
  }

  async remove(id: number, user: User): Promise<{ message: string }> {
    const pass = await this.findOne(id);
    pass.updatedBy = user;
    await this.passRepository.save(pass);
    await this.passRepository.softRemove(pass);
    this.logger.log(`Pass soft-deleted id=${id}`);
    return { message: 'Pass deleted successfully' };
  }

  async renew(dto: RenewPassDto, user: User): Promise<PassPayment> {
    return this.dataSource.transaction(async (manager) => {
      const pass = await manager.findOne(Pass, {
        where: { id: dto.passId },
        relations: ['tariff'],
      });
      if (!pass) {
        throw new NotFoundException(`Pass with id ${dto.passId} not found`);
      }
      if (
        pass.status === PassStatus.CANCELLED ||
        pass.status === PassStatus.SUSPENDED
      ) {
        throw new BadRequestException(
          `Cannot renew pass with status ${pass.status}`,
        );
      }

      const tariff = await manager.findOne(PassTariff, {
        where: { id: pass.tariffId },
      });
      if (!tariff) {
        throw new BadRequestException('Tariff not found for this pass');
      }

      const payment = await this.createPaymentInTransaction(manager, {
        pass,
        tariff,
        paymentType: PaymentType.MONTHLY,
        referenceMonth: dto.referenceMonth,
        referenceYear: dto.referenceYear,
        discount: Number(dto.discount ?? 0),
        notes: dto.notes,
        user,
        includeRegistrationFee: false,
        includeMonthlyAmount: true,
      });

      if (pass.status === PassStatus.EXPIRED) {
        pass.status = PassStatus.ACTIVE;
        pass.updatedBy = user;
        await manager.save(Pass, pass);
      }

      this.logger.log(
        `Pass renewed id=${pass.id} month=${dto.referenceMonth}/${dto.referenceYear}`,
      );
      return payment;
    });
  }

  async createPayment(
    dto: CreatePaymentDto,
    user: User,
  ): Promise<PassPayment> {
    return this.dataSource.transaction(async (manager) => {
      const pass = await manager.findOne(Pass, {
        where: { id: dto.passId },
        relations: ['tariff'],
      });
      if (!pass) {
        throw new NotFoundException(`Pass with id ${dto.passId} not found`);
      }

      const tariff = await manager.findOne(PassTariff, {
        where: { id: pass.tariffId },
      });
      if (!tariff) {
        throw new BadRequestException('Tariff not found for this pass');
      }

      const includeRegistrationFee =
        dto.paymentType === PaymentType.REGISTRATION;
      const includeMonthlyAmount =
        dto.paymentType === PaymentType.MONTHLY ||
        dto.paymentType === PaymentType.REGISTRATION;

      return this.createPaymentInTransaction(manager, {
        pass,
        tariff,
        paymentType: dto.paymentType,
        referenceMonth: dto.referenceMonth,
        referenceYear: dto.referenceYear,
        discount: Number(dto.discount ?? 0),
        notes: dto.notes,
        user,
        includeRegistrationFee,
        includeMonthlyAmount,
      });
    });
  }

  async findPayments(
    options: IPaginationOptions,
    filters: FilterPaymentDto,
  ): Promise<Pagination<PassPayment>> {
    const qb = this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.pass', 'pass')
      .leftJoinAndSelect('pass.destination', 'destination')
      .leftJoinAndSelect('pass.category', 'category')
      .leftJoinAndSelect('payment.cashier', 'cashier')
      .where('payment.deletedAt IS NULL');

    if (filters.passId) {
      qb.andWhere('payment.passId = :passId', { passId: filters.passId });
    }
    if (filters.destinationId) {
      qb.andWhere('pass.destinationId = :destinationId', {
        destinationId: filters.destinationId,
      });
    }
    if (filters.categoryId) {
      qb.andWhere('pass.categoryId = :categoryId', {
        categoryId: filters.categoryId,
      });
    }
    if (filters.cashierId) {
      qb.andWhere('payment.cashierId = :cashierId', {
        cashierId: filters.cashierId,
      });
    }
    if (filters.referenceMonth) {
      qb.andWhere('payment.referenceMonth = :referenceMonth', {
        referenceMonth: filters.referenceMonth,
      });
    }
    if (filters.referenceYear) {
      qb.andWhere('payment.referenceYear = :referenceYear', {
        referenceYear: filters.referenceYear,
      });
    }
    if (filters.paymentType) {
      qb.andWhere('payment.paymentType = :paymentType', {
        paymentType: filters.paymentType,
      });
    }
    if (filters.startDate) {
      qb.andWhere('payment.paymentDate >= :startDate', {
        startDate: filters.startDate,
      });
    }
    if (filters.endDate) {
      qb.andWhere('payment.paymentDate <= :endDate', {
        endDate: `${filters.endDate}T23:59:59.999Z`,
      });
    }
    if (filters.search) {
      qb.andWhere(
        '(pass.fullName ILIKE :search OR pass.cardNumber ILIKE :search OR payment.receiptNumber ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    const sortBy = filters.sortBy ?? 'paymentDate';
    const sortOrder = filters.sortOrder === 'ASC' ? 'ASC' : 'DESC';
    const allowedSort = [
      'paymentDate',
      'totalPaid',
      'referenceYear',
      'createdAt',
    ];
    qb.orderBy(
      `payment.${allowedSort.includes(sortBy) ? sortBy : 'paymentDate'}`,
      sortOrder,
    );

    return paginate(qb, options);
  }

  async findPaymentOne(id: number): Promise<PassPayment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: [
        'pass',
        'pass.destination',
        'pass.category',
        'pass.tariff',
        'cashier',
        'createdBy',
      ],
    });
    if (!payment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }
    return payment;
  }

  private async validatePassRelations(
    destinationId: number,
    categoryId: number,
    tariffId: number,
  ) {
    const destination = await this.destinationRepository.findOne({
      where: { id: destinationId, status: EntityStatus.ACTIVE },
    });
    if (!destination) {
      throw new BadRequestException('Destination not found or inactive');
    }

    const category = await this.categoryRepository.findOne({
      where: { id: categoryId, status: EntityStatus.ACTIVE },
    });
    if (!category) {
      throw new BadRequestException('Category not found or inactive');
    }
    if (category.destinationId !== destinationId) {
      throw new BadRequestException(
        'Category does not belong to the selected destination',
      );
    }

    const tariff = await this.tariffRepository.findOne({
      where: { id: tariffId, status: EntityStatus.ACTIVE },
    });
    if (!tariff) {
      throw new BadRequestException('Tariff not found or inactive');
    }
    if (tariff.categoryId !== categoryId) {
      throw new BadRequestException(
        'Tariff does not belong to the selected category',
      );
    }

    return { destination, category, tariff };
  }

  private async generateCardNumber(
    manager: EntityManager,
    year: number,
  ): Promise<string> {
    let sequence = await manager.findOne(PassCardSequence, {
      where: { year },
      lock: { mode: 'pessimistic_write' },
    });

    if (!sequence) {
      sequence = manager.create(PassCardSequence, { year, lastNumber: 0 });
      sequence = await manager.save(PassCardSequence, sequence);
      sequence = await manager.findOne(PassCardSequence, {
        where: { id: sequence.id },
        lock: { mode: 'pessimistic_write' },
      });
    }

    sequence!.lastNumber += 1;
    await manager.save(PassCardSequence, sequence!);

    const cardNumber = sequence!.lastNumber.toString().padStart(5, '0');

    const exists = await manager.findOne(Pass, {
      where: { cardNumber, cardYear: year },
      withDeleted: true,
    });
    if (exists) {
      throw new ConflictException(
        `Card number ${cardNumber} already exists for year ${year}`,
      );
    }

    return cardNumber;
  }

  private async generateReceiptNumber(
    manager: EntityManager,
  ): Promise<string> {
    const now = new Date();
    const prefix = `PASS-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;

    let sequence = await manager.findOne(PassReceiptSequence, {
      where: { prefix },
      lock: { mode: 'pessimistic_write' },
    });

    if (!sequence) {
      sequence = manager.create(PassReceiptSequence, {
        prefix,
        lastNumber: 0,
      });
      sequence = await manager.save(PassReceiptSequence, sequence);
      sequence = await manager.findOne(PassReceiptSequence, {
        where: { id: sequence.id },
        lock: { mode: 'pessimistic_write' },
      });
    }

    sequence!.lastNumber += 1;
    await manager.save(PassReceiptSequence, sequence!);

    return `${prefix}-${sequence!.lastNumber.toString().padStart(4, '0')}`;
  }

  private async createPaymentInTransaction(
    manager: EntityManager,
    params: {
      pass: Pass;
      tariff: PassTariff;
      paymentType: PaymentType;
      referenceMonth: ReferenceMonth;
      referenceYear: number;
      discount: number;
      notes?: string;
      user: User;
      includeRegistrationFee: boolean;
      includeMonthlyAmount: boolean;
    },
  ): Promise<PassPayment> {
    const {
      pass,
      tariff,
      paymentType,
      referenceMonth,
      referenceYear,
      discount,
      notes,
      user,
      includeRegistrationFee,
      includeMonthlyAmount,
    } = params;

    if (
      paymentType === PaymentType.MONTHLY ||
      paymentType === PaymentType.REGISTRATION
    ) {
      const duplicate = await manager.findOne(PassPayment, {
        where: {
          passId: pass.id,
          referenceMonth,
          referenceYear,
          paymentType,
        },
      });
      if (duplicate) {
        throw new ConflictException(
          `Payment already exists for pass ${pass.id}, ${referenceMonth}/${referenceYear}, type ${paymentType}`,
        );
      }
    }

    const monthlyAmount = includeMonthlyAmount
      ? Number(tariff.monthlyAmount)
      : 0;
    const registrationFee = includeRegistrationFee
      ? Number(tariff.registrationFee)
      : 0;
    const safeDiscount = Math.max(0, Number(discount) || 0);
    const totalPaid = Math.max(
      0,
      monthlyAmount + registrationFee - safeDiscount,
    );

    const receiptNumber = await this.generateReceiptNumber(manager);

    const payment = manager.create(PassPayment, {
      passId: pass.id,
      paymentType,
      referenceMonth,
      referenceYear,
      monthlyAmount,
      registrationFee,
      discount: safeDiscount,
      totalPaid,
      receiptNumber,
      paymentDate: new Date(),
      cashierId: user.id,
      notes: notes ?? null,
      createdBy: user,
      updatedBy: user,
    });

    const saved = await manager.save(PassPayment, payment);
    this.logger.log(
      `Pass payment created id=${saved.id} receipt=${receiptNumber} total=${totalPaid}`,
    );

    return manager.findOneOrFail(PassPayment, {
      where: { id: saved.id },
      relations: ['pass', 'cashier'],
    });
  }

  private async findOneWithManager(
    manager: EntityManager,
    id: number,
  ): Promise<Pass> {
    const pass = await manager.findOne(Pass, {
      where: { id },
      relations: [
        'destination',
        'category',
        'tariff',
        'payments',
        'payments.cashier',
        'createdBy',
        'updatedBy',
      ],
    });
    if (!pass) {
      throw new NotFoundException(`Pass with id ${id} not found`);
    }
    return pass;
  }
}
