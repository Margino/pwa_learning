if(!('serviceWorker in navigator')) {
    console.log(`sw is not supported`);
    // return
}

navigator.serviceWorker.register(
    '/sw.js'
).then((registration) => {
    console.log(`Sw registered. Scope is`, registration.scope);
});
