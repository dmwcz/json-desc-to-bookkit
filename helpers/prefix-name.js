function prefix(name, module, glue = ".") {
  if(!name) return null;
  return [module, name].join(glue);
}

module.exports = prefix;