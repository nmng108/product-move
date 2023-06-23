import { Schema, model, CallbackWithoutResultAndOptionalError } from "mongoose";
import User from "./user.interface";

enum UserRole {
	Admin = "admin",
	Producer = "producer",
	Distributor = "distributor",
	RetailStore = "retail-store",
	Customer = "customer",
}

const UserSchema = new Schema({
	username: { type: String, require: true, index: true },
	fullname: { type: String, require: true },
	phone: { type: String, require: true },
	email: { type: String, require: true },
	password: { type: String, require: true },
	role: { type: String, require: true },
	token: { type: String, require: false },
}, {
	timestamps: true
});

UserSchema.pre("save", async function (next: CallbackWithoutResultAndOptionalError) {
	console.log(this) // show new record in console before saving
});

const UserModel = model<User>('User', UserSchema, 'users');

export default UserModel
export { UserRole }
