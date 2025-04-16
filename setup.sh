# print OS version
echo "----------------------------------"
echo "SETUP"
echo "----------------------------------"
lsb_release -a
echo "----------------------------------"
read -s -p "PRESS ANY KEY TO CONTINUE" -n 1
echo ""
# update packages & install node
echo "----------------------------------"
apt update
apt upgrade
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash
\. "$HOME/.nvm/nvm.sh"
nvm install 22
echo "----------------------------------"
echo "CHECK VERSION"
node -v
echo "----------------------------------"
read -s -p "PRESS ANY KEY TO CONTINUE" -n 1
echo ""
echo "----------------------------------"
# add SSH private key for deployments
echo -n "SSH PRIVATE KEY: "
deploykey=""
while read -s l; do
    if [[ -z "$l" ]]; then
        break
    fi
    deploykey+="$l"$'\r\n'
done
echo "$deploykey" > ~/.ssh/wwppc-server-deploykey
chmod 600 ~/.ssh/wwppc-server-deploykey
echo "
Host *
    IdentityFile ~/.ssh/wwppc-server-deploykey" >> ~/.ssh/config
echo "----------------------------------"
# clone repo
git clone -b deployment git@github.com:WWPPC/WWPPC-server.git /root/WWPPC-server
# create system service to start server
echo "[Service]
WorkingDirectory=/root/WWPPC-server
ExecStart=npm run start
Restart=on-failure
[Install]
WantedBy=multi-user.target" > /etc/systemd/system/wwppc.service
chmod 664 /etc/systemd/system/wwppc.service
systemctl enable wwppc.service
