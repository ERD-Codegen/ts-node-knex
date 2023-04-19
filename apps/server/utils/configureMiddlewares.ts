import chalk from "chalk";
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";
import compression from "compression";
import {
	type Express,
	type Request,
	type Response
} from "express";
import { Environments } from "@conduit/types";

/**
 *
 * Configures and sets up middleware for the given Express app instance.
 *
 * @param {Object} options - The options object.
 * @param {Express} options.app - The Express app instance to configure the middlewares for.
 *
 * @returns {void}
 *
 */
export const configureMiddlewares = ({ app }: { app: Express }): void => {
	// Add security-related HTTP headers to the response
	app.use(helmet());

	// Enable gzip compression of HTTP responses
	app.use(compression());

	// Enable logging of incoming HTTP requests using the morgan package
	if (process.env.NODE_ENV !== Environments.Testing) {
		app.use(morgan(logger));
	}

	// Parse JSON payloads in incoming HTTP requests
	app.use(bodyParser.json());

	// Parse URL-encoded payloads in incoming HTTP requests
	app.use(bodyParser.urlencoded({ extended: true }));
};

/**
 *
 * Morgan format function that logs HTTP request details with color-coded status and response time.
 *
 * @param tokens - An object containing predefined token functions.
 * @param req - The request object.
 * @param res - The response object.
 *
 * @returns A formatted log string.
 *
 */
const logger: morgan.FormatFn<Request, Response> = (tokens, req, res) => {
	// Extract tokens and response time
	const status = tokens?.status?.(req, res);
	const responseTimeInString = tokens["response-time"](req, res);
	const responseTime = parseInt(responseTimeInString ?? "", 10);

	// Construct log string with color coding
	return [
		chalk.yellow(tokens.method(req, res)),
		tokens.url(req, res),
		status && chalk[parseInt(status[0], 10) <= 3 ? "green" : "red"](status),
		responseTime && chalk[responseTime > 500 ? "red" : "green"](`${responseTime}ms`)
	]
		.filter(Boolean)
		.join(" - ");
};
