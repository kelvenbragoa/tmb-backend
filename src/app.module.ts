import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt/jwt-auth.guard';
import { RolesGuard } from './auth/roles/roles.guard';
import { CostumerModule } from './costumer/costumer.module';
import { CostumerCategoryModule } from './costumer-category/costumer-category.module';
import { TicketTypeModule } from './ticket-type/ticket-type.module';
import { TransportRouteModule } from './transport-route/transport-route.module';
import { TransportRouteCategoryModule } from './transport-route-category/transport-route-category.module';
import { TransportRouteStopModule } from './transport-route-stop/transport-route-stop.module';
import { RouteTicketModule } from './route-ticket/route-ticket.module';
import { SessionModule } from './session/session.module';
import { TicketSaleModule } from './ticket-sale/ticket-sale.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DriversModule } from './drivers/drivers.module';
import { ShiftsModule } from './shifts/shifts.module';
import { PenaltyTicketSaleModule } from './penalty-ticket-sale/penalty-ticket-sale.module';
import { TicketPrintLogModule } from './ticket-print-log/ticket-print-log.module';
import { SessionActivityLogModule } from './session-activity-log/session-activity-log.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: (process.env.DB as 'postgres' | 'mysql' | undefined) ?? 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true, // Temporariamente desabilitado para resolver conflito de índice
      // entities: [User],
      autoLoadEntities: true,
    }),
    UserModule,
    AuthModule,
    CostumerModule,
    CostumerCategoryModule,
    TicketTypeModule,
    TransportRouteModule,
    TransportRouteCategoryModule,
    TransportRouteStopModule,
    RouteTicketModule,
    SessionModule,
    TicketSaleModule,
    PenaltyTicketSaleModule,
    TicketPrintLogModule,
    VehicleModule,
    DashboardModule,
    ShiftsModule,
    DriversModule,
    SessionActivityLogModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
