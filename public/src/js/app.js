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

var promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject({
            code: 500,
            message: 'An error occured!'
        })
        // resolve('This is executed once the timer is dont!');
    });
});

promise.then((text) => {
    console.log(text);
}).then(() => {
    console.log('This is executed right after setTimeout (2)');
}).catch((err) => {
    console.log(`${err.code}, ${err.message}`)
});

console.log('This is executed right after setTimeout (1)');

fetch('http://httpbin.org/ips').then((response) => {
    console.log(response);
    return response.json();
}).then((data) => {
    console.log(data);
}).catch((err) => {
    console.log(err);
});

fetch('https://httpbin.org/post', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    mode: 'cors',
    body: JSON.stringify({message: 'Does this work?'})
}).then((response) => {
    return response.json();
}).then((data) => {
    console.log(data);
}).catch((err) => {
    console.log(err);
});
