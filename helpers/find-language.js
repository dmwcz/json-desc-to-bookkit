const findParent = require("./find-parent.js");

function findLanguage(el) {
  let lsi = findParent(el, "UU5.Bricks.Lsi.Item");
  if(lsi && lsi.props && lsi.props.toObject)
    return lsi.props.toObject().language;
  return "en"; // default language
}

module.exports = findLanguage;