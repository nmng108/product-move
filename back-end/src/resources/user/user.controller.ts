import bcrypt from "bcrypt";
import { Request, Response, Router } from "express";
import Controller from "utils/interfaces/controller";
import UserModel from "resources/user/user.model";
import { HttpException } from "utils/exceptions";

export class UserController extends Controller {
	protected path: string = '/users';

	constructor() {
		super();
		this.router.post(this.path, UserController.create);
		this.router.post(this.getPath('/signin'), UserController.signin);
		this.router.get(this.getPath('/logout'), UserController.logout);
		this.router.patch(this.path, UserController.changeInformation); // choose merge-patch or json-patch
		this.router.patch(this.path, UserController.changePassword); // choose merge-patch or json-patch
		this.router.delete(this.getPath('/:username'), UserController.delete); // by username or id
		this.router.get(this.path, UserController.getUser);
		this.router.get(this.getPath('/:username'), UserController.getUser);
	}

	private static async create(request: Request, response: Response) {
		try {
			let { username, fullname, email, phone, role, password, re_password } = request.body

			if (re_password != password) {
				throw new HttpException(400, "The confirmation password doesn't match.");
			}

			const existing = await UserModel.findOne({ username });
			if (existing) throw new HttpException(409)
			let hashedPassword = await bcrypt.genSalt(8)
			hashedPassword = await bcrypt.hash(password, hashedPassword)

			const newUser = new UserModel({ username, fullname, email, phone, role, password: hashedPassword })
			await newUser.save()
			response.status(201).json({ username })
		} catch (error: any) {
			console.log(error)

			if (error instanceof HttpException) {
				response.status(error.statusCode).json({
					status_code: error.statusCode,
					error: error.message,
				});
			} else {
				response.status(500).json({
					status_code: 500,
					error: error.message,
				});
			}
		}
	}

	private static async signin(request: Request, response: Response) {
		try {
			let { username, password } = request.body
			let user = await UserModel.findOneAndUpdate({ username }, { token: "tokenxxskl" })

			if (!user) throw new HttpException(404, "User not found.")
			else {
				const isMatched = await bcrypt.compare(password, user.password as string)
				if (isMatched) {
					user = await UserModel.findOne({ username })

					response.json(user)
				} else {
					throw new HttpException(400, "Wrong password")
				}
			}
		} catch (error: any) {
			if (error instanceof HttpException) {
				response.status(error.statusCode).json({
					status_code: error.statusCode,
					error: error.message,
				})
			} else {
				response.status(500).send('...');
			}
		}
	}

	private static async logout(request: Request, response: Response) {
		try {
			let { username } = request.body
			let user = await UserModel.findOneAndUpdate({ username }, { token: "" })

			if (!user) throw new HttpException(404, "User not found")

			user = await UserModel.findOne({ username })
			response.status(200).json(user)
		} catch (error: any) {
			if (error instanceof HttpException) {
				response.status(error.statusCode).json({
					status_code: error.statusCode,
					error: error.message,
				})
			} else {
				response.status(500).send('...');
			}
		}
	}

	private static async changePassword(request: Request, response: Response) {
		response.status(204).send('...')
	}

	private static async changeInformation(request: Request, response: Response) {
		response.status(204).send('...')
	}

	private static async delete(request: Request, response: Response) {
		let deletedRecord

		if (typeof request.params.username == "string") {
			deletedRecord = await UserModel.findOneAndDelete({ username: request.params.username })
				.catch(reason => response.status(400).send())
		} else if (typeof request.params.id == "string") {
			deletedRecord = await UserModel.findOneAndDelete({ _id: request.params.id })
				.catch(reason => response.status(400).send())
		}

		response.status(200).send(deletedRecord.username)
	}

	private static async getUser(request: Request, response: Response) {
		try {
			// console.log(request.headers.authorization)
			let result: object | null

			if (typeof request.params.username == 'string') {
				result = await UserModel.where({ username: request.params.username }).findOne()
			} else if (typeof request.params.id == 'string') {
				result = await UserModel.where({ _id: request.params.id }).findOne()
			} else {
				result = await UserModel.find()
			}

			if (result) response.json(result)
			else throw new HttpException(404, "User not found")
			// const allUsers = UserModel.
		} catch (error: any) {
			if (error instanceof HttpException) {
				response.status(error.statusCode).json({
					status_code: error.statusCode,
					error: error.message,
				})
			} else {
				response.status(500).send('...');
			}
		}
	}
}
