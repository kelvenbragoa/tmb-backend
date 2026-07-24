import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Destination } from './entities/destination.entity';
import { PassCategory } from './entities/pass-category.entity';
import { PassTariff } from './entities/pass-tariff.entity';
import { Pass } from './entities/pass.entity';
import { PassPayment } from './entities/pass-payment.entity';
import { PassCardSequence } from './entities/pass-card-sequence.entity';
import { PassReceiptSequence } from './entities/pass-receipt-sequence.entity';
import { DestinationService } from './destination.service';
import { DestinationController } from './destination.controller';
import { PassCategoryService } from './pass-category.service';
import { PassCategoryController } from './pass-category.controller';
import { PassTariffService } from './pass-tariff.service';
import { PassTariffController } from './pass-tariff.controller';
import { PassService } from './pass.service';
import { PassController } from './pass.controller';
import { PassReportsService } from './pass-reports.service';
import { PassReportsController } from './pass-reports.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Destination,
      PassCategory,
      PassTariff,
      Pass,
      PassPayment,
      PassCardSequence,
      PassReceiptSequence,
    ]),
  ],
  controllers: [
    DestinationController,
    PassCategoryController,
    PassTariffController,
    PassController,
    PassReportsController,
  ],
  providers: [
    DestinationService,
    PassCategoryService,
    PassTariffService,
    PassService,
    PassReportsService,
  ],
  exports: [
    DestinationService,
    PassCategoryService,
    PassTariffService,
    PassService,
    PassReportsService,
  ],
})
export class PassModule {}
