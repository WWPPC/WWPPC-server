# Setup for development

## Server setup

After cloning the `WWPPC-server` repo, create a folder `config` in the root directory of the repository with the following files:

* `.env`, which contains environment variables:
    * DATABASE_URL: [PostgreSQL](https://www.postgresql.org/) database connection string
    * DATABASE_KEY: Used for password recovery keys
    * RECAPTCHA_SECRET: Connects to [reCAPTCHA](https://developers.google.com/recaptcha/)
    * SMTP_HOST: For sending emails
    * SMTP_PORT: For sending emails
    * SMTP_USER: For sending emails
    * SMTP_PASS: For sending emails
    * GRADER_PASS: For authenticating grader connections
* `db-cert.pem`, which allows you to connect to the database securely

Both of these should be in `#backend` channel on Discord, so you can just copy them in.

Next, run `npm i` to install dependencies, then `npm run compilerun` to start the server.

Try navigating to `http://localhost:8000/wakeup` now. If you see `ok`, the server has successfully been setup! Note we still have to setup the client, where we have two options:

## Setup HTTPS and vite (recommended)

We will set up the `WWPPC-site-main` repo to act as a client and network with the server. This method is preferred because we can take advantage of the powerful features of [vite](https://vitejs.dev/). However, since the client makes HTTPS requests and not HTTP requests, we must first make our browser trust the server, otherwise we may get an SSL error:

Install [mkcert](https://github.com/FiloSottile/mkcert), then run `mkcert -install` followed by `mkcert localhost` as mentioned on the [mkcert documentation](https://github.com/FiloSottile/mkcert/blob/master/README.md). 

Then find the certificate and key and move them to `config/cert.pem` and `config/cert-key.pem` respectively. The `config` folder should now have `.env`, `config.json` (which is generated automatically by the server), `db-cert.pem`, `cert.pem`, and `cert-key.pem`. The server should support HTTPS on the next server restart, and the browser should automatically trust it. Try navigating to `https://localhost:8000/wakeup` *(note the s)* to test.

Next, clone the `WWPPC-site-main` repo, **ensuring you clone all submodules**. Inside the repo, run `npm i` to install all dependencies, then `npm run dev`, which starts [vite](https://vitejs.dev/). Remember to start the server if you haven't already. Navigate to the port specified by `vite` and try clicking on the login screen. If the page successfully loads, you have connected to the server!

## Setup static hosting

First, clone the `WWPPC-site-main` repo, **ensuring you clone all submodules**. Inside the repo, run `npm i` to install all dependencies, then `npm run build`, which compiles the TypeScript, among other things, and places it in a folder called `dist`.

Next, find `config/config.json`, which is generated automatically when you start the server. Add another key, `clientPath`, specifying the relative location of the `WWPPC-site-main/dist` folder to `WWPPC-server/src`. If the two repos were cloned in the same directory, it will be `"../../WWPPC-site-main/dist"`, so the full line will look like `"clientPath": "../../WWPPC-site-main/dist"`.

Restart the server and try navigating to `http://localhost:8000`. If you see the home page, static hosting is successfully setup!

# Server stuff

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