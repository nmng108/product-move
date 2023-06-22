import "dotenv/config";
import { cleanEnv, str, host, makeValidator, EnvError } from "envalid";
import ip from "ip";

const defaultEnv = {
	NODE_ENV: "development",
	PORT: "3000",
	DB_URI: "[scheme]://[username[:password]@][host][:port]/[schema][?querystring]",
	DB_SCHEME: "mongdb",
	DB_HOST: "localhost",
	DB_PORT: "",
	DB_NAME: "productmove",
	DB_QUERYSTRING: "",
	DB_USERNAME: "",
	DB_PASSWORD: "",
}

// remove all env variables with empty string values before sanitizing them with envalid
Object.entries(defaultEnv).forEach(([envName, defaultValue]) => {
	if (process.env[envName] == '' && defaultValue == '') {
		delete process.env[envName];
	}

	if (envName == "DB_URI") delete process.env[envName];
})

// scheme validator
const scheme = makeValidator<string>((input) => {
	if (/^[a-zA-Z\+]+$/.test(input)) return input.toLowerCase();
	else {
		throw new EnvError(
			"DB_SCHEME doesn't match. DB_SCHEME must contain only letter and the plus '+' sign.",
		);
	}
});

// make a port validator that can handle input as string
const port = makeValidator((input) => {
	if (input.length == 0) return input;

	if (!/^[\d]+$/.test(input)) throw new EnvError("Port value is not of type Integer.");

	const port = parseInt(input, 10);

	if (port < 1 || port > 65535) {
		throw new EnvError("Invalid port number. A valid value is in range from 1 to 65535.");
	}

	return input;
});

const cleanedEnv = cleanEnv(
	process.env,
	{
		// Server information
		NODE_ENV: str({ choices: ["development", "test", "staging", "production"] }),
		PORT: port({ default: defaultEnv.PORT }),
		// Database connection
		DB_URI: str({ default: defaultEnv.DB_URI, }),
		// protocol
		DB_SCHEME: scheme({ default: defaultEnv.DB_SCHEME }),
		// Address of the database
		DB_HOST: host({ default: defaultEnv.DB_HOST }),
		DB_PORT: port({ default: defaultEnv.DB_PORT }),
		// Database name and options
		DB_NAME: str({ default: defaultEnv.DB_NAME }),
		DB_QUERYSTRING: str({ default: defaultEnv.DB_QUERYSTRING }),
		// Authentication
		DB_USERNAME: str({ default: defaultEnv.DB_USERNAME }),
		DB_PASSWORD: str({ default: defaultEnv.DB_PASSWORD }),
	},
);

const IP_ADDRESS = ip.address();

// build database URI from template
let DB_URI = cleanedEnv.DB_URI;

DB_URI = DB_URI.replace("[scheme]", cleanedEnv.DB_SCHEME);

if (cleanedEnv.DB_USERNAME != "") {
	DB_URI = DB_URI.replace("[username[:password]@]", `${cleanedEnv.DB_USERNAME}[:password]@`);
	DB_URI = DB_URI.replace("[:password]", `:${cleanedEnv.DB_PASSWORD}`);
} else {
	DB_URI = DB_URI.replace("[username[:password]@]", "");
}

DB_URI = DB_URI.replace("[host]", cleanedEnv.DB_HOST);
DB_URI = DB_URI.replace("[:port]", cleanedEnv.DB_PORT != "" ? `:${cleanedEnv.DB_PORT}` : "");
DB_URI = DB_URI.replace("[schema]", cleanedEnv.DB_NAME || "");
DB_URI = DB_URI.replace("[?querystring]", `?${cleanedEnv.DB_QUERYSTRING}`);

console.log(DB_URI)

export default {
	IP_ADDRESS,
	PORT: parseInt(cleanedEnv.PORT),
	DB_URI,
	execute: () => {
		process.env = { ...process.env, IP_ADDRESS, PORT: cleanedEnv.PORT.toString(), DB_URI };
	},
};
