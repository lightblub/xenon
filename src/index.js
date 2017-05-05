const parse = require('./parse')
const compile = require('./compile')
const fs = require('fs')
const exec = require('child_process').exec

let source = fs.readFileSync('hello.xe', 'utf8')
let ast = parse(source)

const inspect = obj => {
  console.log(require('util').inspect(obj, { depth: null, colors: true }))
  return obj
}

inspect(ast)

compile(ast)
  .then(console.log)
  .catch(console.error)
