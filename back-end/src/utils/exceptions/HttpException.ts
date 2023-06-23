import { STATUS_CODES } from "http";

class HttpException extends Error {
	public statusCode: number;

	constructor(statusCode: number, message?: string) {
		if (statusCode < 400 || statusCode > 599) {
			throw new Error("Invalid passing status code to HttpException.")
		}

		super(message ?? STATUS_CODES[statusCode]);
		this.name = 'HttpException'
		this.statusCode = statusCode;
	}
}

export default HttpException
