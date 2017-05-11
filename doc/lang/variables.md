# Variables

Variables in Xenon work similarly to they do in other languages, allowing you to store values while you perform calculations. Variables live within blocks of code (they are _local_ to that block).

To define a variable the `let` keyword is used. Right afterwards comes the variable's name, and then you can (optionally) place a `:` followed by the variable's [type](values.md). For example:

```xe
let foo: Str = "Hello"
```

Here we are declaring a variable called `foo` of the type `Str`, and assigning the value `"Hello"` to it.

You **must** give a variable an initial value when you define it.

```xe
let z: Int # error, must give z an initial value
z = 25
```

Every variable has a type, but you don't have to specify it when you declare it. The compiler will attempt to infer the type of the variable based on the initial value, but it's always best to specify the type if you know what it should be anyway.

Therefore, the following definitions of `x` and `y` are all effectively identical:

```xe
let x: Int = 4
let y = 4
```

All variables start with a lowercase letter, and you may not change the type of a variable.
