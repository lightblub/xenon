const {
  is, defFromId, resultingTypeOf, typeOfLiteral,
} = require('../type/util')

module.exports = async function firstPass(tree) {
  let newTree = []

  for (let stmt of tree) {
    if (stmt[0] === 'expr') {
      let expr = await enterExpression(stmt[1])
      newTree.push([ 'expr', expr ])
    } else {
      newTree.push(stmt)
    }
  }

  return newTree
}

async function enterExpression({ op, a, b, c, line, col, resultingType }) {
  switch (op) {
    case 'let': { 
      const [ ident, expr, type ] = a
      const value = await enterExpression(expr)

      if (type)
        var expectedType = defFromId('std.' + type.value) // TODO

      let resultingType = value.resultingType

      if (type && !is(resultingType, expectedType)) {
        throw new TypeError(
          `Expected value on line ${value.line} to be ${expectedType.name}, but`
        + ` it is ${resultingType.name}`)
      }

      return { op, a, line: value.line, col: value.col, resultingType }
    }

    case 'literal': {
      let resultingType = typeOfLiteral(a)

      return { op, a, line: a.line, col: a.col, resultingType }
    }

    case 'u-': {
      let expr = await enterExpression(a)
      let exprType = expr.resultingType

      if (!is(exprType, defFromId('std.Num'))) {
        throw new TypeError(
          `Unary operator - on line ${expr.line} is expecting its`
        + ` argument to be Num, but it is ${exprType.name}`)
      }

      try {
        return {
          op, a, line: expr.line, col: expr.col,
          resultingType: resultingTypeOf(op, exprType),
        }
      } catch (e) {
        throw new TypeError(e + ` on line ${expr.line}`)
      }
    }

    default: {
      let exprA = await enterExpression(a)
      let exprTypeA = exprA.resultingType
      let exprB = await enterExpression(b)
      let exprTypeB = exprB.resultingType

      if (!is(exprTypeA, exprTypeB)) {
        throw new TypeError(
          `Operator ${op} on line ${exprA.line} is expecting both sides to be `
        + `the same type, but the left-hand-side is ${exprTypeA.name} and the `
        + `right-hand-side is ${exprTypeB.name}`)
      }

      try {
        return {
          op, a, line: exprA.line, col: exprA.col,
          resultingType: resultingTypeOf(op, exprTypeA),
        }
      } catch (e) {
        throw new TypeError(e + ` on line ${exprA.line}`)
      }

      //throw new TypeError(`Unknown expression operator: ${op}`)
    }
  }
}
