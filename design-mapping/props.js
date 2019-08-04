const findTag = require("../helpers/find-tag.js");
const findLanguage = require("../helpers/find-language.js");

function describeShape(args, lang) {
  let items = Object.keys(args).map(arg => {
    let desc;
    let item = args[arg];
    if(item && item.description) {
      desc = ` - ${item.description[lang]}`
    }

    return `<UU5.Bricks.Li><UU5.Bricks.Code>${arg}</UU5.Bricks.Code>${desc}</UU5.Bricks.Li>`
  });


  return "<UU5.Bricks.Ul>" + items.join("") + "</UU5.Bricks.Ul>"
}

function buildForLanguage(props, lang) {
  let data = [];
  Object.keys(props).forEach(key => {
    let description = props[key].description[lang];
    if((props[key].type === "shape") && props[key].args) {
      description = description + describeShape(props[key].args, lang);
    }

    data.push([key, props[key].type, props[key].value || null, `<uu5string/>${description}`])
  });
  return data;
}

function handleProps(body, props) {
  let sections = findTag(body, "UuApp.DesignKit.UU5ComponentProps");

  sections.forEach(section => {
    // lookup language
    let lang = findLanguage(section);

    let dataProp = section.props.props.find(prop => prop.name === "data");
    if(dataProp) {
      dataProp.value = buildForLanguage(props, lang);
    }
  });
}

module.exports = handleProps;