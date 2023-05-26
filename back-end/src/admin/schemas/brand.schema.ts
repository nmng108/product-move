import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Product } from './product.schema';

export type BrandDocument = Document & Brand;

@Schema()
export class Brand {
    @Prop()
    name: string;
    @Prop()
    country: string;
    @Prop()
    image: string;

    @Prop()
    product: any[];
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
