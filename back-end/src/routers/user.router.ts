import express from "express";
import { UserController } from "../controllers";

export function addUserRoutes(app: express.Express) {
	app.use('/api/auth', router);
	app.get('/api/user', UserController.getUser)
	app.get('/api/user/:username', UserController.getUser)
}

const router = express.Router({ caseSensitive: true });
// router.use((req, res, next) => {
// 	console.log('def by router.use() 0');
// 	next();
// })

router.post('/register', UserController.registerUser)
router.post('/signin', UserController.signin)
router.patch('/logout', UserController.logout)
router.put('/change-password', UserController.signin)
