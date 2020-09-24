const router = require('express').Router();
const Jimp = require('jimp');
const lsb = require('../src/lsb');

const TEMP_FILE = 'encoded.png';

router.route('').post((request, response) => {
    if (!request.files)
        response.status(400).json('Error: No files received');

    const message = request.body.message ? request.body.message : '';
    const image = request.files.image ? request.files.image : null;

    if (message.length === 0 || !image)
        response.status(400).json('Error: Incomplete resources');

    Jimp.read(image.data, (error, img) => {
        if (error)
            response.status(400).json(`Error: ${error}`);

        img.bitmap.data = lsb.encode(message, img.bitmap.data);
        
        if (!img)
            response.status(400).json('Error: No image available');

        img.write(TEMP_FILE);
    });
    
    response.status(200).json('Status: Success');
});

module.exports = router;