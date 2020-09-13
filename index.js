const path = require('path');
const fs = require('fs');
const parseSvgFileContent = require('./src/parseSvgFileContent');
const cleanseFileName = require('./src/cleanseFileName');

const baseInputPath = path.resolve(__dirname, './inputs');
const baseOutputPath = path.resolve(__dirname, './outputs');

function generateTsxIconFile(
  inputFilePath,
  outputFilePath,
  outputFileNameNoExt
) {
  const fileContent = fs.readFileSync(inputFilePath, { encoding: 'utf-8' });

  const parsedFileContent = parseSvgFileContent(
    fileContent,
    outputFileNameNoExt
  );

  fs.writeFileSync(outputFilePath, parsedFileContent, {
    encoding: 'utf-8',
  });

  console.log(`Successfully written ${outputFilePath}`);
}

function generateTsxIconFileLoop(
  baseInputPath,
  baseOutputPath,
  extendedPath = ''
) {
  const curInputPath = path.resolve(baseInputPath, extendedPath);
  const curOutputPath = path.resolve(baseOutputPath, extendedPath);

  const dirents = fs.readdirSync(curInputPath, {
    encoding: 'utf-8',
    withFileTypes: true,
  });

  for (const dirent of dirents) {
    const inputDirentPath = path.resolve(curInputPath, `./${dirent.name}`);
    const outputDirentPath = path.resolve(curOutputPath, `./${dirent.name}`);

    if (dirent.isDirectory()) {
      if (!fs.existsSync(outputDirentPath)) {
        fs.mkdirSync(outputDirentPath);
      }

      generateTsxIconFileLoop(
        baseInputPath,
        baseOutputPath,
        `./${dirent.name}`
      );
    } else {
      if (path.extname(dirent.name) === '.svg') {
        const outputFileNameNoExt = path.basename(inputDirentPath, '.svg');
        const outputFileNameNoExtCleansed = cleanseFileName(
          outputFileNameNoExt
        );

        const outputFilePath = path.resolve(
          curOutputPath,
          `./${outputFileNameNoExtCleansed}.tsx`
        );

        generateTsxIconFile(
          inputDirentPath,
          outputFilePath,
          outputFileNameNoExtCleansed
        );
      }
    }
  }
}

generateTsxIconFileLoop(baseInputPath, baseOutputPath);
console.log('Done ✌️');