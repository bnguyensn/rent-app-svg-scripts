function normalCaseToCamelCase(s) {
  return s
    .split(' ')
    .map((s) => `${s[0].toUpperCase()}${s.slice(1)}`)
    .join('');
}

module.exports = function cleanseFileName(fileName) {
  const NUMBER_REGEX = /\d/;

  const fileNameWithoutNumbers = fileName.replace(NUMBER_REGEX, '');

  const DASH_REGEX = /-\s*(.+)/;

  const dashRegexMatch = fileNameWithoutNumbers.match(DASH_REGEX);

  const fileNameAfterDashRegex = dashRegexMatch ? dashRegexMatch[1] : fileName;

  return normalCaseToCamelCase(fileNameAfterDashRegex);
};
