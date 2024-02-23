// Copyright (C) 2024 Sampleprovider(sp)

socket.on('disconnect', async (e) => {
    socket.disconnect();
    await modal('Disconnected', 'You were disconnected from the server. Reload the page to reconnect.', 'red');
    window.location.reload();
});

// load stuff
let loadCounter = 0;
window.addEventListener('load', (e) => {
    loadCounter++;
    if (loadCounter == 2) loadFinish();
});
let loadFinish = () => {
    delete loadFinish;
    document.getElementById('loadingCover').style.opacity = 0;
    window.addEventListener('error', (e) => {
        modal('An error occured:', `<span style="color: red;">${e.message}<br>${e.filename} ${e.lineno}:${e.colno}</span>`, false);
    });
    window.onerror = null;
    setTimeout(() => {
        document.getElementById('loadingCover').remove();
    }, 200);
};
window.onerror = (e, filename, lineno, colno, err) => {
    document.getElementById('loadingerror').innerText += `\n${err.message} (at ${filename} ${lineno}:${colno})`;
    loadCounter = -999;
};

// trigger redirect to login
if (localStorage.getItem('sessionCredentials') == null) {
    window.location.replace('/login?forward=/contest');
    loadCounter = -999;
} else {
    // autosend credentials
    socket.once('getCredentials', async (session) => {
        if (session.session != localStorage.getItem('sid')) {
            window.location.replace('/login?forward=/contest');
            loadCounter = -999;
            return;
        }
        const creds = JSON.parse(localStorage.getItem('sessionCredentials'));
        socket.emit('credentials', {
            action: 0,
            username: creds.username,
            password: Uint32Array.from(creds.password).buffer,
        });
    });
    socket.once('credentialFail', (e) => {
        localStorage.removeItem('sessionCredentials');
        window.location.replace('/login?forward=/contest');
        loadCounter = -999;
    });
    socket.once('credentialPass', () => {
        loadCounter++;
        if (loadCounter == 2) loadFinish();
    });
    glitchTextTransition('Not logged in', JSON.parse(localStorage.getItem('sessionCredentials')).username, (text) => {
        usernameDisplay.innerText = text;
    }, 40, 1);
}
const usernameDisplay = document.getElementById('usernameDisplay');
const logoutButton = document.getElementById('logoutButton');
logoutButton.onclick = (e) => {
    localStorage.removeItem('sessionCredentials');
    window.location.replace('/');
};

selectPanel('problemList');