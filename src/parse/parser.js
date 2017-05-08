/* Utility methods */

let tokens = []
let tokenIndex = 0

function reset(tokenArray) {
  tokenIndex = 0
  tokens = tokenArray
}

function consume() {
  tokenIndex++
  return tokens[tokenIndex - 1] || { type: 'EOF' }
}

function next() {
  return tokens[tokenIndex] || { type: 'EOF' }
}

function past() {
  return tokens[tokenIndex - 1] || { type: 'SOF' }
}

function peek() {
  return tokens[tokenIndex + 1] || { type: 'EOF' }
}

function left() {
  return tokens.slice(tokenIndex).length
}

function error(msg) {
  throw msg + (past().line ? ` on line ${past().line}:${past().col}` : '')
}

function expect(tok) {
  if (next().type === tok)
    return consume()
  else
    error(`Unexpected token ${consume().type}, expected ${tok}`)
}

function expectMany(...toks) {
  for (let tok of toks) {
    if (next().type === tok)
      return consume()
  }

  error(`Unexpected token ${consume().type}, expected ${toks.join(', ')}`)
}

function accept(tok) {
  if (next().type === tok)
    return consume()
  else
    return false
}

// Recursive descent parser:

// program -> statement { newline statement }
//          | EOF
function program() {
  if (accept('EOF'))
    return []

  let stmts = [ statement() ]

  while (accept('newline')) {
    while (accept('newline')) ;

    let stmt = statement()
    if (stmt) stmts.push(stmt)
  }

  if (left() > 0)
    error(`Unexpected token ${consume().type}, expected EOF`)

  return stmts
}

// statement -> expression
//            | { newline }
//            | "proof" functionDeclaration
//            | "union" identifier { nl } "=" { nl } type
//            | "fun" functionDeclaration
//            | "import" identifier [ "as" identifier ]
//            | "use" identifier [ "as" identifier ]
function statement() {
  if (accept('proof')) {
    return [ 'proof', functionDeclaration() ]
  } else if (accept('union')) {
    let i = expect('identifier')
    while (accept('newline')) ;
    expect('=')
    while (accept('newline')) ;
    let t = type()
    return [ 'union', i, t ]
  } else if (accept('import')) {
    let what = expect('identifier')
    return accept('as')
      ? [ 'import', what, expect('identifier') ]
      : [ 'import', what ]
  } else if (accept('use')) {
    let what = expect('identifier')
    return accept('as')
      ? [ 'use', what, expect('identifier') ]
      : [ 'use', what ]
  } else if (accept('fun')) {
    return [ 'fun', functionDeclaration() ]
  } else if (accept('newline') || accept('EOF')) {
    while (accept('newline')) ;
    return null
  } else {
    return [ 'expr', expression() ]
  }
}

// variableDeclaration -> identifier [ ":" type ] initialiser
function variableDeclaration() {
  let ident = expect('identifier')
  let t = accept(':')
    ? type()
    : undefined

  return [ ident, initialiser(), t ]
}

// functionDeclaration -> identifier "(" { newline } argumentList { newline } ")" initialiser
function functionDeclaration() {
  let ident = expect('identifier')

  expect('(')
  let args = argumentList()
  expect(')')

  return [ ident, args, initialiser() ]
}

// argumentList -> identifier [ ":" type ] { "," { newline } identifier [ ":" type ] } [ "," ]
//               | <null>
function argumentList() {
  let args = [], ident

  if (ident = accept('identifier')) {
    let guard = accept(':') ? type() : null
    args.push({ ident, guard })

    while (accept(',')) {
      while (accept('newline')) ;

      let ident = expect('identifier')
      let guard = accept(':') ? type() : null
      args.push({ ident, guard })
    }

    accept(',')
    return args
  } else {
    return []
  }
}

// valueList -> expression { "," { newline } expression } [ "," ]
//            | <null>
function valueList() {
  let args = [], ident

  if (next().type === ')')
    return []

  args.push(expression())

  while (accept(',')) {
    while (accept('newline')) ;

    args.push(expression())
  }

  accept(',')
  return args
}

// initialiser -> "=" { newline } expression
function initialiser() {
  expect('=')
  while (accept('newline')) ;
  return expression()
}

