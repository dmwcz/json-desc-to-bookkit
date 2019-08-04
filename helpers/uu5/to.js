module.exports = function(body) {
  if(Array.isArray(body)) {
    body.forEach(item => item.content = `<uu5string/>${item.content.map(content => content.toString()).join("")}`)
  } else {
    body.content = `<uu5string/>${(body.content || [body.content]).map(content => content.toString()).join("")}`
  }
}
