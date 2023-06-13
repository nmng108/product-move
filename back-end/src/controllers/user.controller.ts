import { Request, Response } from "express";
import { UserModel } from "../models";
import bcrypt from "bcrypt";

export async function registerUser(request: Request, response: Response) {
	try {
		let { username, fullname, email, phone, role, password, re_password } = request.body
		let hashedPassword = await bcrypt.genSalt(8)
		hashedPassword = await bcrypt.hash(password, hashedPassword)

		const newUser = new UserModel({ username, fullname, email, phone, role, password: hashedPassword })
		await newUser.save()
		response.status(201).json(newUser)
	} catch (error: any) {
		console.log(error)
		response.status(400).json({ error: error.message })
	} finally {
		// response.end('error4xx')
	}
}

export async function signin(request: Request, response: Response) {
	try {
		let { username, password } = request.body
		// let hashedPassword = await bcrypt.genSalt(8)
		// hashedPassword = await bcrypt.hash(password, hashedPassword)
		let user = await UserModel.findOneAndUpdate({username}, {token: "tokenxxskl"})

		if (!user) throw new Error("Specified user not found")
		else {
			const isMatched = await bcrypt.compare(password, user.password as string)
			if (isMatched) {
				user = await UserModel.findOne({username})

				response.json(user)
			}
			else throw new Error("Wrong password")
		}
	} catch (error: any) {
		response.status(404).json({ error: error.message })
	}
}

export async function logout(request: Request, response: Response) {
	try {
		let { username } = request.body
		let user = await UserModel.findOneAndUpdate({ username }, { token: "" })

		if (!user) throw new Error("User not found")

		user = await UserModel.findOne({ username })
		response.status(200).json(user)
	} catch (error: any) {
		response.status(404).json({ error: error.message })
	}
}

export async function deleteUser(request: Request, response: Response) {

}

export async function getUser(request: Request, response: Response) {
	try {
		// console.log(request.headers.authorization)
		let result: object | null

		if (typeof request.params.username == 'string') {
			result = await UserModel.where({ username: request.params.username }).findOne()
		} else {
			result = await UserModel.find()
		}

		if (result) response.json(result)
		else throw new Error("User not found")
		// const allUsers = UserModel.
	} catch (error: any) {
		response.status(404).json({ error: error.message })
	}
}
