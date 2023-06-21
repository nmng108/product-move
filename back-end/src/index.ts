import bodyParser from "body-parser";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import "module-alias/register";
import config from "./config";
import { addUserRoutes } from "./routers";

const app = express();

http.createServer(app).listen(config.PORT, config.IP_ADDRESS, () => {
	app.listen(config.PORT, () => {
		console.log(`Listening on http://${config.IP_ADDRESS}:${config.PORT}`);
		mongoose.connect(config.DB_URI).then((value) => console.log("Database is connected."));
	});
});

// http2.createServer(app).listen(config.PORT, config.IP_ADDRESS, () => {
// 	console.log(`Listening on http://${config.IP_ADDRESS}:${config.PORT}`)
// 	mongoose.connect(config.DB_URI)
// })


/***** Request handlers *****/

/*** Middleware ***/
/** Parse request body based on its type **/
// app.use(express.json({limit: '10mb'})) // alternative for bodyParser.json()
app.use(bodyParser.json({ limit: "10mb" })); // application/json
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true })); // application/x-www-form-urlencoded

/*** Routes ***/
app.get("/", (req, res) => {
	res.end("sv1 run");
});

addUserRoutes(app);

