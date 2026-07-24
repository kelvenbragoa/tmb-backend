import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pass } from './entities/pass.entity';
import { PassPayment } from './entities/pass-payment.entity';
import { PaymentType } from './enums/payment-type.enum';
import { PassStatus } from './enums/pass-status.enum';
import { ReferenceMonth } from './enums/reference-month.enum';
import {
  PassReportsSummary,
  PassStatusCountItem,
  RevenueByCategoryItem,
  RevenueByDestinationItem,
  RevenueByMonthItem,
  RevenueByOperatorItem,
} from './interfaces/pass-reports.interface';

@Injectable()
export class PassReportsService {
  constructor(
    @InjectRepository(Pass)
    private readonly passRepository: Repository<Pass>,
    @InjectRepository(PassPayment)
    private readonly paymentRepository: Repository<PassPayment>,
  ) {}

  async revenueByMonth(
    year?: number,
  ): Promise<RevenueByMonthItem[]> {
    const qb = this.paymentRepository
      .createQueryBuilder('payment')
      .select('payment.referenceYear', 'year')
      .addSelect('payment.referenceMonth', 'month')
      .addSelect('SUM(payment.totalPaid)', 'totalAmount')
      .addSelect('COUNT(payment.id)', 'paymentCount')
      .where('payment.deletedAt IS NULL')
      .andWhere('payment.paymentType IN (:...types)', {
        types: [PaymentType.REGISTRATION, PaymentType.MONTHLY],
      })
      .groupBy('payment.referenceYear')
      .addGroupBy('payment.referenceMonth')
      .orderBy('payment.referenceYear', 'DESC')
      .addOrderBy('payment.referenceMonth', 'ASC');

    if (year) {
      qb.andWhere('payment.referenceYear = :year', { year });
    }

    const rows = await qb.getRawMany();
    return rows.map((row) => ({
      year: Number(row.year),
      month: row.month,
      totalAmount: Number(row.totalAmount),
      paymentCount: Number(row.paymentCount),
    }));
  }

  async revenueByCategory(
    year?: number,
    month?: ReferenceMonth,
  ): Promise<RevenueByCategoryItem[]> {
    const qb = this.paymentRepository
      .createQueryBuilder('payment')
      .innerJoin('payment.pass', 'pass')
      .innerJoin('pass.category', 'category')
      .select('category.id', 'categoryId')
      .addSelect('category.name', 'categoryName')
      .addSelect('SUM(payment.totalPaid)', 'totalAmount')
      .addSelect('COUNT(payment.id)', 'paymentCount')
      .where('payment.deletedAt IS NULL')
      .andWhere('payment.paymentType IN (:...types)', {
        types: [PaymentType.REGISTRATION, PaymentType.MONTHLY],
      })
      .groupBy('category.id')
      .addGroupBy('category.name')
      .orderBy('SUM(payment.totalPaid)', 'DESC');

    if (year) {
      qb.andWhere('payment.referenceYear = :year', { year });
    }
    if (month) {
      qb.andWhere('payment.referenceMonth = :month', { month });
    }

    const rows = await qb.getRawMany();
    return rows.map((row) => ({
      categoryId: Number(row.categoryId),
      categoryName: row.categoryName,
      totalAmount: Number(row.totalAmount),
      paymentCount: Number(row.paymentCount),
    }));
  }

  async revenueByDestination(
    year?: number,
    month?: ReferenceMonth,
  ): Promise<RevenueByDestinationItem[]> {
    const qb = this.paymentRepository
      .createQueryBuilder('payment')
      .innerJoin('payment.pass', 'pass')
      .innerJoin('pass.destination', 'destination')
      .select('destination.id', 'destinationId')
      .addSelect('destination.name', 'destinationName')
      .addSelect('SUM(payment.totalPaid)', 'totalAmount')
      .addSelect('COUNT(payment.id)', 'paymentCount')
      .where('payment.deletedAt IS NULL')
      .andWhere('payment.paymentType IN (:...types)', {
        types: [PaymentType.REGISTRATION, PaymentType.MONTHLY],
      })
      .groupBy('destination.id')
      .addGroupBy('destination.name')
      .orderBy('SUM(payment.totalPaid)', 'DESC');

    if (year) {
      qb.andWhere('payment.referenceYear = :year', { year });
    }
    if (month) {
      qb.andWhere('payment.referenceMonth = :month', { month });
    }

    const rows = await qb.getRawMany();
    return rows.map((row) => ({
      destinationId: Number(row.destinationId),
      destinationName: row.destinationName,
      totalAmount: Number(row.totalAmount),
      paymentCount: Number(row.paymentCount),
    }));
  }

