module.exports = function compile(stmts) {
  let program = ''

  for (let stmt of stmts) {
    const [ type, ...rest ] = stmt

    if (type === 'expr') {
      program += compileExpression(rest[0]) + ';'
    }
  }

  return program
}

function compileExpression({ op, a, b, c }) {
  if (op === 'let') {
    const [ ident, expr ] = a

    return `var ${mkIdentifier(ident.value)} = ${compileExpression(expr)}`
  }

  if (op === 'varchange') {
    const [ ident, expr ] = a

    return `${mkIdentifier(ident.value)} = ${compileExpression(expr)}`
  }

  if (op === 'literal') {
    const { type, value } = a

    if (type === 'int') {
      return value
    }

    if (type === 'string') {
      return `"${value.replace(/"/g, '\\"')}"`
    }

    if (type === 'identifier') {
      return mkIdentifier(value)
    }

    throw 'unknown literal ' + type
  }

  if (op === 'funcall') {
    const [ ident, args ] = [ a, b ]

    // TODO make print an imported fn; builtins are B A D !
    let fun = ident.value === 'print'
      ? '$print' // neko builtin
      : mkIdentifier(ident.value)

    return `${fun}(${args.map(compileExpression).join(',')})`
  }

  if (op === '..' || op === '+') {
    return `(${compileExpression(a)} + ${compileExpression(b)})`
  }

  if (op === '-') {
    return `(${compileExpression(a)} - ${compileExpression(b)})`
  }

  if (op === '/') {
    return `(${compileExpression(a)} / ${compileExpression(b)})`
  }

  if (op === '*') {
    return `(${compileExpression(a)} * ${compileExpression(b)})`
  }

  if (op === '!') {
    return `$not(${compileExpression(a)})`
  }

  if (op === '&') {
    return `(${compileExpression(a)} && ${compileExpression(b)})`
  }

  if (op === '|') {
    return `(${compileExpression(a)} || ${compileExpression(b)})`
  }

  if (op === '==') {
    return `(${compileExpression(a)} == ${compileExpression(b)})`
  }

  if (op === 'if') {
    const [ condition, thenExpr, elseExpr ] = [ a, b, c ]
    return `if (${compileExpression(a)}) ${compileExpression(b)} else ${compileExpression(c)}`
  }

  throw 'unknown operator ' + op
}

function mkIdentifier(ident) {
  // ident -> [a-zA-Z_@] [a-zA-Z0-9_@]*
  let regex = /(^[^a-zA-Z_])|([^a-zA-Z_0-9])/g

  return ident.replace(regex, badChar =>
    '@' + badChar.charCodeAt(0) + '@')
}
