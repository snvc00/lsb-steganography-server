const tools = require('./tools');

const encode = (message, imageBitmapData) => {
    try {
        const binStr = tools.stringToBinary(message);
        const messageSizeStr = tools.decimalToBinary(message.length);
        const encodeStr = messageSizeStr + binStr;

        if (imageBitmapData.length / 4 < encodeStr.length)
            return null;

        const ENCODE_BIT_TO_PIXELS = encodeStr.length * 4;

        for (let i = 0, j = 0; i < ENCODE_BIT_TO_PIXELS; i+=4, ++j) {
            if (encodeStr[j] === '0' && !tools.isEven(imageBitmapData[i]) ||
                encodeStr[j] === '1' && tools.isEven(imageBitmapData[i])) {
                
                    //! implemented with if statement
                imageBitmapData[i] < 254 ? imageBitmapData[i]++ : imageBitmapData[i]--;
            }
        }

        return imageBitmapData;
    }
    catch {
        return null;
    }
}

const decode = imageBitmapData => {
    try {  
        const PIXELS_FOR_SIZE = 8 * 4; // 8bits hidden in 8px, each px has 4 values
        var msgSizeInBinary = Array(8);

        for (let i = 0, j = 0; i < PIXELS_FOR_SIZE; i+=4, ++j)
            msgSizeInBinary[j] = tools.isEven(imageBitmapData[i]) ? '0' : '1';

        const msgSizeInDecimal = parseInt(msgSizeInBinary.join(""), 2);
        const PIXELS_FOR_MSG = (msgSizeInDecimal * 8 * 4) + PIXELS_FOR_SIZE;
        var chunkOctet = '';
        var decodedMsg = '';

        for (let i = PIXELS_FOR_SIZE; i <= PIXELS_FOR_MSG; i+=4) {
            if (chunkOctet.length === 8) {
                let charCode = parseInt(chunkOctet, 2);
                decodedMsg += String.fromCharCode(charCode);
                chunkOctet = '';
            }
            tools.isEven(imageBitmapData[i]) ?  chunkOctet += '0' : chunkOctet += '1';
        }
        return decodedMsg;
    }
    catch {
        return null;
    }
}

module.exports = {
    encode, 
    decode
};