  async revenueByOperator(
    year?: number,
    month?: ReferenceMonth,
  ): Promise<RevenueByOperatorItem[]> {
    const qb = this.paymentRepository
      .createQueryBuilder('payment')
      .innerJoin('payment.cashier', 'cashier')
      .select('cashier.id', 'cashierId')
      .addSelect('cashier.name', 'cashierName')
      .addSelect('SUM(payment.totalPaid)', 'totalAmount')
      .addSelect('COUNT(payment.id)', 'paymentCount')
      .where('payment.deletedAt IS NULL')
      .andWhere('payment.paymentType IN (:...types)', {
        types: [PaymentType.REGISTRATION, PaymentType.MONTHLY],
      })
      .groupBy('cashier.id')
      .addGroupBy('cashier.name')
      .orderBy('SUM(payment.totalPaid)', 'DESC');

    if (year) {
      qb.andWhere('payment.referenceYear = :year', { year });
    }
    if (month) {
      qb.andWhere('payment.referenceMonth = :month', { month });
    }

    const rows = await qb.getRawMany();
    return rows.map((row) => ({
      cashierId: Number(row.cashierId),
      cashierName: row.cashierName,
      totalAmount: Number(row.totalAmount),
      paymentCount: Number(row.paymentCount),
    }));
  }

  async passesByStatus(): Promise<PassStatusCountItem[]> {
    const rows = await this.passRepository
      .createQueryBuilder('pass')
      .select('pass.status', 'status')
      .addSelect('COUNT(pass.id)', 'count')
      .where('pass.deletedAt IS NULL')
      .groupBy('pass.status')
      .getRawMany();

    return rows.map((row) => ({
      status: row.status,
      count: Number(row.count),
    }));
  }

  async summary(
    year: number,
    month: ReferenceMonth,
  ): Promise<PassReportsSummary> {
    const monthIndex = [
      'JANUARY',
      'FEBRUARY',
      'MARCH',
      'APRIL',
      'MAY',
      'JUNE',
      'JULY',
      'AUGUST',
      'SEPTEMBER',
      'OCTOBER',
      'NOVEMBER',
      'DECEMBER',
    ].indexOf(month);
    const start = `${year}-${String(monthIndex + 1).padStart(2, '0')}-01`;
    const endDate = new Date(year, monthIndex + 1, 0);
    const end = endDate.toISOString().slice(0, 10);

    const newPassesCount = await this.passRepository
      .createQueryBuilder('pass')
      .where('pass.deletedAt IS NULL')
      .andWhere('pass.issueDate >= :start', { start })
      .andWhere('pass.issueDate <= :end', { end })
      .getCount();

    const renewals = await this.paymentRepository
      .createQueryBuilder('payment')
      .where('payment.deletedAt IS NULL')
      .andWhere('payment.paymentType = :type', { type: PaymentType.MONTHLY })
      .andWhere('payment.referenceMonth = :month', { month })
      .andWhere('payment.referenceYear = :year', { year })
      .getCount();

    const statusCounts = await this.passesByStatus();
    const countByStatus = (status: PassStatus) =>
      statusCounts.find((s) => s.status === status)?.count ?? 0;

    const renewedPassIds = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('DISTINCT payment.passId', 'passId')
      .where('payment.deletedAt IS NULL')
      .andWhere('payment.paymentType = :type', { type: PaymentType.MONTHLY })
      .andWhere('payment.referenceMonth = :month', { month })
      .andWhere('payment.referenceYear = :year', { year })
      .getRawMany();

    const renewedIds = renewedPassIds.map((r) => Number(r.passId));

    let notRenewedInMonth = 0;
    const activePasses = countByStatus(PassStatus.ACTIVE);
    if (renewedIds.length === 0) {
      notRenewedInMonth = activePasses;
    } else {
      notRenewedInMonth = await this.passRepository
        .createQueryBuilder('pass')
        .where('pass.deletedAt IS NULL')
        .andWhere('pass.status = :status', { status: PassStatus.ACTIVE })
        .andWhere('pass.id NOT IN (:...renewedIds)', { renewedIds })
        .getCount();
    }

    return {
      newPasses: newPassesCount,
      renewals,
      activePasses,
      expiredPasses: countByStatus(PassStatus.EXPIRED),
      suspendedPasses: countByStatus(PassStatus.SUSPENDED),
      cancelledPasses: countByStatus(PassStatus.CANCELLED),
      notRenewedInMonth,
    };
  }
}
