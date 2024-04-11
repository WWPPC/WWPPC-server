import config from './config';
import { createTransport, Transporter } from "nodemailer";
import Logger from './log';

interface MailerConstructorParams {
    host: string
    port?: number
    secure?: boolean
    username: string
    password: string
    logger: Logger
}
/**
 * Nodemailer wrapper with templates. Connects to an SMTP server.
 */
export class Mailer {
    readonly #transporter: Transporter;
    readonly #logger: Logger;

    /**
     * @param params Parameters
     */
    constructor({ host, port = 587, secure = false, username, password, logger }: MailerConstructorParams) {
        const startTime = performance.now();
        this.#logger = logger;
        // no way to async connect without making not-readonly
        this.#transporter = createTransport({
            host: host,
            port: port,
            secure: secure,
            auth: {
                user: username,
                pass: password
            },
            debug: config.debugMode
        });
        this.#logger.info('SMTP server connected');
        if (config.debugMode) {
            logger.debug('SMTP server connected to: ' + host);
            logger.debug(`SMTP server connection time: ${performance.now() - startTime}ms`);
        }
        this.#transporter.on('error', (err) => {
            logger.fatal('SMTP error:');
            logger.fatal(err.message);
            if (err.stack) logger.fatal(err.stack);
            logger.destroy();
            process.exit();
        });
    }

    /**
     * Disconnect from the SMTP server.
     */
    async disconnect() {
        this.#transporter.close();
    }
}