const std = require('./std')

function compareAlpha(a, b) {
  if (a < b) return -1
  if (a > b) return 1
  return 0
}

function arrayIncludesType(arr, t) {
  let i = arr.length
  while (i--) {
    if (is(arr[i], t))
      return true
  }

  return false
}

function is(a, b) {
  if (a.id === b.id) return true

  if (a.type === std.UNION && b.type === std.UNION) {
    return b.of.every(t => {
      return arrayIncludesType(a.of, t)
    })
  }

  if (a.type !== std.TYPE) throw new TypeError(`??? ${a.id} not a type`)

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
    return arrayIncludesType(b.of, a)
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

function typeOfLiteral({ type, value }) {
  const ctx = {
    // TODO actually pass this in (scope)
    true:  { typeDef: defFromId('std.Bool') },
    false: { typeDef: defFromId('std.Bool') },
  }

  switch (type) {
    case 'int':        return defFromId(`std.Int`)
    case 'string':     return defFromId(`std.Str`)
    case 'identifier': return ctx[value].typeDef

    default: throw new TypeError(`Unknown literal type: ${type}`)
  }
}

function unique(types) {
  let res = []

  for (let t = 0; t < types.length; t++) {
    let isUnique = true

    for (let j = t + 1; j < types.length; j++) {
      isUnique = !is(types[t], types[j])
      if (!isUnique) break
    }

    if (isUnique) res.push(types[t])
  }

  return res
}

function nameUnion(types) {
  types = types.sort((a, b) => compareAlpha(a.id, b.id))

  /*
  if (types[0].id === 'std.Float' && types[1].id === 'std.Int')
    return 'Num'
  */

  return types.map(t => t.name).join(' | ')
}

function flatten(types) {
  function simplify(t) {
    if (t.type === std.UNION)
      return t.of
    else
      return [ t ]
  }

  let s = types.map(simplify)

  return s.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b, []))
}

function unifyTypes(...types) {
  let typesUnique = unique(flatten(types))

  if (typesUnique.length === 1)
    return types[0]

  let names = typesUnique.map(t => t.name)
  let ids = typesUnique.map(t => t.id)

  return {
    name: nameUnion(typesUnique),
    id: ids.join('|'),
    type: std.UNION,
    of: typesUnique,
  }
}

function understandType(t) {
  if (t instanceof Array) {
    const [ op, a, b ] = t

    if (op === 'union') {
      return unifyTypes(understandType(a), understandType(b))
    }

    throw new TypeError('unknown typeop ' + op)
  } else {
    return defFromId('std.' + t.value) // TODO?
  }
}

module.exports = {
  is, defFromId, resultingTypeOf, typeOfLiteral, unifyTypes, understandType,
}
