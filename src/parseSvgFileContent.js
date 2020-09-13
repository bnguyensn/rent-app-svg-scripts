module.exports = function parseSvgFileContent(content, componentName) {
  // This regex matches everything within an <svg> tag
  const SVG_CONTENT_REGEX = /^\s*(<(g|path|\/g|rect).*)/gm;

  const svgContentMatchResults = content.matchAll(SVG_CONTENT_REGEX);

  // This regex matches the id="xxx" attributes
  const ID_ATTR_REGEX = /(id)="\S+"/gm;

  // This regex matches the class="xxx" attributes
  const CLASS_ATTR_REGEX = /(class=)/gm;

  // Each element of this array should be a HTML tag string e.g. <g ...> that
  // can be put inside an <svg> tag.
  const svgContentTags = [];
  for (const match of svgContentMatchResults) {
    // Remove unwanted HTML attributes
    const postCleanse1 = match[1].replace(ID_ATTR_REGEX, '');

    // Replace normal HTML attributes their React version
    const postCleanse2 = postCleanse1.replace(CLASS_ATTR_REGEX, 'className=');

    svgContentTags.push(postCleanse2);
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
