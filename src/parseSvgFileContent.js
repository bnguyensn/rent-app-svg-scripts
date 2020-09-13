module.exports = function parseSvgFileContent(content, componentName) {
  // This regex matches everything within an <svg> tag
  const SVG_CONTENT_REGEX = /^\s*(<(g|path|\/g).*)/gm;

  // This regex matches the class="xxx" and id="xxx" attributes
  const CLASS_AND_ID_ATTR_REGEX = /(class|id)="\S+"/gm;

  const svgContentMatchResults = content.matchAll(SVG_CONTENT_REGEX);

  const svgContentTags = [];
  for (const match of svgContentMatchResults) {
    const withoutClassAndId = match[1].replace(CLASS_AND_ID_ATTR_REGEX, '');

    svgContentTags.push(withoutClassAndId);
  }

  const svgContent = svgContentTags.join('\n');

  // This regex matches the viewBox="xxx" attribute
  const VIEWBOX_ATTR_REGEX = /viewBox="((\d|\s|\.)*)"/;

  const viewBox = content.match(VIEWBOX_ATTR_REGEX)[1];

  // Concatenate everything to get the final file content

  const resultFileContent = [
    `import React from 'react';`,
    `import { SvgIcon, SvgIconProps } from '@material-ui/core';`,
    `export default function ${componentName}(props: SvgIconProps) {`,
    `return (<SvgIcon viewBox="${viewBox}" {...props}>${svgContent}</SvgIcon>`,
    `);}`,
  ];

  return resultFileContent.join('\n');
};
