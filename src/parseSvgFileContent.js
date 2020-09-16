const fs = require('fs');
const path = require('path');

// This regex matches everything within an <svg> tag
const SVG_CONTENT_REGEX = /<(path|d\s|g|circle|rect|\/g)[^>]*>/gm;

// This regex matches the id="xxx" attributes
const ID_ATTR_REGEX = /(id)="\S+"/gm;

// This regex matches the class="xxx" attributes
const CLASS_ATTR_REGEX = /(class)="\S+"/gm;

// This regex matches the "class=" text bit
const CLASS_ATTR_NAME_ONLY_REGEX = /(class=)/gm;

const LINE_BREAK_REGEX = /(\r\n|\n|\r)/gm;

function removeId(str) {
  return str.replace(ID_ATTR_REGEX, '');
}

function removeClass(str) {
  return str.replace(CLASS_ATTR_REGEX, '');
}

function updateClassToClassName(str) {
  return str.replace(CLASS_ATTR_NAME_ONLY_REGEX, 'className=');
}

function removeLineBreaks(str) {
  return str.replace(LINE_BREAK_REGEX, '');
}

function changeStyleFill(str) {
  const STYLE_ATTR_REGEX = /(style="(\S+)")/gm;

  const matches = str.matchAll(STYLE_ATTR_REGEX);

  let newStr = str;
  for (const match of matches) {
    newStr.replace(match[2], 'fill:#616161');
  }

  return newStr;
}

module.exports = function parseSvgFileContent(content, componentName) {
  const contentNoNewLine = removeLineBreaks(content);

  fs.writeFileSync(path.resolve(__dirname, 'test.svg'), contentNoNewLine, {
    encoding: 'utf-8',
  });

  const svgContentMatchResults = contentNoNewLine.matchAll(SVG_CONTENT_REGEX);

  // Each element of this array should be a HTML tag string e.g. <g ...> that
  // can be put inside an <svg> tag.
  const svgContentTags = [];
  for (const match of svgContentMatchResults) {
    const cleanseFns = [removeId];

    const finalStr = cleanseFns.reduce((str, cleanseFn) => {
      return cleanseFn(str);
    }, match[0]);

    svgContentTags.push(finalStr);
  }

  const svgContentString = svgContentTags.join('\n');

  // This regex matches the viewBox="xxx" attribute
  const VIEWBOX_ATTR_REGEX = /viewBox="((\d|\s|\.)*)"/;

  const viewBox = content.match(VIEWBOX_ATTR_REGEX)[1];

  // Concatenate everything to get the final file content

  const resultFileContent = [
    `import React from 'react';`,
    `import { SvgIcon, SvgIconProps } from '@material-ui/core';`,
    `export default function ${componentName}(props: SvgIconProps) {`,
    `return (<SvgIcon viewBox="${viewBox}" {...props}>${svgContentString}</SvgIcon>`,
    `);}`,
  ];

  return resultFileContent.join('\n');
};
