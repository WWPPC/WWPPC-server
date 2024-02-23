// Copyright (C) 2024 Sampleprovider(sp)

// loading aaa
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

let validateCredentials = (username, password) => {
    return username.length > 0 && password.length > 0 && username.length <= 16 && password.length <= 1024 && /^[a-zA-Z0-9]+$/.test(username);
};
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('loginButton');
const signupButton = document.getElementById('signupButton');
let loginAction = async (t) => {
    if (validateCredentials(usernameInput.value, passwordInput.value)) {
        usernameInput.disabled = true;
        passwordInput.disabled = true;
        socket.emit('credentials', {
            action: t,
            username: await RSAencode(usernameInput.value),
            password: await RSAencode(passwordInput.value)
        });
        socket.once('credentialPass', async () => {
            localStorage.setItem('sessionCredentials', JSON.stringify({
                username: usernameInput.value,
                password: Array.from(new Uint32Array(await RSAencode(passwordInput.value))),
            }));
            localStorage.setItem('sid', window.sid);
            window.location.replace(new URLSearchParams(window.location.search).get('forward') ?? '/');
        });
        socket.once('credentialFail', (res) => {
            usernameInput.disabled = false;
            passwordInput.disabled = false;
            modal('Could not log in:', res == 1 ? 'Account with username already exists' : res == 2 ? 'Account not found' : res == 3 ? 'Incorrect password' : res == 4 ? 'Database error' : 'Unknown error (this is a bug?)', 'red');
        });
    } else {
        loginButton.disabled = true;
        signupButton.disabled = true;
        await modal('Invalid Username or Password', 'Your username or password is invalid. Your username must be:<br>At most 16 characters | Only alphanumeric (letters and numbers)', 'red');
    }
};
loginButton.onclick = (e) => !loginButton.disabled && loginAction(0);
signupButton.onclick = (e) => !signupButton.disabled && loginAction(1);
usernameInput.oninput = passwordInput.oninput = (e) => {
    loginButton.disabled = false;
    signupButton.disabled = false;
};
socket.once('getCredentials', (e) => {
    loginButton.disabled = false;
    signupButton.disabled = false;
});

// fun
window.addEventListener('load', async (e) => {
    glitchTextTransition('      ', 'Log in', (text) => { loginButton.value = text; }, 40, 1, 10);
    glitchTextTransition('       ', 'Sign up', (text) => { signupButton.value = text; }, 40, 1, 20);
});