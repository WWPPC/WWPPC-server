Use github (or git) to clone to `/root/WWPPC`

## Setup of cron job

cron job:
```
0 0 * * * systemctl stop wwppc_startup.service; cd /root/WWPPC && git pull && npm install && npm run build; systemctl start wwppc_startup.service
```

## Startup script

`sudo vim /etc/systemd/system/wwppc_startup.service`

```
[Service]
WorkingDirectory=/root/WWPPC/wwppc-server
ExecStart=/usr/local/bin/npm run start
Restart=always

[Install]
WantedBy=multi-user.target
```

```
sudo chmod 664 /etc/systemd/system/wwppc_startup.service
systemctl enable /etc/systemd/system/wwppc_startup.service
```

## View logs

`journalctl -u wwppc_startup.service -n 50`