// common stuff on every page

// socketio
const socket = io();
socket.on('disconnect', (e) => {
    modal('Disconnected', 'You were disconnected from the server. Reload the page to reconnect.', 'red');
    socket.disconnect();
});

// modal
const modalContainer = document.getElementById('modalContainer');
const modalBody = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const modalYes = document.getElementById('modalYes');
const modalNo = document.getElementById('modalNo');
const modalOk = document.getElementById('modalOk');
function modal(title, subtitle, border = 'white', confirmation = false) {
    modalTitle.innerHTML = title;
    modalContent.innerHTML = subtitle;
    modalBody.style.borderColor = border;
    if (confirmation) {
        modalYes.style.display = '';
        modalNo.style.display = '';
        modalOk.style.display = 'none';
    } else {
        modalYes.style.display = 'none';
        modalNo.style.display = 'none';
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
        modalOk.onclick = (e) => {
            hide();
            resolve(true);
        };
        document.addEventListener('keydown', function cancel(e) {
            if (e.key == 'Escape') {
                hide();
                resolve(false);
                document.removeEventListener('keydown', cancel);
            }
        });
    });
};

// title stuff
const title = document.head.querySelector('title');
function updateTitle(title) {
    title.innerText = title + ' | CSI - absolute Coding club Super Interesting competition';
};

// don't worry about it
function superSecretScanlines() {
    document.getElementById('superSecretDiv').style.display = 'block';
};
if (new URLSearchParams(window.location.search).get('superSecretScanlines') || Math.random() < 0.01) superSecretScanlines();
socket.once('superSecretMesage', superSecretScanlines);