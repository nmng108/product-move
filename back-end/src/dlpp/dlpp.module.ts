import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from 'src/admin/admin.module';
import { DlppController } from './dlpp.controller';
import { DlppService } from './dlpp.service';
import { getProductSchema } from './schema/getProduct.schema';
import { StorageDLPPSchema } from './schema/storageDLPP.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
        [
            {name: 'StorageDLPP', schema: StorageDLPPSchema},
            {name: 'getProduct', schema: getProductSchema},
        ]
    ),
    AdminModule
  ],
  providers: [DlppService],
  controllers: [DlppController],
  exports: [DlppService]
})
export class DlppModule {}
