const util = require("util");
const fs = require("fs");

const fs_readfile = util.promisify(fs.readFile);

async function getFile(target) {
  let response = await fs_readfile(target, "utf-8");
  try {
    return JSON.parse(response);
  } catch (e) {
    debugger;
  }
}

module.exports = getFile;