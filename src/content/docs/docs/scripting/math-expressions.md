---
title: Math expressions
description: 'The math expression engine a sensor computes with: what an expression can read, its operators and functions, with examples, and its limits.'
sidebar:
  order: 1
---

A sensor can carry a **math expression**: a formula the unit works out every time the sensor is read, with the **math expression engine** built into the firmware. It is for a scale, an offset, a value made of other sensors, or a yes-or-no that becomes a warning. It has no state and no side effects, so it is cheap and safe; for anything that remembers or loops, write a [Lua script](/docs/scripting/lua-scripts/).

```
x * 4 + 1.6
rpm > 1500 && oil_pressure < 1.5
max(egt_1, egt_2, egt_3, egt_4)
```

## What an expression reads

- **`x`** is the sensor's own value, before the expression: the calibrated reading of an analog input, the level of a digital one, the decoded signal of a CAN sensor, the value a script gave a scripted sensor. A virtual sensor has no `x`; it is nothing but its expression.
- **Any other name** is a sensor of the unit, by its ID: `rpm`, `oil_pressure`. The app offers them as you type, and renames them in every expression when a sensor is renamed.
- **`_pi`** and **`_e`** are the constants.

The result is the sensor's value. An expression is worked out only when every sensor it names has a value; until then the sensor has none. A result that is not a number (`0 / 0`) leaves the sensor without a value as well.

## Values

Every value is a number, a 32-bit floating-point one: about seven significant digits. A comparison gives `1` for true and `0` for false, and anything that is not `0` counts as true. Arithmetic never fails: `1 / 0` is infinity, which a comparison then treats like any number.

An indicator sensor, one whose value is on or off, is just an expression that gives `0` or `1`.

## Operators

From the loosest to the tightest. Operators on one line bind alike, left to right.

| Operators         | Meaning                                                          |
| ----------------- | ---------------------------------------------------------------- |
| `c ? a : b`       | `a` if `c` is true, else `b`; only the chosen side is worked out |
| `\|\|`            | or                                                               |
| `&&`              | and                                                              |
| `< > <= >= == !=` | comparisons, giving `1` or `0`                                   |
| `\|`              | bitwise or                                                       |
| `&`               | bitwise and                                                      |
| `<< >>`           | shift left, shift right                                          |
| `+ -`             | add, subtract                                                    |
| `* /`             | multiply, divide                                                 |
| `-a` `+a` `~a`    | negative, positive, bitwise not                                  |
| `a ^ b`           | power; `2 ^ 3 ^ 2` is `2 ^ 9`                                    |

The bitwise operators bind tighter than the comparisons, so `raw & 4 == 4` is `(raw & 4) == 4`, and looser than the arithmetic, so `raw >> 8 & 0xFF` is `(raw >> 8) & 0xFF`. Parentheses settle anything else.

## Numbers

`1`, `1.5`, `.5`, `1e3`, `2.5E-2`; hexadecimal `0xFF` and binary `0b1010` for masks and bit patterns. A hexadecimal or binary number is a 32-bit pattern, so `0xFFFFFFFF` is `-1`.

## Functions

| Function                                   | Gives                                                                   |
| ------------------------------------------ | ----------------------------------------------------------------------- |
| `abs(a)`                                   | the absolute value                                                      |
| `sign(a)`                                  | `-1`, `0` or `1`                                                        |
| `rint(a)`                                  | `a` rounded to the nearest whole number, halves up                      |
| `min(a, b, …)` `max(a, b, …)`              | the smallest or the largest of up to eight                              |
| `sum(a, b, …)` `avg(a, b, …)`              | the sum or the average of up to eight                                   |
| `sqrt(a)` `exp(a)`                         | square root, e to the power of `a`                                      |
| `log(a)` or `ln(a)`, `log2(a)`, `log10(a)` | logarithms: natural, base 2, base 10                                    |
| `sin(a)` `cos(a)` `tan(a)`                 | trigonometry, in radians; also `asin`, `acos`, `atan` and `atan2(y, x)` |
| `sinh(a)` `cosh(a)` `tanh(a)`              | hyperbolic; also `asinh`, `acosh`, `atanh`                              |
| `xor(a, b)`                                | bitwise exclusive or (`^` is power)                                     |

A function needs its parentheses right after its name.

## Bits

`&`, `|`, `xor()`, `~`, `<<` and `>>` work on the whole part of their operands as 32-bit integers, and give a number back. They are for pulling a field out of a raw value:

```
(raw >> 8) & 0xFF
raw & 0x01 ? 1 : 0
```

A pattern wider than 24 bits does not survive as a plain number, so write masks in hexadecimal, which the engine checks.

## Examples

| Expression                               | What it does                                                      |
| ---------------------------------------- | ----------------------------------------------------------------- |
| `x * 0.0689`                             | psi into bar                                                      |
| `x * 1.8 + 32`                           | °C into °F                                                        |
| `max(0, min(100, x))`                    | clamped to 0 to 100                                               |
| `avg(egt_1, egt_2, egt_3, egt_4)`        | the mean of four values                                           |
| `rpm > 1500 && oil_pressure < 1.5`       | an oil pressure warning, on while the engine runs with too little |
| `coolant_temp > 105 \|\| oil_temp > 130` | either over its limit                                             |
| `x > 0.5 ? 1 : 0`                        | a threshold, as an indicator                                      |
| `(raw >> 4) & 0x0F`                      | bits 4 to 7 of a raw value                                        |

## Limits

An expression is at most 256 characters long, names at most 16 different values, `x` included, and nests parentheses, calls and conditions 8 deep; `min`, `max`, `sum` and `avg` take at most 8 arguments. The app underlines a syntax error where the unit would report it, and the unit refuses a configuration whose expression it cannot compile.

## What it cannot do

No assignment, no memory from one reading to the next, no loops, no text. A value that must be held, counted or searched for is a [Lua script](/docs/scripting/lua-scripts/).
