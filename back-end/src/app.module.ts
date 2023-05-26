import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { AdminModule } from './admin/admin.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './authentication/auth.module';
import { CssxModule } from './cssx/cssx.module';
import { DlppController } from './dlpp/dlpp.controller';
import { DlppModule } from './dlpp/dlpp.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/productmove'),
    AdminModule,
    AuthModule,
    CssxModule,
    DlppModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
