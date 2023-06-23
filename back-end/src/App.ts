import express from "express";
import mongoose from "mongoose";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import Controller from "utils/interfaces/controller";
import config from "utils/config";

class App {
	private port: number;
	private express = express();

	constructor(controllers: Controller[], port?: number) {
		this.port = port ?? config.PORT;
		this.initializeMiddleware();
		this.initializeRouter(controllers);
	}

	public getApp(): express.Application {
		return this.express;
	}

	public listen(port: number = this.port, databaseURI: string = config.DB_URI) {
		try { // may increment port number by 1 if the chosen port has existed.
			return this.express.listen(port, async () => {
				console.log(`Listening on http://${config.IP_ADDRESS}:${config.PORT}`);
				await mongoose.connect(databaseURI)
				console.log("Database is connected: " + config.DB_HOST)
			})
		} catch (reason) {
			mongoose.disconnect();
			console.log(reason);
			process.exit(1);
		}
	}

	private initializeRouter(controllers: Controller[]) {
		controllers.forEach((controller) => this.express.use("/api", controller.getRouter()))
	}

	private initializeMiddleware() {
		// Handle incoming request
		this.express.use(express.json({ limit: "10mb", type: [
			"application/json",
			// "json",
			// "*/json",
			"application/merge-patch+json",
			"application/json-patch+json",
		] }));
		this.express.use(express.urlencoded({ limit: "10mb", extended: true }));
		// Configure response message
		this.express.use(compression());
		this.express.use(helmet());
		this.express.use(cors());
	}
}

export default App
