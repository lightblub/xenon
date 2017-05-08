# The Xenon Programming Language

Xenon is an open source, statically typed functional programming language with
a strong emphasis on defining _specific_ types for absolutely everything.

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

Xe is currently a work-in-progress.
