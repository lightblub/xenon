const parse = require('./parse')
const compile = require('./compile')
const fs = require('mz/fs')
const exec = require('mz/child_process').exec

const inspect = obj => {
  console.log(require('util').inspect(obj, { depth: null, colors: true }))
  return obj
}

fs.readFile('hello.xe', 'utf8')
  .then(parse)
  //.then(inspect)
  .then(compile)
  .then(neko => fs.writeFile('hello.n', neko))
  .then(() => exec(`nekoc hello.n`))
