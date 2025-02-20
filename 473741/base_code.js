function processData(input) {
    return input.map(num => {
        let strNum = num.toString();
        if (num < 0) {
            strNum = '-' + strNum.split('').reverse().join('');
        } else {
            strNum = strNum.split('').reverse().join('');
        }

        if (strNum.includes('.')) {
            let parts = strNum.split('.');
            strNum = parts[1] + '.' + parts[0];
        }

        return strNum;
    }).join('|');
}

module.exports = {processData};