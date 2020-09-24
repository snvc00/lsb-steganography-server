//? Restricted to 2^7
const stringToBinary = string => {
    var binStr = '';
    for (let i = 0; i < string.length; ++i)
        binStr += decimalToBinary(string.charCodeAt(i));
    return binStr;
}

//? Converts from character string to binary string
const decimalToBinary = decimal => {
    var binary = '';
    for (let i = 7; i >= 0; --i) {
        const current = Math.pow(2, i);
        if (decimal >= current) {
            decimal -= current;
            binary += '1';
        }
        else {
            binary += '0';
        }
    }
    return binary;
}

//? Check if number is even
const isEven = number => {
    return number % 2 == 0;
}

module.exports = {
    stringToBinary,
    decimalToBinary,
    isEven
};