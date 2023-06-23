import { Router } from "express";
import url from "url";

export interface IController {
	getPath(): string;
	getRouter(): Router;
}

export default class Controller implements IController {
	protected path: string; // definite assignment assertion
	protected router: Router = Router();

	public constructor(path: string = '') {
		this.path = Controller.normalizePath(path);
	}

	public getPath(): string;
	public getPath(resource: string): string;
	public getPath(resource?: string): string {
		return resource ? this.path + Controller.normalizePath(resource) : this.path;
	};

	public getRouter(): Router {
		return this.router;
	};

	protected static normalizePath(path: string) {
		if (/^((\/[\w_\.\$\-]+)+\/?)?$/.test(path)) {
			return path.endsWith('/') ? path.slice(0, path.length - 1) : path;
		}

		let splitStr = path.split('/');
		path = '';
		splitStr.forEach(subStr => (subStr !== '') ? path = path.concat('/', subStr) : null)
		return path;
	}
}

let path = "localhost.com.vn/api//users///d";

// let extracted = urlStr.match(/[a-zA-Z\+]+:\/\/[\w\.]+/);
// extracted ? console.log(urlStr.replace(extracted[0], '')) : null;
console.log(url.resolve(path, '/abc'))
// let urlInstance = new url.URL("sub.localhost.com.vn//api//users///d", 'http://test.vn');
// console.log(urlInstance);
