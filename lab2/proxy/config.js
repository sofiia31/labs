const convict = require('convict');
const dotenv = require('dotenv');

dotenv.config();

const config = convict({
    port: {
        doc: 'The port to run the server on',
        format: 'port',
        default: 3001,
        env: 'PORT'
    },
    apiUrl: {
        doc: 'The URL of the API server',
        format: String,
        default: 'http://localhost:3000',
        env: 'API_URL'
    }
});

config.validate({ allowed: 'strict' });

module.exports = config;