let fs = require('fs');
let path = require('path');

function ensureDirectory(root_dir, ...nesting) {
  let directory = root_dir;
  nesting.forEach(dir => {
    directory = path.resolve(directory, dir);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }
  });

  return directory;
}

module.exports = ensureDirectory;