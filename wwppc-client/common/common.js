// Copyright (C) 2024 Sampleprovider(sp)

document.getElementById('commonContainer').innerHTML = `
<div id="modalContainer">
    <div id="modal">
        <h1 id="modalTitle"></h1>
        <p id="modalContent"></p>
        <input type="text" id="modalInput" class="textBox">
        <br>
        <button id="modalYes" class="button">YES</button>
        <button id="modalNo" class="button">NO</button>
        <button id="modalCancel" class="button">CANCEL</button>
        <button id="modalOk" class="button">OK</button>
        <br>
        <br>
    </div>
</div>
<div id="superSecretDiv">
    <div id="superSecretNoise"></div>
    <div id="superSecretScanlines"></div>
    <div id="superSecretFlicker"></div>
    <div id="superSecretRadialElectronBeamBending"></div>
    <div id="superSecretStroboscopicScanlineEffect"></div>
</div>
`;
function createToggle(id, checked) {
    const label = document.createElement('label');
    label.classList.add('toggle');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.classList.add('toggleInput');
    input.id = id;
    if (checked) input.checked = true;
    const span = document.createElement('span');
    span.classList.add('toggleSlider');
    label.appendChild(input);
    label.appendChild(span);
    return { label: label, input: input };
}
document.querySelectorAll('.toggleGen').forEach((parent) => {
    parent.appendChild(createToggle(parent.getAttribute('tid'), parent.getAttribute('tchecked')).label);
});

// socketio
const socket = io();
socket.once('getCredentials', async (session) => {
    if (window.crypto.subtle === undefined) {
        modal('Insecure context', 'The page has been opened in an insecure context and cannot perform encryption processes. Credentials and submissions will be sent in PLAINTEXT!');
    } else {
        window.publicKey = await window.crypto.subtle.importKey('jwk', session.key, { name: "RSA-OAEP", hash: "SHA-256" }, false, ['encrypt']);
        window.sid = session.session;
    }
});
async function RSAencode(text) {
    if (window.publicKey) return await window.crypto.subtle.encrypt({ name: 'RSA-OAEP' }, window.publicKey, new TextEncoder().encode(text));
    else return text;
};

// modal
const modalContainer = document.getElementById('modalContainer');
const modalBody = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const modalInput = document.getElementById('modalInput');
const modalYes = document.getElementById('modalYes');
const modalNo = document.getElementById('modalNo');
const modalCancel = document.getElementById('modalCancel');
const modalOk = document.getElementById('modalOk');
function modal(title, subtitle, border = 'white', mode = 0, glitchTitle = false) {
    if (glitchTitle) glitchTextTransition(title, title, (text) => modalTitle.innerHTML = text, 40, 2, 10, 1, true);
    else modalTitle.innerHTML = title;
    modalContent.innerHTML = subtitle;
    modalBody.style.borderColor = border;
    modalInput.value = '';
    if (mode == 1) {
        modalInput.style.display = 'none';
        modalYes.style.display = '';
        modalNo.style.display = '';
        modalCancel.style.display = 'none';
        modalOk.style.display = 'none';
    } else if (mode == 2) {
        modalInput.style.display = '';
        modalYes.style.display = 'none';
        modalNo.style.display = 'none';
        modalCancel.style.display = '';
        modalOk.style.display = '';
    } else {
        modalInput.style.display = 'none';
        modalYes.style.display = 'none';
        modalNo.style.display = 'none';
        modalCancel.style.display = 'none';
        modalOk.style.display = '';
    }
    modalContainer.style.opacity = '1';
    modalContainer.style.pointerEvents = 'all';
    modalBody.style.transform = 'translateY(calc(50vh + 50%))';
    const hide = () => {
        modalContainer.style.opacity = '';
        modalContainer.style.pointerEvents = '';
        modalBody.style.transform = '';
        modalYes.onclick = null;
        modalNo.onclick = null;
        modalOk.onclick = null;
    };
    return new Promise((resolve, reject) => {
        modalYes.onclick = (e) => {
            hide();
            resolve(true);
        };
        modalNo.onclick = (e) => {
            hide();
            resolve(false);
        };
        modalCancel.onclick = (e) => {
            hide();
            resolve(mode == 2 ? '' : false);
        };
        modalOk.onclick = (e) => {
            hide();
            resolve(mode == 2 ? modalInput.value : true);
        };
        document.addEventListener('keydown', function cancel(e) {
            if (e.key == 'Escape') {
                hide();
                resolve(mode == 2 ? '' : false);
                document.removeEventListener('keydown', cancel);
            }
        });
    });
};

