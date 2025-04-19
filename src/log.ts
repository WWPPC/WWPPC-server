import fs from 'fs';
import { resolve as pathResolve } from 'path';

import config from './config';

/**
 * A simple logging class with log levels.
 */
export abstract class Logger {
    /**
     * Get a timestamp in YYYY-MM-DD [HH:MM:SS] format.
     * @returns Timestamp in YYYY-MM-DD [HH:MM:SS] format.
     */
    timestamp(): string {
        const time = new Date();
        let month = (time.getMonth() + 1).toString();
        let day = time.getDate().toString();
        let hour = time.getHours().toString();
        let minute = time.getMinutes().toString();
        let second = time.getSeconds().toString();
        if (month.length == 1) month = 0 + month;
        if (day.length == 1) day = 0 + day;
        if (hour.length == 1) hour = 0 + hour;
        if (minute.length == 1) minute = 0 + minute;
        if (second.length == 1) second = 0 + second;
        return `${time.getFullYear()}-${month}-${day} [${hour}:${minute}:${second}]`;
    }

    /**
     * Append a debug-level entry to the log.
     * @param text Text
     * @param logOnly Only put in logfile, not stdout
     */
    abstract debug(text: string, logOnly?: boolean): void
    /**
     * Append an information-level entry to the log.
     * @param text Text
     * @param logOnly Only put in logfile, not stdout
     */
    abstract info(text: string, logOnly?: boolean): void
    /**
     * Append a warning-level entry to the log.
     * @param text Text
     * @param logOnly Only put in logfile, not stdout
     */
    abstract warn(text: string, logOnly?: boolean): void
    /**
     * Append an error-level entry to the log.
     * @param text Text
     * @param logOnly Only put in logfile, not stdout
     */
    abstract error(text: string, logOnly?: boolean): void
    /**
     * Append a fatal-level entry to the log.
     * @param text Text
     * @param logOnly Only put in logfile, not stdout
     */
    abstract fatal(text: string, logOnly?: boolean): void
    /**
     * Shorthand for appending `Error` objects as error-level logs.
     * @param message Accompanying message
     * @param error Error data
     */
    abstract handleError(message: string, error: any): void
    /**
     * Shorthand for appending `Error` objects as fatal-level logs.
     * @param message Accompanying message
     * @param error Error data
     */
    abstract handleFatal(message: string, error: any): void

    /**
     * Safely closes the logging session. May be asynchronous to allow pending operations to finish.
     */
    abstract destroy(): void

    /**
     * Convert an error log with message and stack trace to a log entry fed to the append function.
     * @param appendFunc Callback function for appending to log
     * @param message Accompanying message
     * @param error Error data
     */
    static appendErrorLog(this: Logger, appendFunc: (text: string, logOnly?: boolean) => void, message: string, error: any) {
        appendFunc.call(this, message);
        if (error instanceof Error) {
            appendFunc.call(this, error.message);
            if (error.stack === undefined) Error.captureStackTrace(error);
            if (error.stack) appendFunc.call(this, error.stack);
        } else {
            appendFunc.call(this, '' + error);
            const stack: { stack?: string } = {};
            Error.captureStackTrace(stack);
            if (stack.stack) appendFunc.call(this, stack.stack);
        }
    }
}

/**
 * A wrapper to append to multiple `Logger` instances at the same time.
 */
export class MultiLogger extends Logger {
    private readonly loggers: Logger[];

    /**
     * Create a new `MultiLogger` encapsulating a list of other `Logger`s.
     * @param loggers Array of loggers
     */
    constructor(loggers: Logger[]) {
        super();
        this.loggers = loggers.slice();
    }

    /**Get the `Logger`s encapsulated within */
    children(): Logger[] {
        return this.loggers.slice();
    }

    debug(text: string, logOnly?: boolean): void {
        for (const l of this.loggers) l.debug(text, logOnly);
    }
    info(text: string, logOnly?: boolean): void {
        for (const l of this.loggers) l.info(text, logOnly);
    }
    warn(text: string, logOnly?: boolean): void {
        for (const l of this.loggers) l.warn(text, logOnly);
    }
    error(text: string, logOnly?: boolean): void {
        for (const l of this.loggers) l.error(text, logOnly);
    }
    fatal(text: string, logOnly?: boolean): void {
        for (const l of this.loggers) l.fatal(text, logOnly);
    }
    handleError(message: string, error: any): void {
        for (const l of this.loggers) l.handleError(message, error);
    }
    handleFatal(message: string, error: any): void {
        for (const l of this.loggers) l.handleFatal(message, error);
    }
    destroy(): void {
        for (const l of this.loggers) l.destroy();
    }
}

/**
 * A simple logger with timestamps, logging levels, tail tracking, and formatting that writes to file and stdout.
 */
export class FileLogger extends Logger {
    readonly filePath: string;
    readonly tailLength: number;
    private readonly file: number;
    private readonly tailBuffer: string[] = [];
    private closed: boolean = false;
    private activity: Set<Promise<void>> = new Set();
    private readonly allowStdOut: boolean;

