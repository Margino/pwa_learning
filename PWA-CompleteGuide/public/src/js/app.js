var deferredPrompt;

if (!window.Promise) {
    window.Promise = Promise;
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/sw.js')
        .then(() => {
            console.log('Service worker is registered');
        })
}

window.addEventListener('beforeinstallprompt', (e) => {
    console.log('beforeinstallprompt fired');
    e.preventDefault();
    deferredPrompt = e;
    return false; // have no idea why? As far as I know, 'return false' doesn't work in 'EventListener' but works in 'onclick'.
});
