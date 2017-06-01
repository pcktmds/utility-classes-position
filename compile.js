'use strict';
// built-in node modules
const console = require('console');
const fs = require('fs');
const process = require('process');

// npm modules
const nodeSass = require('node-sass');

const srcDir = `${__dirname}/src/`;
const distDir = `${__dirname}/dist/`;
const pathToWriteFile = `${distDir}/utility-classes-position.css`;
renderSassPromisified({minify: false})
  .then(result => {
    return renderSassPromisified({minify: true});
  })
  .then(minifiedResult => {
    console.log('Sass compilation successful!');
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

function renderSassPromisified(opts) {
  return new Promise((resolve, reject) => {
    let {
      fileName = `${srcDir}index.scss`,
      sourceMap = false,
      minify = false
    } = opts;
    let outputStyle = minify ? 'compressed': 'compact';
    let outFilePath = pathToWriteFile;
    if (minify) {
      outFilePath = outFilePath.replace('.css', '.min.css');
    }
    nodeSass.render(
      {
        file: fileName,
        includePaths: [],
        outFile: outFilePath,
        sourceMap: sourceMap,
        outputStyle: outputStyle
      },
      (err, result) => {
        if (err) {
          throw err;
        }
        fs.writeFile(outFilePath, result.css, (writeErr) => {
          if (writeErr) {
            throw writeErr;
          }
          resolve(outFilePath);
        })
      }
    );
  });
}