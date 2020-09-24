const router = require('express').Router();
const fs = require('fs');

const TEMP_FILE = 'encoded.png';

router.route('').get((request, response) => {
    var stream = fs.createReadStream(TEMP_FILE);
    stream.on('open', () => {
        response.set('Content-Type', 'image/png');
        stream.pipe(response);
    });
    fs.unlink(TEMP_FILE, error => console.log(error));
});

module.exports = router;