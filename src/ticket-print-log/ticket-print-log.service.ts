import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { TicketPrintLog } from './entities/ticket-print-log.entity';
import { CreateTicketPrintLogDto } from './dto/create-ticket-print-log.dto';
import { User } from '../user/entities/user.entity';
import { TicketSale } from '../ticket-sale/entities/ticket-sale.entity';
import { PenaltyTicketSale } from '../penalty-ticket-sale/entities/penalty-ticket-sale.entity';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class TicketPrintLogService {
  constructor(
    @InjectRepository(TicketPrintLog)
    private readonly ticketPrintLogRepository: Repository<TicketPrintLog>,
    @InjectRepository(TicketSale)
    private readonly ticketSaleRepository: Repository<TicketSale>,
    @InjectRepository(PenaltyTicketSale)
    private readonly penaltyTicketSaleRepository: Repository<PenaltyTicketSale>,
    private readonly dataSource: DataSource,
  ) {}

  async createPrintLogs(
    createPrintLogDtos: CreateTicketPrintLogDto[],
    user: User,
  ): Promise<TicketPrintLog[]> {
    return await this.dataSource.transaction(async (manager) => {
      const savedLogs: TicketPrintLog[] = [];

      for (const dto of createPrintLogDtos) {
        const printLog = manager.create(TicketPrintLog, {
          ...dto,
          printed_at: new Date(dto.printed_at),
          createdBy: user,
          updatedBy: user,
        });

        const savedLog = await manager.save(TicketPrintLog, printLog);
        savedLogs.push(savedLog);

        // Atualizar contador de impressões na venda original se for reimpressão
        // if (dto.is_reprint) {
        //   if (dto.sale_type === 'regular' && dto.ticket_sale_id) {
        //     await manager.increment(
        //       TicketSale,
        //       { id: dto.ticket_sale_id },
        //       'print_count',
        //       1,
        //     );
        //     await manager.update(
        //       TicketSale,
        //       { id: dto.ticket_sale_id },
        //       { last_printed_at: new Date(dto.printed_at) },
        //     );
        //   } else if (dto.sale_type === 'penalty' && dto.penalty_ticket_sale_id) {
        //     await manager.increment(
        //       PenaltyTicketSale,
        //       { id: dto.penalty_ticket_sale_id },
        //       'print_count',
        //       1,
        //     );
        //     await manager.update(
        //       PenaltyTicketSale,
        //       { id: dto.penalty_ticket_sale_id },
        //       { last_printed_at: new Date(dto.printed_at) },
        //     );
        //   }
        // }
      }

      return savedLogs;
    });
  }

  async findAll(
    options: IPaginationOptions,
    filters?: {
      session_id?: number;
      operator_id?: number;
      sale_type?: 'regular' | 'penalty';
      is_reprint?: boolean;
      startDate?: string;
      endDate?: string;
    },
  ): Promise<Pagination<TicketPrintLog>> {
    const queryBuilder = this.ticketPrintLogRepository
      .createQueryBuilder('printLog')
      .leftJoinAndSelect('printLog.operator', 'operator')
      .leftJoinAndSelect('printLog.route', 'route')
      .leftJoinAndSelect('printLog.routeTicket', 'routeTicket')
      .leftJoinAndSelect('routeTicket.ticketType', 'ticketType')
      .where('printLog.deletedAt IS NULL');

    if (filters?.session_id) {
      queryBuilder.andWhere('printLog.session_id = :sessionId', {
        sessionId: filters.session_id,
      });
    }

    if (filters?.operator_id) {
      queryBuilder.andWhere('printLog.operator_id = :operatorId', {
        operatorId: filters.operator_id,
      });
    }

    if (filters?.sale_type) {
      queryBuilder.andWhere('printLog.sale_type = :saleType', {
        saleType: filters.sale_type,
      });
    }

    if (filters?.is_reprint !== undefined) {
      queryBuilder.andWhere('printLog.is_reprint = :isReprint', {
        isReprint: filters.is_reprint,
      });
    }

    if (filters?.startDate) {
      queryBuilder.andWhere('printLog.printed_at >= :startDate', {
        startDate: new Date(filters.startDate),
      });
    }

    if (filters?.endDate) {
      queryBuilder.andWhere('printLog.printed_at <= :endDate', {
        endDate: new Date(filters.endDate),
      });
    }

    queryBuilder.orderBy('printLog.printed_at', 'DESC');

    return await paginate<TicketPrintLog>(queryBuilder, options);
  }

  async findBySession(
    sessionId: number,
    options: IPaginationOptions,
  ): Promise<Pagination<TicketPrintLog>> {
    return this.findAll(options, { session_id: sessionId });
  }

  async getReprintStats(sessionId?: number) {
    const queryBuilder = this.ticketPrintLogRepository
      .createQueryBuilder('printLog')
      .where('printLog.deletedAt IS NULL');

    if (sessionId) {
      queryBuilder.andWhere('printLog.session_id = :sessionId', { sessionId });
    }

    const totalPrints = await queryBuilder.getCount();
    const reprints = await queryBuilder
      .andWhere('printLog.is_reprint = :isReprint', { isReprint: true })
      .getCount();

    const reprintsByReason = await queryBuilder
      .select('printLog.reprint_reason', 'reason')
      .addSelect('COUNT(*)', 'count')
      .groupBy('printLog.reprint_reason')
      .getRawMany();

    return {
      total_prints: totalPrints,
      total_reprints: reprints,
      reprint_percentage: totalPrints > 0 ? (reprints / totalPrints) * 100 : 0,
      reprints_by_reason: reprintsByReason,
    };
  }
}
