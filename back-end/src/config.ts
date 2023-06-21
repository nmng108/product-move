import 'dotenv/config'
import ip from 'ip'

// dotenv.config()

const IP_ADDRESS = ip.address()
const PORT = process.env.PORT

let DB_URI = process.env.DB_URI
const { DB_SCHEME, DB_HOST, DB_NAME } = process.env;
const DB_USERNAME = process.env.DB_USERNAME ?? ''
const DB_PASSWORD = process.env.DB_PASSWORD ?? ''
const DB_PORT = process.env.DB_PORT ?? ''
const DB_QUERYSTRING = process.env.DB_QUERYSTRING ?? ''

if (typeof PORT == 'undefined') throw new Error("Failed to import the PORT env variable.");
if (typeof DB_URI == 'undefined') throw new Error("Failed to import the DB_URI env variable.");
if (typeof DB_SCHEME == 'undefined') throw new Error("Failed to import the DB_SCHEME env variable.");
if (typeof DB_HOST == 'undefined') throw new Error("Failed to import the DB_HOST env variable.");
if (typeof DB_NAME == 'undefined') throw new Error("Failed to import the DB_NAME env variable.");

DB_URI = DB_URI.replace('[scheme]', DB_SCHEME);

if (DB_USERNAME != '') {
	DB_URI = DB_URI.replace('[username[:password]@]', `${DB_USERNAME}[:password]@`)
	DB_URI = DB_URI.replace('[:password]', `:${DB_PASSWORD}`);
} else {
	DB_URI = DB_URI.replace('[username[:password]@]', '')
}

DB_URI = DB_URI.replace('[host]', DB_HOST);
DB_URI = DB_URI.replace('[:port]', DB_PORT != '' ? `:${DB_PORT}` : '');
DB_URI = DB_URI.replace('[schema]', DB_NAME);
DB_URI = DB_URI.replace('[?querystring]', `?${DB_QUERYSTRING}`);

export default {
	IP_ADDRESS,
	PORT: parseInt(PORT),
	DB_URI,
	config: () => {
		process.env = { ...process.env, IP_ADDRESS, PORT, DB_URI }
	}
}
