if (process.env.NODE_ENV == 'production' && window.navigator.serviceWorker !== undefined) {
    try {
        window.navigator.serviceWorker.register('/serviceWorker.js', { scope: '/' });
    } catch (err) {
        console.error('Service worker installation failed:');
        console.error(err);
    }
}