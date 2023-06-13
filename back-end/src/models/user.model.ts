import mongoose from "mongoose";

enum UserRole {
	Admin = "admin",
	Producer = "producer",
	Distributor = "distributor",
	RetailStore = "retail-store",
}

const UserSchema = new mongoose.Schema({
	// _id: {type: Number, require: true},
	username: {type: String, require: true},
	fullname: {type: String, require: true},
	phone: {type: String, require: true},
	email: {type: String, require: true},
	password: {type: String, require: true},
	role: {type: String, require: true},
	token: {type: String, require: false},
}, {
	timestamps: true
});

UserSchema.pre("save", async (next: mongoose.CallbackWithoutResultAndOptionalError) => {
	console.log(this)
})

const UserModel = mongoose.model('User', UserSchema, 'users');

export default UserModel
export { UserRole }
