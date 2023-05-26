import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Brand, BrandSchema } from './schemas/brand.schema';
import { CssxSchema } from './schemas/cssx.schema';
import { DlppSchema } from './schemas/dlpp.schema';
import { Product, ProductSchema } from './schemas/product.schema';
import { TtbhSchema } from './schemas/ttbh.schema';
import { User, UserSchema } from './schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {name: 'Product', schema: ProductSchema},
                {name: 'Brand', schema: BrandSchema},
                {name: 'User', schema: UserSchema},
                {name: 'Cssx', schema: CssxSchema},
                {name: 'Dlpp', schema: DlppSchema},
                {name: 'Ttbh', schema: TtbhSchema},
                
            ]
        ),
    ],
    controllers: [AdminController],
    providers: [AdminService],
    exports: [AdminService]
})
export class AdminModule {}
