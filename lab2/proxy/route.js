const express = require('express');
const axios = require('axios');
const router = express.Router();
const config = require('./config');

router.get('/', async (req, res) => {
    try {
        const response = await axios.get(config.get('apiUrl'));
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching data from API:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;