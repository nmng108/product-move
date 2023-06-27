import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { HttpException } from "utils/exceptions";
import UserModel from "./user.model";
import { CreateUserRequestBody } from "./user.validation";

/**
 * This class provides request handling methods (which may correspond to UserController's methods);
 * includes database access & other operations.
 *
 * Methods inside this should not handle and send response on behalf of their corresponding controllers (if any).
 */
class UserService {
	public constructor() {
	}

	/**
	 * Create new user.
	 * @param user { IUser }
	 * @returns Promise<User | unknown>
	 */
	public async create(user: CreateUserRequestBody): Promise<any> {
		let newUser: any;

		try {
			newUser = user; // includes all required fields firstly

			const existingUser = await UserModel.findOne({ username: user.username });
			if (existingUser) throw new HttpException(409, "Username has existed.");

			if (newUser.phone) {
				if (newUser.phone[0] == '0') newUser.phone = `+84${ newUser.phone.substring(1) }` // format phone number to +84...
			}

			newUser.password = await bcrypt.hash(newUser.password, 8);

			newUser = new UserModel(newUser);
			newUser = await newUser.save();

		} catch (errors: any) {
			if (errors instanceof mongoose.Error) {
				console.log("got db err")
				if (errors.name === "ValidatorError") {
					throw new HttpException(400, "Invalid request body.");
				} else {
					throw new HttpException(500, errors);
				}
			} else {
				throw errors;
			}
		}

		return newUser;
	}

	// should be a transaction
	public async changePassword(params: { username: string, oldPassword: string, newPassword: string }): Promise<any> {
		if (params.oldPassword === params.newPassword) {
			throw new HttpException(400, "New password and current password must not be the same");
		}

		let currentRecord = await UserModel.findOne({ username: params.username }, "username password");
		if (!currentRecord) throw new HttpException(404, "User not found");
		if (!await bcrypt.compare(params.oldPassword, currentRecord.password)) {
			throw new HttpException(400, "Wrong current password.");
		}

		const password = await bcrypt.hash(params.newPassword, 8);
		currentRecord = await UserModel.findOneAndUpdate({ username: params.username }, { password });
		if (!currentRecord) throw new HttpException(500, "Server has got an error");
		let changedRecord = await UserModel.findOne({ username: params.username }, "username password");
		if (!changedRecord) throw new HttpException(500, "Server has got an error");

		if (changedRecord.password === password) {
			return true;
		} else if (changedRecord.password === currentRecord.password) {
			throw new HttpException(500, "Password unchanged");
		}

		throw new HttpException(500);
	}

	/**
	 * Query user by username.
	 */
	public async retrievesOne(username: string): Promise<any> {
		let result: any;
		console.log("run 0")

		result = await UserModel.where({ username: { $in: [ username ] } }).findOne();
		console.log("run 1")
		if (!result) {
			// allows to query by _id
			result = await UserModel.findOne({ _id: username });
		}

		if (result) return result;
		else throw new HttpException(404, "User not found");
	}

	/**
	 * Query multiple users by role and/or set of usernames.
	 */
	public async retrievesMany(query: { usernames?: string, role?: string }): Promise<Array<any> | any> {
		let result: Array<any>;
		const { role, usernames } = query;
		type Filter = { // different from the request.query's type
			role?: string,
			username?: string | Array<string>,
		}
		const filter: Filter = {};

		if (typeof role !== 'undefined') filter.role = role;
		if (typeof usernames !== 'undefined') {
			filter.username = [ ...new Set(usernames.split(',')) ]; // original form: { $in: [] }
		}

		result = await UserModel.find(filter);

		if (result) return result;
		else throw new HttpException(404, "User not found");
	}
}

export default UserService
