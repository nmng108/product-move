import { STATUS_CODES } from "http";

export { default as HttpException } from "./HttpException";

export type ErrorMessage = Array<string | object> | string | object;

export interface ErrorResponseBody {
	status_code: number;
	error_messages: ErrorMessage;
}

export function errorResponseBody(errorStatusCode: number, errorMessages?: ErrorMessage): ErrorResponseBody {
	if (errorStatusCode < 400 || errorStatusCode > 599) {
		throw new Error("Invalid error status code.")
	}

	return {
		status_code: errorStatusCode,
		error_messages: errorMessages ?? STATUS_CODES[errorStatusCode] ?? "",
	}
}
