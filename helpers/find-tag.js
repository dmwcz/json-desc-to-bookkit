function findTag(children, tagName) {
  let tags = [];
  children && children.forEach(child => {
    if(typeof child === "object") {
      if(child.tag === tagName) {
        tags.push(child);
      } else {
        tags = tags.concat(findTag(child.children || child.content, tagName))
      }
    }
  });
  return tags;
}

module.exports = findTag