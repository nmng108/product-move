import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Product } from './product.schema';

export type TtbhDocument = Document & Ttbh;

@Schema()
export class Ttbh {
    @Prop()
    name: string;
    @Prop()
    date_register: Date;
    @Prop()
    date_active: Date;
    @Prop()
    namePerson: string;
    @Prop()
    address: string;
    @Prop()
    username: string;
    @Prop()
    password: string;
    @Prop()
    numberOfWorkers: number;
    @Prop()
    contact: string;
    @Prop()
    representativeID: string;
}

export const TtbhSchema = SchemaFactory.createForClass(Ttbh);