const parse = require('./parse')
const compile = require('./compile')
const fs = require('fs')
const exec = require('child_process').exec

let source = fs.readFileSync('hello.xe', 'utf8')
let ast = parse(source)

console.log(require('util').inspect(ast, { depth: null, colors: true }))

let neko = compile(ast)
fs.writeFileSync('hello.neko', neko, 'utf8')
exec('nekoc hello.neko', (err, stdout, stderr) => {
  /*if (!stderr) fs.unlinkSync('hello.neko')
  else throw stderr*/
})
