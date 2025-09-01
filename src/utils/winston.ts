import { createLogger, format, transports } from 'winston';

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json(),
    ),
    transports: [
        new transports.File({ filename: 'logs/error.log' , level: 'error'}),
        new transports.File({ filename: 'logs/info.log' , level: 'info'}),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.combine(
            format.colorize(),
            format.simple(),
        ),
    }));
}
export default logger;
