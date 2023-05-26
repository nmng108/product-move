import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Brand } from 'src/admin/schemas/brand.schema';
import { Product } from 'src/admin/schemas/product.schema';

export type getProductDocument = Document & getProduct;

@Schema()
export class getProduct {
    @Prop()
    dlppID: string;

    @Prop()
    cssxID: string;

    @Prop()
    brandID: string;

    @Prop()
    productID: string;

    @Prop()
    soluong: number;

    @Prop()
    status: boolean;

}

export const getProductSchema = SchemaFactory.createForClass(getProduct)