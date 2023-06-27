import { Router } from "express";
import url from "url";

export interface IController {
	makePath(): string;
	getRouter(): Router;
}

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
