const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const app = express();

app.use(fileUpload({
    createParentPath: true
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    next();
});

const encode = require('./routers/encode.router');
const decode = require('./routers/decode.router');
const encodedImage = require('./routers/encodedImage.router');

app.use('/encode', encode);
app.use('/decode', decode);
app.use('/encoded-image', encodedImage);

app.listen(4000, () => {
    console.log('Server running on port 4000');
});