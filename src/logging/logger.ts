import pino from "pino";

// Define redaction paths for sensitive data
const redactPaths = [
	"user.email",
	"user.password",
	"apiKey",
	"session.token",
	"req.headers.authorization",
	"auth.*.password",
	"config.*.secret",
	"env.*",
];

const pinoLogger = pino({
	level: process.env.LOG_LEVEL || "info",
	redact: {
		paths: redactPaths,
		censor: "[REDACTED]",
	},
	// Only use pino-pretty in development AND when not in browser/webpack context
	// ...(process.env.NODE_ENV === "development" && typeof window === "undefined"
	// 	? {
	// 			transport: {
	// 				target: "pino-pretty",
	// 				options: {
	// 					colorize: true,
	// 					translateTime: "SYS:standard",
	// 					ignore: "pid,hostname",
	// 				},
	// 			},
	// 		}
	// 	: {}),
});

// Create a wrapper that matches the contracts Logger interface
// Pino signature: logger.info(meta, message)
// Contracts signature: logger.info(message, meta)
export const logger = {
	debug: (message: string, meta?: Record<string, unknown>): void => {
		if (meta) {
			pinoLogger.debug(meta, message);
		} else {
			pinoLogger.debug(message);
		}
	},
	info: (message: string, meta?: Record<string, unknown>): void => {
		if (meta) {
			pinoLogger.info(meta, message);
		} else {
			pinoLogger.info(message);
		}
	},
	warn: (message: string, meta?: Record<string, unknown>): void => {
		if (meta) {
			pinoLogger.warn(meta, message);
		} else {
			pinoLogger.warn(message);
		}
	},
	error: (message: string, meta?: Record<string, unknown> | Error): void => {
		if (meta instanceof Error) {
			pinoLogger.error(meta, message);
		} else if (meta) {
			pinoLogger.error(meta, message);
		} else {
			pinoLogger.error(message);
		}
	},
	// Add child method for creating scoped loggers
	child: (bindings: Record<string, unknown>) => {
		const childLogger = pinoLogger.child(bindings);
		return {
			debug: (message: string, meta?: Record<string, unknown>): void => {
				if (meta) {
					childLogger.debug(meta, message);
				} else {
					childLogger.debug(message);
				}
			},
			info: (message: string, meta?: Record<string, unknown>): void => {
				if (meta) {
					childLogger.info(meta, message);
				} else {
					childLogger.info(message);
				}
			},
			warn: (message: string, meta?: Record<string, unknown>): void => {
				if (meta) {
					childLogger.warn(meta, message);
				} else {
					childLogger.warn(message);
				}
			},
			error: (message: string, meta?: Record<string, unknown> | Error): void => {
				if (meta instanceof Error) {
					childLogger.error(meta, message);
				} else if (meta) {
					childLogger.error(meta, message);
				} else {
					childLogger.error(message);
				}
			},
			level: childLogger.level,
			child: (nestedBindings: Record<string, unknown>) => logger.child({ ...bindings, ...nestedBindings }),
		};
	},
};

// Re-export the logger interface and createLogger function from contracts
// This allows packages to use the full infrastructure logger while maintaining compatibility
export type { Logger } from "@snapback-oss/contracts";
export { LogLevel } from "@snapback-oss/contracts";
