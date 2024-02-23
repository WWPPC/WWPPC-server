// Copyright (C) 2024 Sampleprovider(sp)

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
selectPanel('home');

document.getElementById('navContest').onclick = (e) => {
    window.location.replace('/contest');
};