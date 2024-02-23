// insert a copyrigh statement here

// validate inputs before sending
// also validate on server

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
        socket.once('credentialPass', async (e) => {
            localStorage.setItem('sessionCredentials', JSON.stringify({
                username: await Array.from(new Uint32Array(RSAencode(usernameInput.value))),
                password: await Array.from(new Uint32Array(RSAencode(passwordInput.value))),
            }));
            await glitchTextTransition('')
            window.location.replace('/contest');
        });
        socket.once('credentialFail', (e) => {
            usernameInput.disabled = false;
            passwordInput.disabled = false;
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