    /**
     * Create a new `FileLogger` in a specified directory. Creating a `FileLogger` will also create a
     * `logs/` directory. If there already exists a log.log in the directory, moving it in. This means
     * creating multiple `Loggers` in the same directory will break them.
     * @param path Path to the log file, or log directory if `autoName` is `true`. Will overwrite existing files if `autoName` is `false`
     * @param autoName Automatically name the log file based on the current date and time (default true)
     * @param allowStdOut Allow mirroring of logs in stdout (does not override `logOnly` on calls, default true)
     * @param tailLength Maximum length of buffer for most recent log entries (default 100)
     */
    constructor(path: string, autoName: boolean = true, allowStdOut: boolean = true, tailLength?: number) {
        super();
        path = pathResolve(__dirname, path);
        if (autoName) {
            if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
            const date = new Date();
            this.filePath = pathResolve(path, `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}_${date.getUTCHours()}-${date.getUTCMinutes()}-${date.getUTCSeconds()}`);
            // resolve conflicting log files by appending a number
            if (fs.existsSync(this.filePath + '.log')) {
                let i = 1;
                while (fs.existsSync(this.filePath + i + '.log')) i++;
                this.filePath += i;
            }
            this.filePath += '.log'
            this.file = fs.openSync(this.filePath, 'a');
        } else {
            if (fs.existsSync(path)) fs.rmSync(path);
            this.filePath = path;
            this.file = fs.openSync(this.filePath, 'a');
        }
        this.tailLength = tailLength ?? 100;
        this.allowStdOut = allowStdOut;
        this.info('Logger instance created');
    }

    debug(text: string, logOnly = false) {
        this.append('debug', text, 36, logOnly);
    }
    info(text: string, logOnly = false) {
        this.append(' info', text, 34, logOnly);
    }
    warn(text: string, logOnly = false) {
        this.append(' warn', text, 33, logOnly);
    }
    error(text: string, logOnly = false) {
        this.append('error', text, 31, logOnly);
    }
    fatal(text: string, logOnly = false) {
        this.append('fatal', text, 35, logOnly);
    }
    handleError(message: string, error: any) {
        Logger.appendErrorLog.call(this, this.error, message, error);
    }
    handleFatal(message: string, error: any) {
        Logger.appendErrorLog.call(this, this.fatal, message, error);
    }

    /**
     * Fetch the most recent log entries, a maximum of {@link tailLength} entries.
     */
    tail(): string {
        return this.tailBuffer.join('');
    }

    private append(level: string, text: string, color: number, logOnly = false) {
        if (!logOnly && this.allowStdOut) {
            const prefix1 = `\x1b[0m\x1b[32m${this.timestamp()} \x1b[1m\x1b[${color}m${level.toUpperCase()}\x1b[0m | `;
            process.stdout.write(`${prefix1}${text.toString().replaceAll('\n', `\n\r${prefix1}`)}\n\r`);
        }
        const prefix2 = `${this.timestamp()} ${level.toUpperCase()} | `;
        const formatted = `${prefix2}${text.toString().replaceAll('\n', `\n${prefix2}`)}\n`;
        this.tailBuffer.push(formatted);
        if (this.tailBuffer.length > this.tailLength) this.tailBuffer.shift();
        // write to file, operation stored to ensure logs written before process exits
        const fd = this.file;
        const op = new Promise<void>((resolve) => fs.appendFile(fd, formatted, { encoding: 'utf-8' }, (err) => {
            if (err) console.error(err);
            resolve();
            this.activity.delete(op);
        }));
        this.activity.add(op);
    }

    async destroy() {
        if (this.closed) return;
        this.info('Logger instance destroyed');
        await Promise.all(this.activity);
        fs.closeSync(this.file);
        this.closed = true;
    }
}

/**
 * An extension of any other `Logger` instance that adds a name prefix to all messages.
 */
export class NamedLogger extends Logger {
    readonly logger: Logger;
    readonly name: string;

    /**
     * Create a new `NamedLogger` around an existing `Logger`.
     * @param logger Logger instance to wrap around
     * @param name Name prefix, without brackets
     */
    constructor(logger: Logger, name: string) {
        super();
        this.logger = logger;
        this.name = name;
    }

    debug(text: string, logOnly = false) {
        this.logger.debug(`[${this.name}] ${text.replaceAll('\n', `\n[${this.name}] `)}`, logOnly);
    }
    info(text: string, logOnly = false) {
        this.logger.info(`[${this.name}] ${text.replaceAll('\n', `\n[${this.name}] `)}`, logOnly);
    }
    warn(text: string, logOnly = false) {
        this.logger.warn(`[${this.name}] ${text.replaceAll('\n', `\n[${this.name}] `)}`, logOnly);
    }
    error(text: string, logOnly = false) {
        this.logger.error(`[${this.name}] ${text.replaceAll('\n', `\n[${this.name}] `)}`, logOnly);
    }
    fatal(text: string, logOnly = false) {
        this.logger.fatal(`[${this.name}] ${text.replaceAll('\n', `\n[${this.name}] `)}`, logOnly);
    }
    handleError(message: string, error: any) {
        Logger.appendErrorLog.call(this, this.error, message, error);
    }
    handleFatal(message: string, error: any) {
        Logger.appendErrorLog.call(this, this.fatal, message, error);
    }

    async destroy() {
        await this.logger.destroy();
    }
}

/**
 * Drops all log entries into nowhere.
 */
export class NullLogger extends Logger {
    constructor() {
        super();
    }
    debug(text: string, logOnly?: boolean): void {
    }
    info(text: string, logOnly?: boolean): void {
    }
    warn(text: string, logOnly?: boolean): void {
    }
    error(text: string, logOnly?: boolean): void {
    }
    fatal(text: string, logOnly?: boolean): void {
    }
    handleError(message: string, error: any): void {
    }
    handleFatal(message: string, error: any): void {
    }
    destroy(): void {
    }
}

export const defaultLogger: Logger = new MultiLogger([
    new FileLogger(config.logPath),
    new FileLogger(pathResolve(config.logPath, 'recent.log'), false, false)
]);

export default Logger;