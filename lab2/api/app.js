const express = require('express')
require('dotenv').config();
const app = express();
app.get('/', (req, res) => {
    const responseText = process.env.RESPONSE_TEXT || "hello world"  
    console.log(process.env)
    res.send(responseText);
});
app.listen(3000, () => console.log('Server is running on port 3000'))
module.exports = app