// Directly convert an ast to a .neko file
// assumes everything
module.exports = async function toNeko(ast) {
  let out = ''

  for (let stmt of ast) {
    const [ type, ...rest ] = stmt

    switch (type) {
      case 'expr': {
        out += expressionToNeko(rest[0])
        out += `;\n`
        break
      }

      default: {
        throw new TypeError(`Unknown statement type: ${type}`)
      }
    }
  }

  return out
}

function expressionToNeko({ op, a, b, c }) {
  switch (op) {
    case 'let': {
      const [ ident, expr ] = a
      return `var ${identifierToNeko(ident.value)} = ${expressionToNeko(expr)}`
    }

    case 'u-': {
      return `-${expressionToNeko(a)}`
    }

    case '+': {
      return `${expressionToNeko(a)} + ${expressionToNeko(b)}`
    }

    case '-': {
      return `${expressionToNeko(a)} - ${expressionToNeko(b)}`
    }

    case '*': {
      return `${expressionToNeko(a)} * ${expressionToNeko(b)}`
    }

    case '/': {
      return `${expressionToNeko(a)} / ${expressionToNeko(b)}`
    }

    case 'literal': {
      return literalToNeko(a)
    }

    default: {
      throw new TypeError(`Unknown expression operator: ${op}`)
    }
  }
}

function identifierToNeko(ident) {
  let regex = /(^[^a-zA-Z_])|([^a-zA-Z_0-9])/g

  return ident.replace(regex, badChar =>
    '@' + badChar.charCodeAt(0) + '@')
}

function literalToNeko({ type, value }) {
  switch (type) {
    case 'int': {
      return value
    }

    case 'string': {
      return `"${value.replace(/"/g, '\\"')}"`
    }

    default: {
      throw new TypeError(`Unknown literal type: ${type}`)
    }
  }
}
