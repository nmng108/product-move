import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Brand } from 'src/admin/schemas/brand.schema';
import { Product } from 'src/admin/schemas/product.schema';

export type StorageCSSXDocument = Document & StorageCSSX;

@Schema()
export class StorageCSSX {
    @Prop()
    cssxID: string;

    @Prop()
    brand: any[];

}

export const StorageCSSXSchema = SchemaFactory.createForClass(StorageCSSX)