// text transitions (from red pixel simulator)
function flipTextTransition(from, to, update, speed, block = 1) {
    let cancelled = false;
    const ret = {
        promise: new Promise((resolve, reject) => {
            let gen = flipTextTransitionGenerator(from, to, block);
            let animate = setInterval(() => {
                let next = gen.next();
                if (cancelled || next.done || update(next.value)) {
                    clearInterval(animate);
                    ret.finished = true;
                    resolve();
                }
            }, 1000 / speed);
        }),
        finished: false,
        cancel: () => cancelled = true
    };
    return ret;
};
function* flipTextTransitionGenerator(from, to, block) {
    let i = 0;
    let addSpaces = to.length < from.length;
    let fromTags = from.match(/<(.*?)>/g) ?? [];
    let toTags = to.match(/<(.*?)>/g) ?? [];
    let cleanFrom = from;
    let cleanTo = to;
    fromTags.forEach((tag) => cleanFrom = cleanFrom.replace(tag, '§'));
    toTags.forEach((tag) => cleanTo = cleanTo.replace(tag, '§'));
    while (true) {
        let text = cleanTo.substring(0, i);
        if (addSpaces && i >= cleanTo.length) {
            for (let j = cleanTo.length; j < i; j++) {
                text += ' ';
            }
        }
        for (let j = 0; text.includes('§'); j++) {
            text = text.replace('§', toTags[j]);
        }
        text += cleanFrom.substring(i);
        let k = text.lastIndexOf('§'); // most useless optimization ever
        for (let j = fromTags.length - 1; k >= 0; j--) {
            text = text.substring(0, k) + fromTags[j] + text.substring(k + 1);
            k = text.lastIndexOf('§');
        }
        i += block;
        if (i >= cleanTo.length + block && (!addSpaces || i >= cleanFrom.length + block)) {
            yield to;
            break;
        }
        yield text;
    }
};
function glitchTextTransition(from, to, update, speed, block = 1, glitchLength = 5, advanceMod = 1, startGlitched = false) {
    let cancelled = false;
    const ret = {
        promise: new Promise((resolve, reject) => {
            let gen = glitchTextTransitionGenerator(from, to, block, glitchLength, advanceMod, startGlitched);
            let animate = setInterval(() => {
                let next = gen.next();
                if (cancelled || next.done || update(next.value)) {
                    clearInterval(animate);
                    ret.finished = true;
                    resolve();
                }
            }, 1000 / speed);
        }),
        finished: false,
        cancel: () => cancelled = true
    };
    return ret;
};
function* glitchTextTransitionGenerator(from, to, block, glitchLength, advanceMod, startGlitched) {
    let addSpaces = to.length < from.length;
    let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890-=!@#$%^&*()_+`~[]\\{}|;\':",./?';
    let a = 0;
    let fromTags = from.match(/<(.*?)>/g) ?? [];
    let toTags = to.match(/<(.*?)>/g) ?? [];
    let cleanFrom = from;
    let cleanTo = to;
    fromTags.forEach((tag) => cleanFrom = cleanFrom.replace(tag, '§'));
    toTags.forEach((tag) => cleanTo = cleanTo.replace(tag, '§'));
    let i = startGlitched ? cleanTo.length : 0;
    while (true) {
        let text = cleanTo.substring(0, i - glitchLength);
        if (addSpaces && i >= cleanTo.length) {
            for (let j = cleanTo.length; j < i - glitchLength; j++) {
                text += ' ';
            }
        }
        for (let j = 0; text.includes('§'); j++) {
            text = text.replace('§', toTags[j]);
        }
        for (let j = Math.max(0, i - glitchLength); j < Math.min(i, Math.max(cleanFrom.length, cleanTo.length)); j++) {
            text += letters.charAt(~~(Math.random() * letters.length));
        }
        text += cleanFrom.substring(i);
        let k = text.lastIndexOf('§'); // most useless optimization ever
        for (let j = fromTags.length - 1; k >= 0; j--) {
            text = text.substring(0, k) + fromTags[j] + text.substring(k + 1);
            k = text.lastIndexOf('§');
        }
        if (a % advanceMod == 0) i += block;
        if (i >= cleanTo.length + block + glitchLength && (!addSpaces || i >= cleanFrom.length + block + glitchLength)) {
            yield to;
            break;
        }
        yield text;
        a++;
    }
};

// thing
async function sleep(ms) {
    await new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
};

// title stuff
const title = document.head.querySelector('title');
function updateTitle(title) {
    title.innerText = title + ' | WWPPC';
};

// service worker
if (navigator.serviceWorker !== undefined) {
    try {
        navigator.serviceWorker.register('./serviceWorker.js', { scope: '/' });
    } catch (err) {
        console.error('Service worker installation failed:');
        console.error(err);
    }
}

// don't worry about it
function superSecretScanlines() {
    document.getElementById('superSecretDiv').style.display = 'block';
};
if (new URLSearchParams(window.location.search).get('superSecretScanlines') || Math.random() < 0.01) superSecretScanlines();
socket.once('superSecretMessage', superSecretScanlines);