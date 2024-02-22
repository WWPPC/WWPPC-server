// Copyright (C) nope

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
    window.location.replace('/login');
    loadCounter = -999;
} else {
    // autosend credentials
    socket.once('getCredentials', async (key) => {
        const creds = JSON.parse(localStorage.getItem('sessionCredentials'));
        socket.emit('credentials', {
            action: 0,
            username: Uint32Array.from(creds.username).buffer,
            password: Uint32Array.from(creds.password).buffer,
        });
    });
    socket.once('credentialFail', (e) => {
        localStorage.removeItem('sessionCredentials');
        window.location.replace('/login');
        loadCounter = -999;
    });
    socket.once('credentialPass', () => {
        loadCounter++;
        if (loadCounter == 2) loadFinish();
    });
}

// panel selectors
const panelSelectors = document.body.querySelectorAll('.panelButton');
const panels = document.body.querySelectorAll('.panel');
for (const button of panelSelectors) {
    const thisPanel = document.querySelector(`.panel[cpanel=${button.getAttribute('cpanel')}]`);
    button.onclick = (e) => {
        panels.forEach(p => p.classList.add('hidden'));
        thisPanel.classList.remove('hidden');
    };
    button.cpanel = button.getAttribute('cpanel');
}
function selectPanel(name) {
    for (let button of panelSelectors) {
        if (button.cpanel === name) {
            button.click();
            break;
        }
    }
};
selectPanel('problemList');