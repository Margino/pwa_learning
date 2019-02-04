'use strict';
const fetch = require('node-fetch');

fetch('http://localhost:3000/index.html')
    .then(response => {
        return response.text()
    })
    .then(text => {
        console.log(text);
    })

fetch('http://localhost:3000/animals.json')
    .then(response => {
        return response.json();
    })
    .then(json => {
        console.log(json);
    })
