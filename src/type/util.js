const std = require('./std')

function is(a, b) {
  if (a.id === b.id) return true

  if (a.type !== std.TYPE) throw `${a.id} not a type`

  if (b.type === std.TYPE) {
    if (b.final) return false // final types cannot have subtypes

    for (let type of (a.extends || [])) {
      if (is(b, defFromId(type)))
        return true
    }

    return false
  }

  if (b.type === std.INTERFACE) {
    // does a implement the same ops as b?
    for (const op in b.ops) {
      const typeA = defFromId(a.ops[op])
      const typeB = defFromId(b.ops[op])
      
      if (!typeA) return false
      if (!is(typeA, typeB)) return false
    }

    // does a support the same casts as b?
    for (const cast in (b.casts.concat(b.castsMayThrow))) {
      if (!a.casts[cast] && !a.castsMayThrow[cast]) return false
    }

    // TODO implements methods

    return true
  }

  if (b.type === std.UNION) {
    for (let type of b.of) {
      if (is(a, defFromId(type)))
        return true
    }

    return false
  }
  
  throw '???'
}

function defFromId(id) {
  // XXX TODOs
  return std[id.substr(4)]
}

function resultingTypeOf(op, type) {
  let res = type.ops[op]

  if (!res)
    throw `Type ${type.name} does not support operator ${op}`

  return defFromId(res)
}

function typeOfLiteral({ type }) {
  switch (type) {
    case 'int':    return defFromId(`std.Int`)
    case 'string': return defFromId(`std.Str`)

    default: throw new TypeError(`Unknown literal type: ${type}`)
  }
}

module.exports = {
  is, defFromId, resultingTypeOf, typeOfLiteral,
}
