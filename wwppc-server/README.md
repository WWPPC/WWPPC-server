Use github (or git) to clone to `/root/WWPPC`

## Setup of cron job

cron job:
`0 0 * * * pkill -f node -TERM && cd /root/WWPPC && git pull && npm install && npm run build && npm run start`

## Startup script

`sudo vim /etc/systemd/system/wwppc_startup.service`

```
[Service]
WorkingDirectory=/root/WWPPC
ExecStart=/usr/local/bin/npm run start
User=root

[Install]
WantedBy=multi-user.target
```

```
sudo chmod 664 /etc/systemd/system/wwppc_startup.service
systemctl enable /etc/systemd/system/wwppc_startup.service
```