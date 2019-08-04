const findTag = require("../helpers/find-tag.js");
const findLanguage = require("../helpers/find-language.js");

function describeShape(args) {
  return "<UU5.Bricks.Ul>" + props[key].args.map(arg => `<UU5.Bricks.Li><UU5.Bricks.Code>${arg}</UU5.Bricks.Code></UU5.Bricks.Li>`).join("") + "</UU5.Bricks.Ul>"
}

function buildForLanguage(ifc, lang) {
  let data = {};
  Object.keys(ifc).forEach(key => {
    let description = ifc[key].description[lang];

    data[key] = {
      description: `<uu5string/>${description}`,
      signature: `component.${key}(${Object.keys(ifc[key].params).join(", ")})`,
      returns: ifc[key].returnThis ? "component": "*"
    }
  });
  return data;
}

function handleInterface(body, ifc) {
  let sections = findTag(body, "UuApp.DesignKit.UU5ComponentInterface");

  sections.forEach(section => {
    // lookup language
    let lang = findLanguage(section);

    let dataProp = section.props.props.find(prop => prop.name === "data");
    if(dataProp) {
      dataProp.value = buildForLanguage(ifc, lang);
      // console.log(dataProp.value);
    }
  });
}

module.exports = handleInterface;