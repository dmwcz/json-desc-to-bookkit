const findTag = require("../helpers/find-tag.js");
const findLanguage = require("../helpers/find-language.js");

function toModuleName(module) {
  let parts = module.split("-").map(part => part[0].toUpperCase() + part.substr(1));
  return parts.join("");
}

function prefix(file, module) {
  if(!file) return null;
  return [module, file].join("/");
}

function buildForLanguage(cmpData, lang, originalValue, metaData) {
  // full component name
  let fullName = [metaData.appName, toModuleName(metaData.module), cmpData.name].join(".");

  return [
    originalValue[0], // UVE name
    cmpData.description[lang] || originalValue[1], // description
    originalValue[2], // address
    originalValue[3], // html file
    fullName, // name
    prefix(cmpData.file, metaData.module), // js file
    prefix(cmpData.lessFile, metaData.module) // less file
  ];
}

function handleInfo(body, cmpData, metaData) {
  let sections = findTag(body, "UuApp.DesignKit.UU5UveInfo");

  sections.forEach(section => {
    // lookup language
    let lang = findLanguage(section);

    let dataProp = section.props.props.find(prop => prop.name === "data");
    if(dataProp) {
      dataProp.value = buildForLanguage(cmpData, lang, dataProp.value, metaData);
    }
  });
}

module.exports = handleInfo;