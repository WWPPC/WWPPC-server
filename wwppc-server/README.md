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

## View logs

`journalctl -u wwppc.service -n 50`

## Cron job of grader

```
0 0 * * * systemctl stop wwppc.service; cd /root/WWPPC-grader && git pull && npm install && npm run compile; cd /root/WWPPC-grader/problems && git pull; systemctl start wwppc.service
```

The actual command we're using because its not root lol

```
sudo systemctl stop wwppc.service; cd /home/other/repo/WWPPC-grader && git pull && npm install && npm run compile; cd /home/other/repo/WWPPC-grader/problems && git pull && node compile.js; sudo systemctl start wwppc.service
```