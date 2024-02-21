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
if (localStorage.getItem('plaintextCredentials') == null) {
    window.location.replace('./login');
    loadCounter = -999;
} else {
    // validate with server first
    loadCounter++;
    if (loadCounter == 2) loadFinish();
}