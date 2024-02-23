// Copyright (C) 2024 Sampleprovider(sp)

// loadd
let loadCounter = 0;
window.addEventListener('load', (e) => {
    document.getElementById('loadingCover').style.opacity = 0;
    window.addEventListener('error', (e) => {
        modal('An error occured:', `<span style="color: red;">${e.message}<br>${e.filename} ${e.lineno}:${e.colno}</span>`, false);
    });
    window.onerror = null;
    setTimeout(() => {
        document.getElementById('loadingCover').remove();
    }, 200);
});
window.onerror = (e, filename, lineno, colno, err) => {
    document.getElementById('loadingerror').innerText += `\n${err.message} (at ${filename} ${lineno}:${colno})`;
    loadCounter = -999;
};

// logout if logged in
const usernameDisplay = document.getElementById('usernameDisplay');
const logoutButton = document.getElementById('logoutButton');
if (localStorage.getItem('sessionCredentials') == null) {
    logoutButton.value = 'Log in';
    logoutButton.onclick = (e) => window.location.replace('/login');
} else {
    logoutButton.onclick = (e) => {
        localStorage.removeItem('sessionCredentials');
        window.location.reload();
    };
    glitchTextTransition('Not logged in', JSON.parse(localStorage.getItem('sessionCredentials')).username, (text) => {
        usernameDisplay.innerText = text;
    }, 40, 1);
}

selectPanel('home');

document.getElementById('navContest').onclick = (e) => {
    window.location.replace('/contest');
};