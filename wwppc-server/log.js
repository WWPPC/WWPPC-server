const fs = require('fs');
const fspath = require('path');

/**
 * A simple logging class with timestamps and logging levels.
 */
class Logger {
    #file;

    /**
     * Create a new `Logger` in a specified directory. Creating a `Logger` will also create a `logs/` directory
     * if there already exists a log.log in the directory, moving it in. This means creating multiple
     * `Loggers` in the same directory will break them.
     * @param {string} path Filepath to the log directory. The default is `'./'`.
     */
    constructor(path = './') {
        if (!fs.existsSync(path)) throw new Error('"path" must be a valid directory');
        path = fspath.resolve(path);
        try {
            let filePath = fspath.resolve(path, 'log.log');
            if (fs.existsSync(filePath)) {
                let dirPath = fspath.resolve(path, 'logs/');
                if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);
                let fileCount = fs.readdirSync(dirPath).length;
                fs.renameSync(filePath, fspath.resolve(dirPath, `log-${fileCount}.log`));
            }
            this.#file = fs.openSync(filePath, 'a');
            this.info('Logger instance created');
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Get a timestamp in YYYY-MM-DD [HH:MM:SS] format.
     * @returns Timestamp in YYYY-MM-DD [HH:MM:SS] format.
     */
    timestamp() {
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
     * Append an debug-level entry to the log.
     * @param {string} text Text.
     */
    debug(text) {
        this.#append(' info', text, 36);
    }
    /**
     * Append an information-level entry to the log.
     * @param {string} text Text.
     */
    info(text) {
        this.#append(' info', text, 34);
    }
    /**
     * Append a warning-level entry to the log.
     * @param {string} text Text.
     */
    warn(text) {
        this.#append(' warn', text, 33);
    }
    /**
     * Append an error-level entry to the log.
     * @param {string} text Text.
     */
    error(text) {
        this.#append('error', text, 31);
    }
    /**
     * Append an fatal-level entry to the log.
     * @param {string} text Text.
     */
    fatal(text) {
        this.#append('fatal', text, 35);
    }

    #append(level, text, color) {
        if (this.#file == undefined) return;
        let prefix1 = `\x1b[0m\x1b[40m\x1b[32m${this.timestamp()} \x1b[1m\x1b[${color}m${level.toUpperCase()}\x1b[0m\x1b[40m | `;
        process.stdout.write(`${prefix1}${text.toString().replaceAll('\n', `\n\r${prefix1}`)}\n\r`);
        let prefix2 = `${this.timestamp()} ${level.toUpperCase()} | `;
        fs.appendFile(this.#file, `${prefix2}${text.toString().replaceAll('\n', `\n${prefix2}`)}\n`, { encoding: 'utf-8' }, (err) => { if (err) console.error(err) });
    }

    /**
     * Safely closes the logging session.
     */
    destroy() {
        if (this.#file == undefined) return;
        console.log('Logger instance destroyed');
        this.info('Logger instance destroyed');
        fs.closeSync(this.#file);
        this.#file = undefined;
    }
}

module.exports = Logger;