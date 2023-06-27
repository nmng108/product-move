import { Document } from "mongoose";
import UserModel, { UserSchema } from "./user.model";

export enum UserRole {
	Admin = "admin",
	Producer = "producer",
	Distributor = "distributor",
	RetailStore = "retail-store",
	Customer = "customer",
}

export default interface IUser extends Document {
	username: string;
	fullname: string;
	phone: string;
	email: string;
	password: string;
	role: string;
	token: string;
}

export const UserConstrains = {
	username: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 30,
	},
	fullname: {
		type: String,
		required: false,
	},
	phone: {
		type: String,
		required: false,
		startsWith: [ "0", "+" ],
		minlength: 10,
		maxlength: 12,
	},
	email: {
		type: String,
		required: false,
		minLength: 5,
		minDomainSegments: 2,
	},
	role: {
		type: String,
		required: true,
		validValues: Object.values(UserRole)
	},
	password: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 50,
	},
}
