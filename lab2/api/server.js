//server.js
const express = require('express');
const app = express();

app.use("/", (req, res) => {
    res.send("hello world");
    res.end();

});

module.exports = app;
