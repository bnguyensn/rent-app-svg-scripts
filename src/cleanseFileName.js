const numberToWordConverter = require('number-to-words');

function normalCaseToCamelCase(s) {
  return s
    .split(' ')
    .map((s) => `${s[0].toUpperCase()}${s.slice(1)}`)
    .join('');
}

function removeBadChars(str) {
  const REGEX = /[\W\d]/gm;

  return str.replace(REGEX, '');
}

function updateNumbersToWords(str) {
  const REGEX = /\d+/gm;

  return str.replace(REGEX, (match) =>
    numberToWordConverter.toWords(Number(match))
  );
}

module.exports = function cleanseFileName(fileName) {
  // const cleansed1 = updateNumbersToWords(fileName);

  const fileNameWithoutBadChars = removeBadChars(fileName);

  return normalCaseToCamelCase(fileNameWithoutBadChars);
};
