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

	private static create = UserController.method<Request<any, any, CreateUserRequestBody>,
		SuccessResponseBody | ErrorResponseBody>(
		async function (request, response) {
			const newUser = await UserController.userService.create(request.body);
			console.log(newUser); // CHECK
			const { username, role } = newUser;
			response.status(201).send({ message: 'succeeded', data: { username, role } });
		}
	)

	private static signin = UserController.method<Request<{}, {}, { username: string, password: string }>,
		SuccessResponseBody | ErrorResponseBody>(
		async function (request, response) {
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
		}
	)

	private static logout = UserController.method<Request,
		SuccessResponseBody | ErrorResponseBody>(
		async function (request, response) {
			let { username } = request.body;
			let user = await UserModel.findOneAndUpdate({ username }, { token: "" });
			if (!user) throw new HttpException(404, "User not found");

			response.status(200).json({ message: "log out", data: user });
		}
	)

	private static changePassword = UserController.method<Request<{}, {}, ChangePasswordRequestBody>,
		SuccessResponseBody | ErrorResponseBody>(
		async function (request, response) {
			let {
				username,
				old_password: oldPassword,
				new_password: newPassword,
			} = request.body;

			await UserController.userService.changePassword({ username, oldPassword, newPassword });
			response.status(200).json({ message: "Changing password succeeded" });
		}
	)

	private static changeInformation = UserController.method<Request<{ username: string }>,
		SuccessResponseBody | ErrorResponseBody>(
		async function (request, response) {
			response.status(200).send({ message: "unchanged" })
		}
	)

	private static delete = UserController.method<Request<{ username: string }>,
		SuccessResponseBody | ErrorResponseBody>(
		async function (request, response) {
			let deletedRecord = await UserModel.findOneAndDelete({ username: request.params.username })
			if (deletedRecord) response.status(200).json({ message: "deleted", data: deletedRecord });
			else throw new HttpException(404);
		}
	)

	private static getUser = UserController.method<Request<{ username: string }>,
		SuccessResponseBody | ErrorResponseBody>(
		async function (request, response) {
			let result = await UserController.userService.retrievesOne(request.params.username);
			if (result) response.status(200).json({ message: 'fetched', data: result });
		}
	)


	/**
	 * Get all records based on specified criteria: none, role or set of usernames.
	 */
	private static getUsers = UserController.method<Request<{}, {}, {}, { role: string, usernames: string }>,
		Array<any> | ErrorResponseBody>(
		async function (request, response) {
			let result = await UserController.userService.retrievesMany(request.query);
			// exceptions should be caught in the retrievesMany() call; now only make response
			if (result) response.status(result.length ? 200 : 204).json(result);
		}
	)

}
