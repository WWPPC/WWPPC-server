**wwppc-server** • [**Docs**](modules.md)

***

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
