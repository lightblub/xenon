# Functions

Functions in Xenon are defined using the `fun` keyword.

```xe
fun makeMoreExciting(str: Str): Str =
  str + "!!!"
```

Here, we are defining a function, `makeMoreExciting`, that takes a string argument and returns a more exciting version of that string.

Note that we could have left the annotations (`: Str`) out and the compiler would have inferred that this function takes a Str argument _and_ returns a Str, based on the body.

## Function application

Functions may be executed - applied - using the common `fn(a, b, c)` syntax, e.g.

```xe
fun divide(x, y) =
  x / y

divide(6, 4) # 1.5
```

All functions have a specified **arity** value. This is the amount of formal arguments a function takes - for example, the `divide(x, y)`.

Xenon supports **partial function application**. This means that if you provide the first `n` arguments to the function, the result is a function that takes the remaining arguments. For example, calling `divide(1)` results in the parameter `x` being fixed to 1:

```xe
let divide1: Fun = divide(1)

# the following two statements are equivalent:
divide1(2)
divide(1, 2)
```

## Pure functions

A pure function in Xenon is a function that doesn't rely on any networking, input/output, or filesystem-based apis. i.e. a function that calls `print()` is not pure.

Some Xenon language features require you to write pure functions, such as [proofs](proofs.md).
