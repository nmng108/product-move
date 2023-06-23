// import "module-alias/register";
import App from "App";
import { controllerList } from "resources";

const app = new App(controllerList);
app.listen();

/*** Routes ***/
app.getApp().get("/", (req, res) => {
	res.end("sv1 run");
});
