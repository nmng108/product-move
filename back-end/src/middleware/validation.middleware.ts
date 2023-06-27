import { NextFunction, Request, Response } from "express";
import { Schema, ValidationError } from "joi";
import { errorResponseBody } from "../utils/exceptions";

function validationMiddleware(schema: Schema) {
	return async function (request: Request, response: Response, next: NextFunction): Promise<void> {
		try {
			request.body = await schema.validateAsync(request.body, {
				abortEarly: false,
				allowUnknown: false,
				stripUnknown: true,
			});
			next();

		} catch (errors: any) {
			console.log(errors) // CHECK
			let returnedCode: number;
			const allErrors: any[] = [];

			if (errors instanceof ValidationError) {
				returnedCode = 400;
				errors.details.forEach((err) => allErrors.push(err));
			} else {
				returnedCode = 500;
			}

			response
				.status(returnedCode)
				.json(errorResponseBody(returnedCode, allErrors.length != 0 ? allErrors : errors.message));
		}
	}
}

export { validationMiddleware };
