import Joi from "joi";
import { validationMiddleware } from "middleware/validation.middleware";
import IUser, { UserConstrains as Constraints, UserRole } from "./user.interface";

/***
 * All body format must synchronize with their corresponding form validations
 * Flow of definition:
 * 		request body format (interface)
 * 		-> schema: Joi.SchemaMap
 * 		-> Joi.ObjectSchema (via Joi.object())
 * 		-> validation middleware
 * ***/
/** */

export type SuccessResponseBody = {
	message?: string | Array<string>,
	data?: any,
}

export interface CommonRespondedUserInfo {
	username: IUser['username'];
	fullname?: IUser['fullname'];
	email?: IUser['email'];
	phone?: IUser['phone'];
	role?: IUser['role'];
}

// Create new user

interface CreateUserRequestBody {
	username: IUser['username'];
	fullname: IUser['fullname'];
	phone?: IUser['phone'];
	email?: IUser['email'];
	password: IUser['password'];
	re_password: IUser['password'];
	role: IUser['role'];
}

const createValidation = validationMiddleware(Joi.object<CreateUserRequestBody>({
	username: Joi.string().required()
		.min(Constraints.username.minlength)
		.max(Constraints.username.maxlength)
		.alphanum().normalize("NFC"),
	fullname: Joi.string().required().normalize("NFC"),
	phone: Joi.string().min(Constraints.phone.minlength).max(Constraints.phone.maxlength)
		.pattern(/^(0|(\+84))[1-9][0-9]{8}$/),
	email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: [ 'com', 'net', 'vn', 'org' ] } }),
	password: Joi.string().required()
		.min(Constraints.password.minlength)
		.max(Constraints.password.maxlength)
		.normalize("NFC")
		.regex(/^[\w@\.\-_]{3,50}$/),
	re_password: Joi.ref('password'),
	role: Joi.string().required().normalize("NFC").lowercase()
		.valid(...Constraints.role.validValues).default(UserRole.Customer),
}));

export { CreateUserRequestBody, createValidation }

// Change password

interface ChangePasswordRequestBody {
	username: string;
	old_password: string,
	new_password: string,
	re_password: string,
}

const changePasswordValidation = validationMiddleware(Joi.object<ChangePasswordRequestBody>({
	username: Joi.string().required()
		.min(Constraints.username.minlength)
		.max(Constraints.username.maxlength)
		.alphanum().normalize("NFC"),
	old_password: Joi.string().required()
		.min(Constraints.password.minlength)
		.max(Constraints.password.maxlength)
		.normalize("NFC")
		.regex(/^[\w@\.\-_]{3,50}$/),
	new_password: Joi.string().required()
		.min(Constraints.password.minlength)
		.max(Constraints.password.maxlength)
		.normalize("NFC")
		.regex(/^[\w@\.\-_]{3,50}$/),
	re_password: Joi.ref('new_password'),
}))

export { ChangePasswordRequestBody, changePasswordValidation }

// Change role

interface ChangeRoleRequestBody {
	username: IUser['username'];
	role: IUser['role'],
}

const changeRoleValidation = validationMiddleware(Joi.object<ChangeRoleRequestBody>({
	username: Joi.string().required()
		.min(Constraints.username.minlength)
		.max(Constraints.username.maxlength)
		.alphanum().normalize("NFC"),
	role: Joi.string().required().normalize("NFC").lowercase()
		.valid(...Constraints.role.validValues),
}))

export { ChangeRoleRequestBody, changeRoleValidation }
