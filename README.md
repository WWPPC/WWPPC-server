# WWPPC-server

The central server for all WWPPC services, like managing accounts and running contests. There should only ever be one of these at any given time.

The server uses [Socket.IO](https://socket.io) as a bi-directional communication layer but also has some HTTP APIs. See the [WWPPC Networking Docs](https://docs.google.com/spreadsheets/d/1qNvahuIZ5CIl5ROGKc4nUBLOPs86TwiNX7WXwi0tqgo/edit?usp=sharing) for more information. (We may update this in the future to not depend on spaghetti links)

# Server setup

## Base setup

After cloning the `WWPPC-server` repo, create a folder `config` in the root directory of the repository (next to `src`).

In that, create a new file, `.env`, which contains environment variables:
* `DATABASE_URL`: [PostgreSQL](https://www.postgresql.org/) database connection string (you can usually get this by copying one from your database provide, but if not, the format is usually `postgresql://username:password@hostname:port/databasename`)
* `DATABASE_KEY`: AES-GCM-256 key, used internally for account recovery key encryption
* `RECAPTCHA_SECRET`: Your [reCAPTCHA](https://developers.google.com/recaptcha/) **SECRET** key (*NOT* your *SITE* key)
* `SMTP_HOST`: SMTP service hostname (email server)
* `SMTP_PORT`: SMTP service port (email server)
* `SMTP_USER`: SMTP service username (email server)
* `SMTP_PASS`: SMTP service password (email server)
* `GRADER_PASS`: Global grader password, can be any string
`db-cert.pem`, which allows you to connect to the database securely

There are also other environment variables, like `SERVE_STATIC` and `DEBUG_MODE`, which are temporary overrides for {@link config} options.

Both of these should be in `#backend` channel on Discord, so you can just copy them in.

Next, run `npm i` to install dependencies, then `npm run compilerun` to start the server.

Try navigating to `http://localhost:8000/wakeup` now. If you see `ok`, the server has successfully been setup! Note we still have to setup the client, where we have two options:

## Setup HTTPS and client (recommended)

We will set up the `WWPPC-site-main` repo (but you can also use `WWPPC-site-math`) to act as a client and network with the server. However, the client requires HTTPS connections to access encryption methods, we must first make our browser trust the server, otherwise we may get an SSL error:

Install [mkcert](https://github.com/FiloSottile/mkcert), then run `mkcert -install` followed by `mkcert localhost` as mentioned on the [mkcert documentation](https://github.com/FiloSottile/mkcert/blob/master/README.md). 

Then find the certificate and key and move them to `config/cert.pem` and `config/cert-key.pem` respectively. The `config` folder should now have `.env`, `config.json` (which is generated automatically by the server), `db-cert.pem`, `cert.pem`, and `cert-key.pem`. The server should support HTTPS on the next server restart, and the browser should automatically trust it. Try navigating to `https://localhost:8000/wakeup` *(note the s)* to test.

Next, clone the `WWPPC-site-main` repo, **ensuring you clone all submodules**. Inside the repo, run `npm i` to install all dependencies, then `npm run dev`, which starts [vite](https://vitejs.dev/). Remember to start the server if you haven't already. Navigate to the port specified by `vite` and try clicking on the login screen. If the page successfully loads, you have connected to the server!

## Setup static hosting

First, clone the `WWPPC-site-main` repo, **ensuring you clone all submodules**. Inside the repo, run `npm i` to install all dependencies, then `npm run build`, which compiles the TypeScript, among other things, and places it in a folder called `dist`.

Next, find `config/config.json`, which is generated automatically when you start the server. Add another key, `clientPath`, specifying the relative location of the `WWPPC-site-main/dist` folder to `WWPPC-server/src`. If the two repos were cloned in the same directory, it will be `"../../WWPPC-site-main/dist"`, so the full line will look like `"clientPath": "../../WWPPC-site-main/dist"`.

Restart the server and try navigating to `http://localhost:8000`. If you see the home page, static hosting is successfully setup!

## Environment variables and config

**For global server configuration, see {@link config}**

WWPPC-server has some required and some optional environment variables.

### Required
* `DATABASE_URL`: [PostgreSQL](https://www.postgresql.org/) database connection string
* `DATABASE_KEY`: AES-GCM-256 key, used internally for account recovery key encryption
* `RECAPTCHA_SECRET`: Your [reCAPTCHA](https://developers.google.com/recaptcha/) **SECRET** key
* `SMTP_HOST`: SMTP service hostname (email server)
* `SMTP_PORT`: SMTP service port (email server)
* `SMTP_USER`: SMTP service username (email server)
* `SMTP_PASS`: SMTP service password (email server)
* `GRADER_PASS`: Global grader password, can be any string

### Optional
* `CONFIG_PATH`: Directory to load server configuration from (i.e. `config.json`, `db-cert.pem`, etc.) (default: `../config/`)
* `LOG_PATH`: Directory to write logs to - server will also create a `logs` directory there (default: `../`)
* `CLIENT_PATH`: Directory to serve static hosting from (if {@link config.serveStatic} is true) - setting this incorrectly can cause strange problems
* `EMAIL_TEMPLATE_PATH`: Directory to load email templates from (default: `../email-templates/`)
* `ADMIN_PORTAL_PATH`: Directory to load admin portal from (default: `../admin-portal/`)
* `DATABASE_CERT`: Alternative to `db-cert.pem`
* `PORT`: TCP port for the HTTP/HTTPS server to listen to (default: 8000)
* `DEBUG_MODE`: Enable debug logging
* `SERVE_STATIC`: Enable static hosting (note that this WILL NOT WORK if `CLIENT_PATH` is not given!)

*Note: all paths can be absolute or relative to the **`src`** directory (NOT the root directory)*


# Server stuff (needs formatting)

Use github (or git) to clone to `/root/WWPPC`

## Setup of cron job

cron job:

```
0 0 * * * systemctl stop wwppc.service; cd /root/WWPPC && git pull && npm install && npm run build; systemctl start wwppc.service
```

## Startup script

```
vim /etc/systemd/system/wwppc.service
```

```
[Service]
WorkingDirectory=/root/WWPPC/wwppc-server
ExecStart=npm run start
Restart=always

[Install]
WantedBy=multi-user.target
```

```
chmod 664 /etc/systemd/system/wwppc.service
systemctl enable /etc/systemd/system/wwppc.service
```

# Grader stuff

Again use git to clone to `/root/WWPPC-grader`

Update the submodules and stuff

```
git submodule update
git pull
```

## chroot

```
chmod +x ./setup.sh
./setup.sh
```

The user and java install stuff doesn't work right now, do it manually:

```
adduser user

```

Mash enter to skip through prompts

```
schroot -c wwppc -d /
adduser user
mount -t proc proc /proc
apt update
apt install openjdk-21-jre-headless
exit
```

## View logs

```
journalctl -u wwppc.service -n 50
```

## Cron job of grader

Add 5 to the time because cron jobs are UTC

```
0 7 * * * systemctl stop wwppc.service; cd /root/WWPPC-grader && git pull && npm install && npm run compile; git submodule update && cd /root/WWPPC-grader/problems && node compile.js; systemctl start wwppc.service
```