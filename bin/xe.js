#!/usr/bin/env node

const [ , , filename ] = process.argv

const parse = require('../src/parse')
const compile = require('../src/compile')
const fs = require('mz/fs')
const exec = require('mz/child_process').exec

fs.readFile(filename, 'utf8')
  .then(parse)
  .then(compile)
  .then(neko => fs.writeFile(filename + '.n', neko))
  .then(() => exec(`nekoc ${filename}.n`))
  .catch(console.error)
