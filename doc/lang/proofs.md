# Proofs

Proofs are Xenon's way of defining [dependent types](https://en.wikipedia.org/wiki/Dependent_type). Dependent types depend on a value, for example a positive integer is an integer where `n > 0`.

In Xenon this can be expressed as follows:

```xe
proof Positive(n: Int) =
  n > 0
```

From then on, you may use `Positive` in type annotations. You can also use the `is` operator to determine if a value satisfies a type definition or proof. For example:

```xe
let n: Positive = 25

n is Int # true
-2 is Positive # false
```

It can be very useful to define proofs for many values in your program to ensure that they are not something you don't expect, such as for parsing user input.

```xe
proof Char(c: Str) =
  c == 1

proof AorB(c: Char) =
  c == "A" | c == "B"

let foo: AorB = "Z" # error
```

Note that proofs should be [pure functions](functions.md#pure-functions).
