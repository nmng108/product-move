import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from 'src/admin/admin.module';
import { AdminService } from 'src/admin/admin.service';
import { DlppModule } from 'src/dlpp/dlpp.module';
import { CssxController } from './cssx.controller';
import { CssxService } from './cssx.service';
import { StatusCSSXtoDLPPSchema } from './storageCSSX/statusCSSXtoDLPP.schema';
import { StorageCSSXSchema } from './storageCSSX/storageCSSX.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
        [
            {name: 'StorageCSSX', schema: StorageCSSXSchema},
            {name: 'StatusCSSXtoDLPP', schema: StatusCSSXtoDLPPSchema}        
        ]
    ),
    AdminModule,
    DlppModule
],
  controllers: [CssxController],
  providers: [CssxService]
})
export class CssxModule {}
