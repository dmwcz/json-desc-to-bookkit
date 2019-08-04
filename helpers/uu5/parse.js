const UU5String = require("../../uu5string/uu5-string");

module.exports = function(body) {
  if(Array.isArray(body)) {
    body.forEach(item => item.content = UU5String.parse(item.content))
  } else {
    body.content = UU5String.parse(body.content)
  }
};