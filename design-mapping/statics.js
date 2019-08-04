const findTag = require("../helpers/find-tag.js");

function indent(times) {
  return "  ".repeat(times);
}

function indentFix(data, indentBy = 0) {
  let lines = data.split("\n").map(line => {
    if(line.indexOf("}") >= 0) indentBy--;
    line = indent(indentBy) + line.trim();
    if(line.indexOf("{") >= 0) indentBy++; // indent next line
    return line;
  });

  return lines.join("\n");
}

function handleStatics(body, statics) {
  let sections = findTag(body, "UuApp.DesignKit.EmbeddedText");

  sections.forEach(section => {
    section.children = [indentFix(statics)]
  });
}

module.exports = handleStatics;