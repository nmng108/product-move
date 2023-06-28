import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import Controller from "utils/interfaces/controller";
import UserModel from "resources/user/user.model";
import { ErrorResponseBody, HttpException } from "utils/exceptions";
import {
	ChangePasswordRequestBody,
	changePasswordValidation,
	CreateUserRequestBody,
	createValidation,
	SuccessResponseBody
} from "./user.validation";
import UserService from "./user.service";

/**
 * Controller/Management class for the 'users' collection.
 */
export class UserController extends Controller {
	protected static userService = new UserService();

	// Defines collection name & routes.
	public constructor() {
		super("/users");
		// authentication routes
		this.router.post(this.makePath('/sign-in'), UserController.signin);
		this.router.get(this.makePath('/log-out'), UserController.logout);
		// 'write data' routes
		this.router.post(this.collection, createValidation, UserController.create);
		this.router.patch(this.collection, UserController.changeInformation); // json-patch
		this.router.patch(this.makePath('/password'), changePasswordValidation, UserController.changePassword); // merge-patch
		this.router.delete(this.makePath('/:username'), UserController.delete);
		// 'retrieve data' route
		this.router.get(this.collection, UserController.getUsers);
		this.router.get(this.makePath('/:username'), UserController.getUser); // by username or id
	}

	private static async create(request: Request<any, any, CreateUserRequestBody>,
								response: Response<SuccessResponseBody | ErrorResponseBody>, next: NextFunction) {
		try {
			const newUser = await UserController.userService.create(request.body);
			console.log(newUser); // CHECK
			const { username, role } = newUser;
			response.status(201).send({ message: 'succeeded', data: { username, role } });
		} catch (error: any) {
			next(error);
		}
	}

	private static async signin(request: Request<{}, {}, { username: string, password: string }>,
								response: Response<SuccessResponseBody | ErrorResponseBody>, next: NextFunction) {
		try {
			let { username, password } = request.body
			let user = await UserModel.findOneAndUpdate({ username }, { token: "tokenxxskl" })

			if (!user) throw new HttpException(404, "User not found.");
			else {
				const matched = await bcrypt.compare(password, user.password as string);

				if (matched) {
					const { role, fullname, email } = user;
					response.status(200).json({ message: "signed in", data: { username, role, fullname } });
				} else {
					throw new HttpException(400, "Wrong password");
				}
			}
		} catch (error: any) {
			next(error);
		}
	}

	private static async logout(request: Request, response: Response<SuccessResponseBody | ErrorResponseBody>, next: NextFunction) {
		try {
			let { username } = request.body;
			let user = await UserModel.findOneAndUpdate({ username }, { token: "" });
			if (!user) throw new HttpException(404, "User not found");

			response.status(200).json({ message: "log out", data: user });
		} catch (error: any) {
			next(error);
		}
	}

	private static async changePassword(request: Request<{}, {}, ChangePasswordRequestBody>,
										response: Response<SuccessResponseBody | ErrorResponseBody>, next: NextFunction) {
		try {
			let {
				username,
				old_password: oldPassword,
				new_password: newPassword,
			} = request.body;

			await UserController.userService.changePassword({ username, oldPassword, newPassword });
			response.status(200).json({ message: "Changing password succeeded" });

		} catch (error: any) {
			next(error);
		}
	}

	private static async changeInformation(request: Request,
										   response: Response<SuccessResponseBody | ErrorResponseBody>, next: NextFunction) {
		response.status(200).send({ message: "unchanged" })
	}

	private static async delete(request: Request<{ username: string }>,
								response: Response<SuccessResponseBody | ErrorResponseBody>, next: NextFunction) {
		let deletedRecord: any;

		deletedRecord = await UserModel.findOneAndDelete({ username: request.params.username })
			.catch(reason => response.status(400).send());

		response.status(200).json(deletedRecord);
	}

	private static async getUser(request: Request<{ username: string }>,
								 response: Response<SuccessResponseBody | ErrorResponseBody>, next: NextFunction) {
		try {
			let result = await UserController.userService.retrievesOne(request.params.username);
			if (result) response.status(200).json({ message: 'fetched', data: result });

		} catch (error: any) {
			next(error);
		}
	}

	/**
	 * Get all records based on specified criteria: none, role or set of usernames.
	 */
	private static async getUsers(request: Request<{}, {}, {}, { role: string, usernames: string }>,
								  response: Response<any | ErrorResponseBody>, next: NextFunction) {
		try {
			let result = await UserController.userService.retrievesMany(request.query);
			// exceptions should be caught in the retrievesMany() call; now only make response
			if (result) response.status(result.length ? 200 : 204).json(result);

		} catch (error: any) {
			next(error);
		}
	}
}
