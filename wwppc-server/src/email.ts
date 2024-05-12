import fs from 'fs';
import { createTransport, Transporter } from 'nodemailer';
import path from 'path';

import config from './config';
import Logger from './log';
import { minify } from './minifier';
import inlineCss from 'inline-css';

interface MailerConstructorParams {
    /**Hostname of SMTP server */
    host: string
    /**Port number of SMTP server (default 587) */
    port?: number
    /**Use secure connection */
    secure?: boolean
    /**SMTP username */
    username: string
    /**SMTP password */
    password: string
    /**Path to email templates */
    templatePath: string
    /**Logging instance */
    logger: Logger
}
/**
 * Nodemailer wrapper with templates. Connects to an SMTP server.
 */
export class Mailer {
    readonly #transporter: Transporter;
    readonly #logger: Logger;
    readonly #templates: Map<string, string>;

    /**
     * @param params Parameters
     */
    constructor({ host, port = 587, secure = false, username, password, templatePath, logger }: MailerConstructorParams) {
        const startTime = performance.now();
        this.#logger = logger;
        this.#templates = new Map();
        fs.readdir(templatePath, { withFileTypes: true }, (err: Error | null, files: fs.Dirent[]) => {
            if (err !== null) {
                this.#logger.handleError('Email template indexing failed:', err);
                return;
            }
            for (const file of files) {
                if (!file.isFile()) continue;
                fs.readFile(path.resolve(file.path, file.name), { encoding: 'utf8' }, async (err: Error | null, data: string) => {
                    if (err !== null) {
                        this.#logger.handleError('Email template read failed:', err);
                        return;
                    }
                    try {
                        const minified = await minify(data, 'html');
                        this.#templates.set(file.name.split('.')[0], minified);
                    } catch (err) {
                        this.#logger.handleError('Email template minification failed: ', err);
                        this.#templates.set(file.name.split('.')[0], data);
                    }
                    if (config.debugMode) this.#logger.debug('Read email template ' + file.name);
                });
            }
        });
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
            process.exit(-1);
        });
    }

    /**
     * Send and email from no-reply@wwppc.tech.
     * @param {string[]} recipients List of recipient emails
     * @param {string} subject Subject line of email
     * @param {string} content HTML content of email
     * @param {string | undefined} plaintext Plaintext version of email
     * @returns {Promise<Error | undefined>} `undefined` if email was sent succesfully. Otherwise, an Error
     */
    async send(recipients: string[], subject: string, content: string, plaintext?: string): Promise<Error | undefined> {
        try {
            const inlined = await inlineCss(content, { url: 'https://wwppc.tech' });
            await this.#transporter.sendMail({
                from: '"WWPPC" <no-reply@wwppc.tech>',
                to: recipients.join(','),
                subject: subject,
                text: plaintext,
                html: inlined
            });
        } catch (err) {
            return new Error('' + err);
        }
    }

    /**
     * Send an email using a template from no-reply@wwppc.tech.
     * @param {string} template  Name of template (matches file name, without extension)
     * @param {string[]} recipients List of recipient emails
     * @param {string} subject Subject line of email
     * @param {[string, string][]} params Replacements for parameters in email, in key-value pairs
     * @param {string | undefined} plaintext Plaintext version (does not use template)
     * @returns {Promise<Error | undefined>} `undefined` if email was sent succesfully. Otherwise, an Error
     */
    async sendFromTemplate(template: string, recipients: string[], subject: string, params: [string, string][], plaintext?: string): Promise<Error | undefined> {
        try {
            if (this.#templates.has(template)) {
                let text = this.#templates.get(template)!;
                params.push(['hostname', config.hostname]);
                params.forEach(([key, value]) => {
                    text = text.replaceAll(`$${key}$`, value);
                });
                const inlined = await inlineCss(text, { url: 'https://' + config.hostname });
                await this.#transporter.sendMail({
                    from: `"WWPPC" <no-reply@${config.hostname}>`,
                    to: recipients.join(','),
                    subject: subject,
                    text: plaintext,
                    html: inlined
                });
            } else {
                return new Error('Template not found');
            }
        } catch (err) {
            return new Error('' + err);
        }
    }

    /**
     * Disconnect from the SMTP server.
     */
    async disconnect() {
        this.#transporter.close();
    }
}

export default Mailer