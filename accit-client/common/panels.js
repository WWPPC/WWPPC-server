// Copyright (C) 2024 Sampleprovider(sp)

// panel selectors
const panelSelectors = document.body.querySelectorAll('.panelButton');
const panels = document.body.querySelectorAll('.panel');
for (const button of panelSelectors) {
    const thisPanel = document.querySelector(`.panel[cpanel=${button.getAttribute('cpanel')}]`);
    button.onclick = (e) => {
        panels.forEach(p => p.classList.add('hidden'));
        thisPanel.classList.remove('hidden');
    };
    button.cvalue = button.value;
    button.cAnimation = null;
    button.onmouseover = (e) => {
        if (button.cAnimation?.finished == false) button.cAnimation.cancel();
        button.cAnimation = glitchTextTransition(button.value, button.cvalue, (text) => {
            button.value = text;
        }, 40, 2, 15, 1, button.cAnimation?.finished == false);
    }
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
function addPanelListener(name, cb) {
    for (const button of panelSelectors) {
        if (button.cpanel === name) {
            button.addEventListener('click', cb);
        }
    }
};
function removePanelListener(name, cb) {
    for (const button of panelSelectors) {
        if (button.cpanel === name) {
            button.removeEventListener('click', cb);
        }
    }
};
window.addEventListener('load', (e) => {
    for (const button of panelSelectors) {
        button.cAnimation = glitchTextTransition(button.value, button.cvalue, (text) => {
            button.value = text;
        }, 40, 1, 20);
    }
});