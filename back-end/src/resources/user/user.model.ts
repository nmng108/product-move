import { Schema, model, CallbackWithoutResultAndOptionalError } from "mongoose";
import IUser, { UserRole } from "./user.interface";

export const UserSchema: Schema = new Schema<IUser>({
	username: { type: String, required: true, minlength: 4, maxlength: 30, index: true },
	fullname: { type: String, required: true },
	phone: { type: String, required: true },
	email: { type: String, required: false },
	password: { type: String, required: false },
	role: { type: String, required: true, enum: Object.values(UserRole), default: UserRole.Customer },
	token: { type: String, required: false },
}, {
	timestamps: true,
});

// UserSchema.pre("save", async function (next: CallbackWithoutResultAndOptionalError) {
// 	console.log(this) // show new record in console before saving
// });

const UserModel = model("User", UserSchema, 'users');

export default UserModel
