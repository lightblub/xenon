const fs = require('fs')

const inspect = obj => {
  console.log(require('util').inspect(obj, { depth: null, colors: true }))
  return obj
}

module.exports = function compile(program) {
  const firstPass = require('./first-pass')
  const toNeko = require('./to-neko')

  return Promise.resolve(program)
    .then(firstPass) // does type checking and inference
    .then(inspect)
    .then(toNeko)
}
