const express = require('express');
const routes = require('./route');
const config = require('./config');
const app = express();

app.use('/', routes);

const PORT = config.get('port') || 3001;

app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});

