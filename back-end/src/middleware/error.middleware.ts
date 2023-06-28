import { NextFunction, Request, Response } from "express";
import { errorResponseBody, HttpException } from "utils/exceptions";

function HttpErrorHandlerMiddleware(
	error: HttpException | any,
	request: Request,
	response: Response,
	next: NextFunction
) {
	if (error instanceof HttpException) {
		error.send(response);
	} else {
		response.status(500).json(errorResponseBody(500, error));
	}
}

export { HttpErrorHandlerMiddleware }
