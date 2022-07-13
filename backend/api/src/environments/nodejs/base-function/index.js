"use strict"


const getStdin = require('get-stdin');

const handler = async (event) => {




}


getStdin().then((str) => {
    const result = handler(str);
    console.log(JSON.stringify(result))
})
