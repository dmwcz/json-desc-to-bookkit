const path = require("path");

function moduleFromFile(file) {
  let dirname = path.dirname(file);
  return path.basename(dirname);
}

module.exports = moduleFromFile;