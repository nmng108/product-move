import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Brand } from 'src/admin/schemas/brand.schema';
import { Product } from 'src/admin/schemas/product.schema';

export type StorageDLPPDocument = Document & StorageDLPP;

@Schema()
export class StorageDLPP {
    @Prop()
    dlppID: string;

    @Prop()
    brand: any[];

}

export const StorageDLPPSchema = SchemaFactory.createForClass(StorageDLPP)