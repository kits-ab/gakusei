const replace = require('replace');
const xml2js = require('xml2js');
const fs = require('fs');

const pomXmlText = fs.readFileSync('./pom.xml', 'utf8');

function doReplace(newVersion) {
  replace({
    regex: /"version": "\d.\d.\d"/,
    replacement: `"version": "${newVersion}"`,
    paths: ['package.json'],
    recursive: true,
    silent: true
  });

  replace({
    regex: /gakusei-\d.\d.\d\.jar/g,
    replacement: `gakusei-${newVersion}.jar`,
    paths: ['.travis.yml'],
    recursive: true,
    silent: true
  });
}

xml2js.parseString(pomXmlText, (err, pomJson) => {
  if (err) {
    throw err;
  } else {
    doReplace(pomJson.project.version);
  }
});
