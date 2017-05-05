const tokenise = require('./tokenise')
const parser = require('./parser')

module.exports = function parse(source) {
  let tokens = tokenise(source)
  //console.log(tokens)

  return parser(tokens)
}
