function toModuleName(module) {
  let parts = module.split("-").map(part => part[0].toUpperCase() + part.substr(1));
  return parts.join("");
}

module.exports = toModuleName;