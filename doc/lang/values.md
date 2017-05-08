# Values

A value in Xenon must be some kind of the following basic datatypes:

* **Int**: integers can be represented in either decimal form \(such as `12345` or `-14`\) or hexadecimal \(`0xFFF`\)
* **Float**: floating-point numbers are represented similarly, i.e `12.34`
* **Bool**: booleans are written as `true` or `false`.
* **Str**: strings are surrounded by either double or single quotes, for example `"Hello"` or `'foo'`. Typical escapes are supported \(such as `"multi\nline"`\)
* **Arr**: arrays are integer-indexed lists of values, with the index starting at zero. They can be represented as `[ a, b, c ]`.
* **Map**: maps hold key-value pairs. Any value may be used as either a key or a value.
* **Fun**: functions are also a value, and thus can be stored in any variable.

Note:

* Integers have 31 bits for performance reasons.
* Floating-point values are 64-bit double-precision.
* Strings are sequences of bytes. The length of a string is determined by the number of bytes in it.
* Xenon has no concept of **null**.

