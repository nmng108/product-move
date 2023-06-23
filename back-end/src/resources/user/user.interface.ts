import { Document } from "mongoose";

export default interface User extends Document {
	username: string;
	fullname: string;
	phone: string;
	email: string;
	password: string;
	role: string;
	token: string;
}
