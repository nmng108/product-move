import { NextFunction, Request, Response, Router } from "express";
import url from "url";

export interface IController {
	makePath(): string;

	getRouter(): Router;
}

type ControllerMainAction<ReqT extends Request, ResponseBody = any> = (
	request: ReqT,
	response: Response<ResponseBody>
) => void;

export default abstract class Controller implements IController {
	protected collection: string; // definite assignment assertion
	protected router: Router = Router();

	protected constructor(collection: string = '') {
		this.collection = Controller.normalizePath(collection);
	}

	public makePath(): string;
	public makePath(resource: string): string;
	public makePath(resource?: string): string {
		return resource ? this.collection + Controller.normalizePath(resource) : this.collection;
	};

	public getRouter(): Router {
		return this.router;
	};

	/**
	 * Parameterizes/Generics Request Type & Response body
	 * @param action {ControllerMainAction}
	 */
	public static method<ReqT extends Request, ResponseBody = any>(
		action: ControllerMainAction<ReqT, ResponseBody>
	): (request: ReqT, response: Response<ResponseBody>, next: NextFunction) => Promise<void> {
		return async function (request: ReqT, response: Response<ResponseBody>, next: NextFunction) {
			try {
				await action(request, response);
			} catch (error: any) {
				next(error);
			}
		}
	}

	protected static normalizePath(path: string) {
		if (/^((\/[\w_\.\$#\-]+)+\/?)?$/.test(path)) {
			return path.endsWith('/') ? path.slice(0, path.length - 1) : path;
		}

		let splitStr = path.split('/');
		path = '';
		splitStr.forEach(subStr => (subStr !== '') ? path = path.concat('/', subStr) : null)
		return path;
	}
}
