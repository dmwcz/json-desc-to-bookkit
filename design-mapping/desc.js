const findTag = require("../helpers/find-tag.js");
const UU5String = require("../uu5string/uu5-string");

function hardcoreReplace(data, name) {
  let sections = findTag(data, "UU5.Bricks.Code");
  sections.forEach(section => {
    section.children = [name]
  });
  return data
}

function handleStatics(body, name) {
  let sections = findTag([body], "UU5.Bricks.Code");
  sections.forEach(section => {
    section.children = [name]
  });


  if(!sections.length) {
    let sections = findTag([body], "UU5.RichText.Block");
    sections.forEach(section => {
      let dataProp = section.props.props.find(prop => prop.name === "uu5string");
      dataProp.value = hardcoreReplace(dataProp.value, name);
    });
  }
}

module.exports = handleStatics;