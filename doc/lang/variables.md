# Variables

Variables in Xenon work similarly to they do in other languages, allowing you to store values while you perform calculations. Variables live within blocks of code (they are _local_ to that block).

To define a variable the `let` keyword is used. Right afterwards comes the variable's name, and then you can (optionally) place a `:` followed by the variable's [type](values.md). For example:

```xe
let foo: Str = "Hello"
```

Here we are declaring a variable called `foo` of the type `Str`, and assigning the value `"Hello"` to it.

You don't have to give a variable a value when it is defined - you can assign one later if you prefer. The compiler will complain if you attempt to read a value from a variable without a value.

Every variable has a type, but you don't have to specify it when you declare it if you provide an initial value. Your computer is clever, and it will infer the type of the variable from that value.

Therefore, the following definitions of `x`, `y` and `z` are all effectively identical:

```xe
let x: Int = 4

let y = 4

let z: Int
z = 4
```

All variables start with a lowercase letter, and you may not change the type of a variable.
