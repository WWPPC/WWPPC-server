# print OS version
echo "----------------------------------"
echo "SETUP"
echo "----------------------------------"
lsb_release -a
echo -n "user: "
whoami
echo "----------------------------------"
read -s -p "PRESS ANY KEY TO CONTINUE" -n 1
echo ""
# update packages & install node
echo "----------------------------------"
apt update
apt upgrade
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash
\. "$HOME/.nvm/nvm.sh"
nvm install 22.14.0
echo "----------------------------------"
echo "CHECK VERSION - v22.14.0"
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
git clone -b deployment git@github.com:WWPPC/WWPPC-server.git $HOME/WWPPC-server
# create system service to start server
echo "[Service]
WorkingDirectory=$HOME/WWPPC-server
ExecStart=$HOME/.nvm/versions/node/v22.14.0/bin/node $HOME/WWPPC-server/build/server.js --expose-gc
Restart=on-failure
User=root
[Install]
WantedBy=multi-user.target" > /etc/systemd/system/wwppc.service
chmod 664 /etc/systemd/system/wwppc.service
systemctl enable wwppc.service
systemctl start wwppc.service