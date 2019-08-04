const findTag = require("../helpers/find-tag.js");
const findLanguage = require("../helpers/find-language.js");
const asyncForEach = require("../helpers/async-foreach.js");
const getFile = require("../helpers/get-file.js");
const moduleFromFile = require("../helpers/file-module.js");
const toModuleName = require("../helpers/to-module-name.js");
const prefix = require("../helpers/prefix-name.js");
const path = require("path");
const fs = require("fs");

async function buildForLanguage(cmpData, lang, originalValue, baseFile) {
  let components = [];
  let files = Object.keys(cmpData);
  await asyncForEach(files, async (file) => {
    let filePath = path.resolve(baseFile, path.dirname(file), path.basename(file, ".js")+".json");
    if (!fs.existsSync(filePath)) return;

    let fileData = await getFile(filePath);

    let module = toModuleName(moduleFromFile(filePath));

    components.push([
      [
        fileData.pageCode,
        prefix(fileData.name, module)
      ],
      fileData.description[lang]
    ])
  });

  return components;
}

async function handleCmps(body, cmpData, baseFile, basePath) {
  let sections = findTag(body, "UuApp.DesignKit.UU5ComponentList");

  await asyncForEach(sections, async (section) => {
    // lookup language
    let lang = findLanguage(section);

    let dataProp = section.props.props.find(prop => prop.name === "data");
    if(dataProp) {
      dataProp.value = await buildForLanguage(cmpData, lang, dataProp.value, path.dirname(baseFile), basePath);
    }
  });
}

module.exports = handleCmps;