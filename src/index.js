const parse = require('./parse')

let source = require('fs').readFileSync('hello.xe', 'utf8')
let ast = parse(source)

console.log(require('util').inspect(ast, { depth: null, colors: true }))
