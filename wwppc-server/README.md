Use github (or git) to clone to `/root/WWPPC`

## Setup of cron job

cron job:
```
0 0 * * * systemctl stop wwppc.service; cd /root/WWPPC && git pull && npm install && npm run build; systemctl start wwppc.service
```

## Startup script

`sudo vim /etc/systemd/system/wwppc.service`

```
[Service]
WorkingDirectory=/root/WWPPC/wwppc-server
ExecStart=npm run start
Restart=always

[Install]
WantedBy=multi-user.target
```

```
sudo chmod 664 /etc/systemd/system/wwppc.service
systemctl enable /etc/systemd/system/wwppc.service
```

## Schroot config

`sudo vim /etc/schroot/chroot.d/focal-wwppc`

```
[focal-wwppc]
aliases=wwppc
directory=/root/WWPPC-grader/grading
```

## View logs

`journalctl -u wwppc.service -n 50`

## Cron job of grader

Add 5 to the time because cron jobs are UTC

```
0 7 * * * systemctl stop wwppc.service; cd /root/WWPPC-grader && git pull && npm install && npm run compile; git submodule update && cd /root/WWPPC-grader/problems && node compile.js; systemctl start wwppc.service
```