const {
  is, defFromId, resultingTypeOf, typeOfLiteral, unifyTypes, understandType,
} = require('../type/util')

module.exports = async function firstPass(tree) {
  let newTree = []
  let ctx = {} // TODO

  for (let stmt of tree) {
    let [ type, ...rest ] = stmt

    switch (type) {
      case 'proof': {
        throw new Error('todo')
      }

      case 'union': {
        throw new Error('todo')
      }

      case 'expr': {
        await enterExpression(rest[0], ctx)
      }
    }

    newTree.push(stmt)
  }

  return newTree
}

async function enterExpression({ op, a, b, c, line, col, resultingType }, ctx) {
  switch (op) {
    case 'let': {
      const [ ident, expr, type ] = a
      const value = await enterExpression(expr, ctx)

      if (type)
        var expectedType = understandType(type)

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
      let expr = await enterExpression(a, ctx)
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

    case 'if': {
      let condition = await enterExpression(a, ctx)

      if (!is(condition.resultingType, defFromId('std.Bool'))) {
        throw new TypeError(
          `If expression on line ${condition.line} is expecting the condition`
        + ` to be Bool, but it is ${condition.resultingType.name}`)
      }

      let resT = await enterExpression(b, ctx)
      let resF = await enterExpression(c, ctx)
      let resType = unifyTypes(resT.resultingType, resF.resultingType)

      return {
        op, a, b, c, line: condition.line, col: condition.col,
        resultingType: resType,
      }
    }

    default: {
      let exprA = await enterExpression(a, ctx)
      let exprTypeA = exprA.resultingType
      let exprB = await enterExpression(b, ctx)
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
