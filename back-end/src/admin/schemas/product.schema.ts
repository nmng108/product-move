import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Brand } from './brand.schema';

export type ProductDocument = Document & Product;

@Schema()
export class Product {
    @Prop()
    name: string;
    @Prop()
    length: number;
    @Prop()
    width: number;
    @Prop()
    height: number;
    @Prop()
    weight: number;
    @Prop()
    speed: number;
    @Prop()
    image: string;
    @Prop()
    color: string;
    @Prop()
    price: number;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Brand', index: true})
    brand: string;

    @Prop()
    soluong: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);