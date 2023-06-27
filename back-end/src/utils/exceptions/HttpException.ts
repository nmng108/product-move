import { STATUS_CODES } from "http";
import { Response } from "express";
import { ErrorMessage, errorResponseBody, ErrorResponseBody } from "./index";

class HttpException extends Error {
	public statusCode: number;
	public errorMessage?: ErrorMessage; // replace the default this.message
	public responseBody: ErrorResponseBody;

	public constructor(statusCode: number, message?: ErrorMessage) {
		if (statusCode < 400 || statusCode > 599) {
			throw new Error("Invalid passing status code to HttpException.")
		}

		super();
		// this.name = "HttpException";
		this.statusCode = statusCode;
		this.errorMessage = message;
		this.responseBody = errorResponseBody(statusCode, message);
	}

	public toString(): string {
		return JSON.stringify(this.responseBody);
	}

	public send(response: Response<ErrorResponseBody>) {
		return response.status(this.statusCode).json(this.responseBody);
	}
}

export default HttpException
