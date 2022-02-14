const moment = require('moment');

const getRamdomInt = (min, max) => {
    let number = 0;
    min = Math.ceil(min);
    max = Math.floor(max);
    number = Math.floor(Math.random() * (max - min + 1)) + min;
    return number;
}

const getDateNow = () => {
    return moment();
}

module.exports = {
    getRamdomInt: getRamdomInt,
    getDateNow: getDateNow
}