const TYPE = Symbol('type')
const INTERFACE = Symbol('interface')
const UNION = Symbol('union')

const Bool = {
  name: 'Bool',
  id: 'std.Bool',
  type: TYPE,
  ops: {
    '&':  'std.Bool',
    '|':  'std.Bool',
    '!':  'std.Bool',
    '==': 'std.Bool',
  },
  extends: [],
  casts: [],
  castsMayThrow: [],
}

const Int = {
  name: 'Int',
  id: 'std.Int',
  type: TYPE,
  ops: {
    // comparison
    '>':  'std.Bool',
    '<':  'std.Bool',
    '>=': 'std.Bool',
    '<=': 'std.Bool',
    '==': 'std.Bool',
    // math
    '+':  'std.Int',
    '-':  'std.Int',
    '/':  'std.Float',
    '*':  'std.Int',
    'u-': 'std.Int',
    // bitwise
    '&':   'std.Int',
    '|':   'std.Int',
    '^':   'std.Int',
    '~':   'std.Int',
    '<<':  'std.Int',
    '>>':  'std.Int',
    '>>>': 'std.Int',
  },
  extends: [],
  casts: [ 'std.Str', 'std.Float' ],
  castsMayThrow: [],
}

const Float = {
  name: 'Float',
  id: 'std.Float',
  type: TYPE,
  ops: {
    // comparison
    '>':  'std.Bool',
    '<':  'std.Bool',
    '>=': 'std.Bool',
    '<=': 'std.Bool',
    '==': 'std.Bool',
    // math
    '+':  'std.Float',
    '-':  'std.Float',
    '/':  'std.Float',
    '*':  'std.Float',
    'u-': 'std.Float',
  },
  extends: [],
  casts: [ 'std.Str', 'std.Int' ],
  castsMayThrow: [],
}

const Num = {
  name: 'Num',
  id: 'std.Num',
  type: UNION,
  of: [ 'std.Int', 'std.Float' ],
}

const Str = {
  name: 'Str',
  id: 'std.Str',
  type: TYPE,
  ops: {
    '+': 'std.Str',
  },
  extends: [],
  casts: [],
  castsMayThrow: [ 'std.Num' ],
}

const Comparable = {
  name: 'Comparable',
  type: INTERFACE,
  ops: {
    '>':  'std.Bool',
    '<':  'std.Bool',
    '>=': 'std.Bool',
    '<=': 'std.Bool',
    '==': 'std.Bool',
  },
  casts: [],
  castsMayThrow: [],
}

module.exports = {
  TYPE, INTERFACE, UNION,
  Bool, Str, Int, Float,
  Comparable,
  Num,

  types: [ Bool, Str, Int, Float ],
  interfaces: [ Comparable ],
  unions: [ Num ],
}
