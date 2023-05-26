import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Role } from 'src/authentication/enums/role.enum';

export type UserDocument = Document & User;

@Schema()
export class User {
    @Prop()
    username: string;
    @Prop()
    password: string;
    @Prop()
    name: string;
    @Prop()
    email: string;
    @Prop()
    numberphone: string;
    @Prop()
    role: Role[];
    @Prop()
    address: string;
    @Prop()
    refreshToken: string;
    @Prop()
    refreshTokenExp: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
