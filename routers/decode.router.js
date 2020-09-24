const router = require('express').Router();
const Jimp = require('jimp');
const lsb = require('../src/lsb');

router.route('').post((request, response)=> {
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

module.exports = router;