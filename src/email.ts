import fs from 'fs';
import { minify as htmlMinify } from 'html-minifier';
import inlineCss from 'inline-css';
import { createTransport, Transporter } from 'nodemailer';
import path from 'path';

import config from './config';
import Logger, { NamedLogger } from './log';

export interface MailerConstructorParams {
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
    readonly ready: Promise<any>;
    private readonly transporter: Transporter;
    private readonly logger: NamedLogger;
    private readonly templatePathURL: string;
    private readonly templates: Map<string, string>;

    /**
     * @param params Parameters
     */
    constructor({ host, port = 587, secure = false, username, password, templatePath, logger }: MailerConstructorParams) {
        const startTime = performance.now();
        this.logger = new NamedLogger(logger, 'Mailer');
        this.templatePathURL = 'file://' + templatePath;
        this.templates = new Map();
        let resolveReadyPromise: (v: any) => any;
        this.ready = new Promise((resolve) => resolveReadyPromise = resolve);
        fs.readdir(templatePath, { withFileTypes: true }, async (err: Error | null, files: fs.Dirent[]) => {
            if (err !== null) {
                this.logger.handleError('Email template indexing failed:', err);
                return;
            }
            const promises: Promise<any>[] = [];
            for (const file of files) {
                if (!file.isFile()) continue;
                promises.push(new Promise((resolve) => {
                    fs.readFile(path.resolve(file.path, file.name), { encoding: 'utf8' }, async (err: Error | null, data: string) => {
                        if (err !== null) {
                            this.logger.handleError('Email template read failed:', err);
                            return;
                        }
                        const inlined = await inlineCss(data, {
                            url: this.templatePathURL,
                            removeHtmlSelectors: true
                        });
                        const minified = htmlMinify(inlined, {
                            collapseBooleanAttributes: true,
                            collapseWhitespace: true
                        });
                        this.templates.set(file.name.split('.')[0], minified);
                        if (config.debugMode) this.logger.debug('Read email template ' + file.name);
                        resolve(undefined);
                    });
                }));
            }
            await Promise.all(promises);
            resolveReadyPromise(undefined);
        });
        // no way to async connect without making not-readonly
        this.transporter = createTransport({
            name: config.hostname,
            host: host,
            port: port,
            secure: secure,
            auth: {
                user: username,
                pass: password
            },
            debug: config.debugMode
        });
        this.logger.info('SMTP server connected');
        if (config.debugMode) {
            this.logger.debug(`Connected to ${host}`);
            this.logger.debug(`Connection time: ${performance.now() - startTime}ms`);
            this.logger.debug('Current sending address: ' + config.emailAddress);
        }
        this.logger.info('Email activity logging is ' + config.logEmailActivity);
        this.transporter.on('error', async (err) => {
            this.logger.handleFatal('Fatal SMTP error:', err);
            await this.logger.destroy();
            process.exit(1);
        });
    }

    /**
     * Send and email from no-reply@wwppc.tech.
     * @param recipients List of recipient emails
     * @param subject Subject line of email
     * @param content HTML content of email
     * @param plaintext Plaintext version of email
     * @returns  `undefined` if email was sent succesfully. Otherwise, an Error
     */
    async send(recipients: string[], subject: string, content: string, plaintext?: string): Promise<Error | undefined> {
        try {
            const inlined = await inlineCss(content, {
                url: config.hostname,
                removeHtmlSelectors: true
            });
            const minified = htmlMinify(inlined, {
                collapseBooleanAttributes: true,
                collapseWhitespace: true
            });
            if (config.logEmailActivity) this.logger.info(`Sending email to ${recipients.join(', ')}`);
            await this.transporter.sendMail({
                from: {
                    name: 'WWPPC',
                    address: config.emailAddress
                },
                to: recipients,
                subject: subject,
                text: plaintext,
                html: minified
            });
        } catch (err) {
            this.logger.handleError(`Email to ${recipients.join(',')} failed to send:`, err);
            return new Error('' + err);
        }
    }

    /**
     * Send an email using a template from no-reply@wwppc.tech.
     * @param template  Name of template (matches file name, without extension)
     * @param recipients List of recipient emails
     * @param subject Subject line of email
     * @param params Replacements for parameters in email, in key-value pairs
     * @param plaintext Plaintext version (does not use template)
     * @returns  `undefined` if email was sent succesfully. Otherwise, an Error
     */
    async sendFromTemplate(template: string, recipients: string[], subject: string, params: [string, string][], plaintext?: string): Promise<Error | undefined> {
        try {
            if (this.templates.has(template)) {
                let content = this.templates.get(template)!;
                params.push(['hostname', 'https://' + config.hostname]);
                params.forEach(([key, value]) => {
                    content = content.replaceAll(`$${key}$`, value);
                });
                if (config.logEmailActivity) this.logger.info(`Sending email to ${recipients.join(', ')} (template: ${template})`);
                await this.transporter.sendMail({
                    from: {
                        name: 'WWPPC',
                        address: config.emailAddress
                    },
                    to: recipients,
                    subject: subject,
                    text: plaintext,
                    html: content
                });
            } else {
                this.logger.handleError(`Email (template: ${template}) to ${recipients.join(',')} failed to send:`, new Error('Template not found'));
                return new Error('Template not found');
            }
        } catch (err) {
            this.logger.handleError(`Email (template: ${template}) to ${recipients.join(',')} failed to send:`, err);
            return new Error('' + err);
        }
    }

    /**
     * Disconnect from the SMTP server.
     */
    async disconnect() {
        this.transporter.close();
    }
}

export default Mailer;