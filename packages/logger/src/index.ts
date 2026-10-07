import {
    createLogger as createWinstonLogger,
    format,
    transports,
} from "winston";
const { label, printf, combine, colorize, timestamp, metadata } = format;

export function createLogger(title: string) {
    const logger = createWinstonLogger({
        level: process.env.NODE_ENV === "production" ? "info" : "debug",
        transports: [
            new transports.Console({
                format: combine(
                    label({ label: title }),
                    timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
                    colorize({ all: true }),
                    metadata({
                        fillExcept: ["message", "level", "timestamp", "label"],
                    }),
                    printf(({ level, message, label, timestamp, metadata }) => {
                        const result = `${timestamp} [${label}] ${level}: ${message}`;
                        if (Object.values(metadata as any).length > 0) {
                            return `${result} \n\t${JSON.stringify(metadata)}`;
                        }

                        return result;
                    }),
                ),
                handleExceptions: true,
                handleRejections: true,
            }),
            // new transports.Console({
            //   format: combine(
            //     colorize(),
            //     label({ message: true, label: title }),
            //     timestamp(),
            //     metadata(),
            //     simple(),
            //   ),
            //   handleExceptions: true,
            //   handleRejections: true,
            // }),
        ],
    });

    if (process.env.NODE_ENV === "production") {
        logger.add(
            new transports.File({
                format: combine(
                    label({ label: title }),
                    timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
                    printf(({ level, message, label, timestamp, metadata }) => {
                        return `${timestamp} [${label}] ${level}: ${message} \n ${JSON.stringify(metadata)}`;
                    }),
                ),
                filename: process.cwd() + `/logs/${title}.log`,
            }),
        );
    }

    return logger;
}

export const logger = createLogger("arbitrator");
