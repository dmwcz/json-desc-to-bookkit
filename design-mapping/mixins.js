const findTag = require("../helpers/find-tag.js");
const uu5bookKit = "https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-ed11ec379073476db0aa295ad6c00178/book/page?code=";

function mixinCode(mixin) {
  let parts = mixin.split(".");
  parts[0] = parts[0].toLowerCase();
  return parts.join("");
}

function handleMixins(body, mixins) {
  let sections = findTag(body, "UuApp.DesignKit.UU5ComponentMixins");
  // build mixin data
  let data = mixins.map(mixin => {
    return [
      uu5bookKit+mixinCode(mixin),
      mixin
    ]
  });
  sections.forEach(section => {
    let dataProp = section.props.props.find(prop => prop.name === "data");
    if(dataProp) {
      dataProp.value = data;
    }
  });
  sections = findTag(body, "UuApp.DesignKit.UU5ComponentMixins");
}

module.exports = handleMixins;