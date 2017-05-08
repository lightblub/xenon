## Xenon
#### Xe is an open source, statically typed functional programming language

Xe is a new programming language in the making.

[Language Spec](http://xe.lightblub.xyz/)

It's a functional language with a strong emphasis on defining _specific_ types
for absolutely everything.

```xe
type Age(n: Int) {
  proof = n > 0
  cast Str =
    cast n + " years"
}

try
  let years: Age = cast input("How old are you?")
catch e
  print("That isn't an age!")

print("So you're $years old.")
```
