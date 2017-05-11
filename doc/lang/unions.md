# Unions

Union types give you the ability to annotate or define types that are _either_ this or that. For example, a number is either an integer or a float. This can be expressed in Xenon as:

```xe
union Number = Int | Float

let n: Number = 25
print("n is $n")
print("n is an integer? " + cast n is Int) # true
```

Note that a `Num = Int | Float` type is, by default, defined, in all programs.

You can also use union types without explicitly naming/declaring them beforehand:

```xe
fun factorial(n: Int | Float | MyCoolCustomNumberType) =
  if n >= 1 then n * factorial(n - 1)
  else 1

factorial(5)
factorial(2.0)
factorial("hi") # compile-time error
``` 

The compiler will infer union types if required. For example:

```xe
let n = if someCheck() then 25 else false
# n's type is Int | Bool
```

You can only use **common** methods, operations, or properties present on _all_ potential types in a union. The compiler shall enforce this.

```xe
let n: Int | Bool = 24 * 8

n is Int # true
n is Bool # false

# the type of n is still Int | Bool

n - 2 # error: Bool type does not support operator -
```

