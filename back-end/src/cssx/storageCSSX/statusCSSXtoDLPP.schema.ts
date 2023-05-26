import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type StatusCSSXtoDLPPDocument = Document & StatusCSSXtoDLPP;

@Schema()
export class StatusCSSXtoDLPP {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Product', index: true})
    productID: string;

    @Prop()
    soluong: number;

    @Prop()
    storeID: string;

    @Prop()
    status: string;
}

export const StatusCSSXtoDLPPSchema = SchemaFactory.createForClass(StatusCSSXtoDLPP)