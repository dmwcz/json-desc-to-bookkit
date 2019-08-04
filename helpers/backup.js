const util = require("util");
const fs = require("fs");
const path = require("path");
const ensureDirectory = require("./ensure-directory.js");

const fs_writefile = util.promisify(fs.writeFile);

const NOW = new Date().toISOString().replace(/[:.]/g, '-');


module.exports = function(basePath) {
  return async function backup(pageData) {
    let dir = ensureDirectory(basePath, "backup", NOW);
    await fs_writefile(path.resolve(dir, `${pageData.code}.json`), JSON.stringify(pageData, null, 2));
  }
};