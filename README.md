# WWPPC-server

The central server for all WWPPC services, like managing accounts and running contests. There should only ever be one of these at any given time.

The server uses a JSON REST api for all communications. See the [WWPPC Networking Docs](https://docs.google.com/spreadsheets/d/1qNvahuIZ5CIl5ROGKc4nUBLOPs86TwiNX7WXwi0tqgo/edit?usp=sharing) for more information. (We may update this in the future to not depend on spaghetti links)

**[See full code documentation here](/docs/modules.md)**

# Server setup

## Base setup

To configure the server, navigate to the `config` directory.

In that, create a new file, `.env`, which contains environment variables:
* `DATABASE_URL`: [PostgreSQL](https://www.postgresql.org/) database connection string (you can usually get this by copying one from your database provide, but if not, the format is usually `postgresql://username:password@hostname:port/databasename`)
* `DATABASE_KEY`: AES-GCM-256 key, used internally for account recovery key encryption
* `SMTP_HOST`: SMTP service hostname (email server)
* `SMTP_PORT`: SMTP service port (email server)
* `SMTP_USER`: SMTP service username (email server)
* `SMTP_PASS`: SMTP service password (email server)
* `GRADER_PASS`: Global grader password, can be any string

If your database requires an SSL-secured connection, place the certificate provided by your database provider in the file `db-cert.crt`, which allows you to connect to the database securely, and add a new entry `DATABASE_SSL="true"` to `.env` to enable SSL connections.

There are also other environment variables, like `DEBUG_MODE`, which are temporary overrides for {@link config} options.

Next, run `npm i` to install dependencies, then `npm run compilerun` to start the server.

Try navigating to `http://localhost:8000/wakeup` now. If you see `ok`, the server has successfully been setup!

## HTTPS and development client setup (recommended)

We will set up the `WWPPC-site-main` repo (but you can also use `WWPPC-site-math`) to act as a client and network with the server. However, the client requires HTTPS connections to access encryption methods, we must first make our browser trust the server, otherwise we may get an SSL error:

Install [mkcert](https://github.com/FiloSottile/mkcert), then run `mkcert -install` followed by `mkcert localhost` as mentioned on the [mkcert documentation](https://github.com/FiloSottile/mkcert/blob/master/README.md). 

Then find the certificate and key and move them to `config/cert.crt` and `config/cert.key` respectively. The `config` folder should now have `.env`, `config.json` (which is generated automatically by the server), `db-cert.crt`, `cert.crt`, and `cert.key`. The server should support HTTPS on the next server restart, and the browser should automatically trust it. Try navigating to `https://localhost:8000/wakeup` *(note the s)* to test.

Next, clone the `WWPPC-site-main` repo, **ensuring you clone all submodules**. Inside the repo, run `npm i` to install all dependencies, then `npm run dev`, which starts [vite](https://vitejs.dev/). Remember to start the server if you haven't already. Navigate to the port specified by `vite` and try clicking on the login screen. If the page successfully loads, you have connected to the server!

## Environment variables and config

Server configuration options are stored in the `config/` directory. Use `config.json` to configure the server settings. (*For developers: If `config.json` does not exist, try running the server via `npm run compilerun` to autogenerate one*) The included `contests.json` contains data for the contest formats.

**For detailed information on all server & contest configuration options, see [config docs](/docs/config/README.md)**

WWPPC-server has some required and some optional environment variables.

### Required
* `DATABASE_URL`: [PostgreSQL](https://www.postgresql.org/) database connection string
* `DATABASE_KEY`: AES-GCM-256 key, used internally for account recovery key encryption
* `SMTP_HOST`: SMTP service hostname (email server)
* `SMTP_PORT`: SMTP service port (email server)
* `SMTP_USER`: SMTP service username (email server)
* `SMTP_PASS`: SMTP service password (email server)
* `GRADER_PASS`: Global grader password, can be any string

### Optional
* `CONFIG_PATH`: Directory to load server configuration from (i.e. `config.json`, `db-cert.crt`, etc.) (default: `../config/`)
* `LOG_PATH`: Directory to write logs to - server will also create a `logs` directory there (default: `../`)
* `EMAIL_TEMPLATE_PATH`: Directory to load email templates from (default: `../email-templates/`)
* `ADMIN_PORTAL_PATH`: Directory to load admin portal from (default: `../admin-portal/`)
* `DATABASE_SSL`: Enables SSL connections for database
* `DATABASE_CERT`: Alternative to `db-cert.crt` (both are ignored if `DATABASE_SSL` is not `"true"`)
* `PORT`: TCP port for the HTTP/HTTPS server to listen to (default: 8000)
* `DEBUG_MODE`: Enable debug logging

*Note: all paths can be absolute or relative to the **`src`** directory (NOT the root directory)*

## Logs

Logs can be found under the `/logs` directory. `recent.log` is a mirror of the most recently generated logfile, all other logs are labeled by their date of creation.

# Deployment setup

*Note: setup script should be run as root to ensure proper adding of SSH keys.*

To deploy a new server (Ubuntu), use `ssh-keygen` to generate an SSH keypair. Add the public key as a deploy key to the GitHub repository, then use the [provided install script](./setup.sh) or CURL command below to run setup:

```bash
curl -o- https://gist.githubusercontent.com/spsquared/c11941d38e1b4b940f748f4549691bfc/raw/2982a82ab52825be290e08ba8f13c8b4722e1dbc/setup.sh | bash
```

This script will print the OS release (tested Ubuntu 24.04 LTS), download and install Node.JS (verify that Node v22 LTS is installed), add the SSH private key, and clone the repository to `~/WWPPC-server/`. When prompted for the SSH private key, paste the private key and hit ENTER.

Now enter the server directory and follow the [server setup](#server-setup) instructions to add configuration files to the server. **DO NOT** use a test certificate for production servers!

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

This needs to be updated