// expression -> [ "!" ] [ andor ] term1 { andor { newline } term1 }
//             | "let" variableDeclaration
//             | variableDeclaration
//             | "if" expression { newline } "then" { newline } expression
//               { newline } "else" { newline } expression
function expression() {
  if (accept('let')) return { op: 'let', a: variableDeclaration() }
  if (peek().type === '=' && next().type === 'identifier') {
    return { op: 'varchange', a: variableDeclaration() }
  }

  if (accept('if')) {
    let a = expression()
    while (accept('newline')) ;
    expect('then')
    while (accept('newline')) ;
    let b = expression()
    while (accept('newline')) ;
    expect('else')
    while (accept('newline')) ;
    let c = expression()
    return { op: 'if', a, b, c }
  }

  let notted = accept('!')
  // TODO bit not (~)

  let negated = false
  if (!accept('+'))
    negated = accept('-')

  function r() {
    let f = term1(), op

    if (op = accept('&') || accept('|') || accept('^')) {
      while (accept('newline')) ;

      let t = {}

      t.op = op.type
      t.a = f
      t.b = r()

      return t
    } else {
      return f
    }
  }

  let R = notted ? { op: '!', a: r() } : r()

  if (negated) {
    return { op: 'u-', a: R }
  } else {
    return R
  }
}

// term1 -> term2 { gtlteq { newline } term2 }
function term1() {
  function r() {
    let f = term2(), op

    if (op = gtlteq()) {
      while (accept('newline')) ;
      
      let t = {}

      t.op = op
      t.a = f
      t.b = r()

      return t
    } else {
      return f
    }
  }

  return r()
}

// term2 -> factor { addsub { newline } factor }
function term2() {
  function r() {
    let f = factor(), op

    if (op = accept('+') || accept('-') || accept('>>>')) {
      while (accept('newline')) ;
      
      let t = {}

      t.op = op.type
      t.a = f
      t.b = r()

      return t
    } else {
      return f
    }
  }

  return r()
}

// factor -> factor2 { { newline } muldiv { newline } factor2 }
function factor() {
  function r() {
    let f = factor2(), op

    let i = tokenIndex
    while (accept('newline')) ;
    if (op = accept('*') || accept('/') || accept('>>') || accept('<<')) {
      while (accept('newline')) ;
      
      let t = {}

      t.op = op.type
      t.a = f
      t.b = r()

      return t
    } else {
      tokenIndex = i
      return f
    }
  }

  return r()
}

// factor2 -> factor3 [ "is" type ]
function factor2() {
  let val = factor3()
  return accept('is')
    ? { op: 'is', a: val, b: type() }
    : val
}

// type -> identifier
//       | identifier "|" type
function type() {
  if (peek().type === '|') {
    // identifier "|" type
    let r = [ 'union', expect('identifier') ]
    expect('|')
    r.push(type())
    return r
  } else {
    return expect('identifier')
  }
}

// factor3 -> value # { gtlteq { newline } value }
function factor3() {
  return value()

  /*
  function r() {
    let f = value(), op

    if (op = isGtlteq()) {
      while (accept('newline')) ;
      
      let t = {}

      t.op = op
      t.a = f
      t.b = r()

      return t
    } else {
      return f
    }
  }

  return r()
  */
}

// gtlteq -> ==
//         | !=
//         | >
//         | <
//         | >=
//         | <=
function gtlteq() {
  if (accept('=')) {
    expect('=')
    return '=='
  }

  if (accept('!')) {
    expect('=')
    return '!='
  }

  if (accept('>')) {
    return accept('=') ? '>=' : '>'
  }

  if (accept('<')) {
    return accept('=') ? '<=' : '<'
  }

  //error(`Unexpected token ${consume().type}`)
  return false
}

// value -> identifier
//        | string
//        | int
//        | cast expression
//        | "(" { newline } expression { newline } ")"
//        | identifier "(" { newline } valueList { newline } ")"
function value() {
  let n

  if (n = accept('identifier')) {
    if (accept('(')) {
      // function call
      while (accept('newline')) ;
      let args = valueList()
      while (accept('newline')) ;
      expect(')')
      return { op: 'funcall', a: n, b: args }
    } else return { op: 'literal', a: n }
  }

  if (n = accept('int') || accept('string')) {
    return { op: 'literal', a: n }
  }

  if (accept('cast')) {
    let e = expression()
    return [ 'cast', e ]
  }

  if (accept('(')) {
    while (accept('newline')) ;
    let e = expression()
    while (accept('newline')) ;
    expect(')')
    return e
  }

  error(`Unexpected token ${consume().type}, expected int, string, identifier, (`)
}

module.exports = function(tokens) {
  reset(tokens)
  return program()
}
