import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Raw, Repository } from 'typeorm';
import { Session } from '../session/entities/session.entity';
import { TicketSale } from '../ticket-sale/entities/ticket-sale.entity';
import { PenaltyTicketSale } from '../penalty-ticket-sale/entities/penalty-ticket-sale.entity';
import { CashierReportDto } from './dto/cashier-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(TicketSale)
    private readonly ticketSaleRepository: Repository<TicketSale>,
    @InjectRepository(PenaltyTicketSale)
    private readonly penaltyTicketSaleRepository: Repository<PenaltyTicketSale>,
  ) {}

  async getCashierReport(filters: CashierReportDto) {
    const { date, operatorId } = filters;

    const sessions = await this.sessionRepository.find({
      where: [
        {
          createdBy: { id: operatorId },
          createdAt: Raw((alias) => `DATE(${alias}) = :date`, { date }),
        },
        {
          closed_by_id: operatorId,
          createdAt: Raw((alias) => `DATE(${alias}) = :date`, { date }),
        },
      ],
      relations: ['operator', 'shift', 'createdBy', 'updatedBy', 'closedBy'],
    });

    if (!sessions.length) {
      throw new NotFoundException(
        'Este usuario caixa nao criou nehuma sessão nesta data. Por favor verifique os dados. O relatório é gerado com base na data de criação da sessão e no usuário que a fechou a sessão. Se o usuário criou sessões em outras datas ou se as sessões foram fechadas por outro usuário, elas não aparecerão neste relatório.',
      );
    }

    const totalAmount = sessions.reduce(
      (sum, session) => sum + Number(session.total_amount),
      0,
    );

    const totalAmountByShift = [
      ...sessions
        .reduce((map, session) => {
          const existing = map.get(session.shift_id);
          if (existing) {
            existing.totalAmount += Number(session.total_amount);
          } else {
            map.set(session.shift_id, {
              shift_id: session.shift_id,
              shift_name: session.shift?.name ?? null,
              totalAmount: Number(session.total_amount),
            });
          }
          return map;
        }, new Map<
          number | null,
          {
            shift_id: number | null;
            shift_name: string | null;
            totalAmount: number;
          }
        >()),
    ].map((entry) => entry[1]);

    const sessionIds = sessions.map((session) => session.id);

    const sessionShiftMap = new Map(
      sessions.map((session) => [
        session.id,
        {
          shift_id: session.shift_id,
          shift_name: session.shift?.name ?? null,
        },
      ]),
    );

    const ticketSales = await this.ticketSaleRepository.find({
      where: {
        session_id: In(sessionIds),
      },
      relations: ['routeTicket', 'routeTicket.ticketType', 'route'],
    });

    const penaltyTicketSales = await this.penaltyTicketSaleRepository.find({
      where: {
        session_id: In(sessionIds),
      },
      relations: ['routeTicket', 'routeTicket.ticketType', 'route'],
    });

    const salesByTicketType = [
      ...ticketSales
        .reduce((map, sale) => {
          const key = sale.routeTicket.ticket_type_id;
          const existing = map.get(key);
          if (existing) {
            existing.quantity += sale.quantity;
            existing.total_amount += Number(sale.total);
          } else {
            map.set(key, {
              ticket_type_id: key,
              ticket_type_name: sale.routeTicket.ticketType.name,
              ticket_price: Number(sale.routeTicket.price),
              quantity: sale.quantity,
              total_amount: Number(sale.total),
            });
          }
          return map;
        }, new Map<
          number,
          {
            ticket_type_id: number;
            ticket_type_name: string;
            ticket_price: number;
            quantity: number;
            total_amount: number;
          }
        >()),
    ].map((entry) => entry[1]);

    const totalAmountByShiftAndRoute = [
      ...ticketSales
        .reduce(
          (shiftMap, sale) => {
            const { shift_id, shift_name } = sessionShiftMap.get(
              sale.session_id,
            )!;
            let shiftEntry = shiftMap.get(shift_id);
            if (!shiftEntry) {
              shiftEntry = {
                shift_id,
                shift_name,
                routes: new Map<
                  number,
                  {
                    route_id: number;
                    route_name: string;
                    total_amount: number;
                  }
                >(),
              };
              shiftMap.set(shift_id, shiftEntry);
            }
            const existingRoute = shiftEntry.routes.get(sale.route_id);
            if (existingRoute) {
              existingRoute.total_amount += Number(sale.total);
            } else {
              shiftEntry.routes.set(sale.route_id, {
                route_id: sale.route_id,
                route_name: sale.route.name,
                total_amount: Number(sale.total),
              });
            }
            return shiftMap;
          },
          new Map<
            number | null,
            {
              shift_id: number | null;
              shift_name: string | null;
              routes: Map<
                number,
                {
                  route_id: number;
                  route_name: string;
                  total_amount: number;
                }
              >;
            }
          >(),
        ),
    ].map((entry) => ({
      shift_id: entry[1].shift_id,
      shift_name: entry[1].shift_name,
      routes: [...entry[1].routes.values()],
    }));

    const salesByRouteTicketMap = new Map<
      number,
      {
        route_ticket_id: number;
        route_name: string;
        ticket_type_name: string;
        price: number;
        penalty_price: number;
        regular_tickets: number;
        penalty_tickets: number;
        total_amount: number;
      }
    >();

    ticketSales.forEach((sale) => {
      const key = sale.route_ticket_id;
      if (!salesByRouteTicketMap.has(key)) {
        salesByRouteTicketMap.set(key, {
          route_ticket_id: key,
          route_name: sale.route.name,
          ticket_type_name: sale.routeTicket.ticketType.name,
          price: Number(sale.price_at_sale),
          penalty_price: Number(sale.routeTicket.penalty_price),
          regular_tickets: 0,
          penalty_tickets: 0,
          total_amount: 0,
        });
      }
      const data = salesByRouteTicketMap.get(key)!;
      data.regular_tickets += sale.quantity;
      data.total_amount += Number(sale.total);
    });

    penaltyTicketSales.forEach((sale) => {
      const key = sale.route_ticket_id;
      if (!salesByRouteTicketMap.has(key)) {
        salesByRouteTicketMap.set(key, {
          route_ticket_id: key,
          route_name: sale.route.name,
          ticket_type_name: sale.routeTicket.ticketType.name,
          price: Number(sale.routeTicket.price),
          penalty_price: Number(sale.penalty_price_at_sale),
          regular_tickets: 0,
          penalty_tickets: 0,
          total_amount: 0,
        });
      }
      const data = salesByRouteTicketMap.get(key)!;
      data.penalty_tickets += sale.quantity;
      data.total_amount += Number(sale.total);
    });

    const salesByRouteTicket = Array.from(salesByRouteTicketMap.values())
      .map((item) => ({
        ...item,
        total_tickets: item.regular_tickets + item.penalty_tickets,
      }))
      .sort((a, b) => b.total_amount - a.total_amount);

    return {
      sessions,
      totalAmount,
      totalAmountByShift,
      salesByTicketType,
      totalAmountByShiftAndRoute,
      salesByRouteTicket,
    };
  }
}
