const validIdentifierCharacters = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_.`.split('')
const ops = '= ! & | > < : .. ,'.split(' ')
const keywords = [ 'if', 'then', 'else', 'let', 'is', 'proof', 'import', 'as' ].concat(ops)

module.exports = function tokenise(source) {
  let tokens = []
  let flags = { string: false, disableNL: false, number: false }
  let buf = ''
  let line = 1, col = 1

  for (let char of source) {
    col++

    if (flags.string) {
      if (char === '\n') {
        line++
        col = 1
      }

      if (char === flags.string) {
        // end of string literal
        tokens.push({
          type: 'string',
          value: buf,
          line, col,
        })

        buf = ''
        flags.string = false
        continue
      }
    } else {
      if (flags.number) {
        // TODO ints

        if (isDigit(char)) {
          buf += char
          continue
        } else {
          // end of number literal
          tokens.push({
            type: 'int',
            value: buf,
            line, col,
          })

          buf = ''
          flags.number = false
        }
      }

      if ((!validIdentifierCharacters.includes(char) || (buf.length > 0 && isDigit(char))) && buf.length > 0) {
        if (keywords.includes(buf)) {
          tokens.push({
            type: buf,
            line, col,
          })
        } else if (isValidIdentifier(buf)) {
          tokens.push({
            type: 'identifier',
            value: buf,
            line, col,
          })
        } else {
          throw `Invalid identifier "${buf}" on line ${line} column ${col}`
        }

        buf = ''
      }

      if (char === ' ' || char === '\t') {
        // ignore whitespace
        continue
      }

      if (char === '\n') {
        tokens.push({
          type: 'newline',
          line, col,
        })

        line++
        col = 1
        flags.comment = false
        continue
      }

      if (char === '#')
        flags.comment = true

      if (flags.comment) continue
      if (isDigit(char)) {
        flags.number = true
        buf = char
        continue
      }

      if (char === '"' || char === "'") {
        // start of a string
        flags.string = char
        continue
      }

      if (char === '(') {
        tokens.push({
          type: '(',
          line, col,
        })
        continue
      }

      if (char === ')') {
        tokens.push({
          type: ')',
          line, col,
        })
        continue
      }

      if (char === '+') {
        tokens.push({
          type: '+',
          line, col,
        })
        continue
      }

      if (char === '-') {
        tokens.push({
          type: '-',
          line, col,
        })
        continue
      }

      if (char === '*') {
        tokens.push({
          type: '*',
          line, col,
        })
        continue
      }

      if (char === '/') {
        tokens.push({
          type: '/',
          line, col,
        })
        continue
      }

      if (char === '!') {
        tokens.push({
          type: '!',
          line, col,
        })
        continue
      }
    }

    buf += char
  }

  return tokens
}

function isDigit(c) {
  let digits = '0123456789'.split('')
  return digits.includes(c)
}

function isValidIdentifier(str) {
  if (areAllCharsInStr(str, '.'))
    return false

  for (let char of str) {
    if (!isDigit(char) && !validIdentifierCharacters.includes(char))
      return false
  }

  return true
}

function areAllCharsInStr(str, char) {
  for (let c of str) {
    if (c !== char)
      return false
  }

  return true
}
