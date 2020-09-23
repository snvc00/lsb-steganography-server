const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const Jimp = require('jimp');
const fs = require('fs');
const lsb = require('./lsb');

const app = express();

app.use(fileUpload({
    createParentPath: true
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const TEMP_FILE = 'encoded.png';

app.get("/encoded-image", (request, response) => {
    var stream = fs.createReadStream(TEMP_FILE);
    stream.on('open', () => {
        response.set('Content-Type', 'image/png');
        stream.pipe(response);
    });
    fs.unlink(TEMP_FILE, error => console.log(error));
});

app.post("/encode", (request, response) => {
    if (!request.files)
        response.send({error: 'No file available'});

    const message = request.body.message ? request.body.message : '';
    const image = request.files.image ? request.files.image : null;

    if (message.length === 0)
        response.send({error: 'No message'});
    
    if (!image)
        response.send({error: 'No image'});

    Jimp.read(image.data, (error, img) => {
        if (error)
            throw error;

        img.bitmap.data = lsb.encode(message, img.bitmap.data);
        
        if (!img)
            response.send({error: 'Error during image processing'});

        img.write(TEMP_FILE);
    });

    response.send();
});

app.post("/decode", (request, response) => {
    if (!request.files)
        response.send({error: 'No file available'});
    
    const image = request.files.image ? request.files.image : null;
    
    if (!image)
        response.send({error: 'No image'});

    Jimp.read(image.data, (error, img) => {
        if (error) 
            throw error;

        if (img.bitmap.length / 4 < 16)
            response.send({error: 'File size is smaller than the minimum'});

        const message = lsb.decode(img.bitmap.data);

        if (!message)
            response.send({error : 'Error during message decodification'}).status(500);

        response.send({ decodedMessage: message });
    });
});

app.listen(4000, () => {
    console.log('Server running on port 4000');
});