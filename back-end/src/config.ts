import dotenv from 'dotenv'
import ip from 'ip'

dotenv.config()

const DB = process.env.DB
const DB_NAME = process.env.DB_NAME
const DB_HOST = process.env.DB_HOST
const DB_PORT = process.env.DB_PORT
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const IP_ADDRESS = ip.address()

// mongodb
let DB_URI = ''
// local connection
if ((typeof DB_USERNAME != 'string' || DB_USERNAME.length == 0 || typeof DB_PASSWORD != 'string' || DB_PASSWORD.length == 0)
		&& typeof DB_PORT == 'string' && DB_PORT.length > 0) {
	DB_URI = `${DB}://${DB_HOST}:${DB_PORT}/${DB_NAME}`
} else { // remote connection
	DB_URI = `${DB}+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`
}

export default {
	IP_ADDRESS,
	PORT: parseInt(process.env.PORT as string),
	DB_URI,
	config: () => {
		process.env.IP_ADDRESS = IP_ADDRESS;
		process.env.PORT = process.env.PORT as string;
		process.env.DB_URI = `${DB}://${DB_HOST}:${DB_PORT}`;
	}
}
