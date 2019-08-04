function findParent(el, tagName) {
  let pointer = el;
  while(pointer && pointer.parent) {
    if(pointer.tag === tagName) {
      return pointer;
    }
    pointer = pointer.parent;
  }
}

module.exports = findParent;