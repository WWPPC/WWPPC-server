// too bad it just uses an API
import https from 'https';
import querystring from 'querystring';

const cache = new Map<string, string>();

/**
 * Minify code using Toptal's minifier API.
 * @param {string} text Code to minify
 * @param {'javascript' | 'html'} type Minifier to use
 * @returns {string} Minified version of code
 */
export async function minify(text: string, type: 'javascript' | 'html'): Promise<string> {
    if (cache.has(text)) return cache.get(text)!;
    return await new Promise((resolve, reject) => {
        const query = querystring.stringify({
            input: text
        });
        const req = https.request({
            method: 'POST',
            hostname: 'www.toptal.com',
            path: `/developers/${type}-minifier/api/raw`
        }, (res) => {
            if (res.statusCode !== 200) reject(new Error('HTTP request returned code ' + res.statusCode));
            res.setEncoding('utf8');
            const chunks: string[] = [];
            res.on('data', (chunk: string) => chunks.push(chunk));
            res.on('end', () => {
                const min = chunks.join();
                resolve(min);
                cache.set(text, min);
            });
        });
        req.on('error', (err) => reject(err));
        req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        req.setHeader('Content-Length', query.length);
        req.write(query, 'utf8');
        req.end();
    });
}