---
title: Sensors
description: 'What a sensor is on a unit, the kinds there are, and what you set for each: the calibration table, the sampling rate, a math expression, a script.'
sidebar:
  order: 1
---

A **sensor** is a value with a name. Everything else on a unit refers to a sensor by that name: a gauge dial follows one, the logger records one, a CAN message carries one, and a math expression reads others. Where the value comes from is the sensor's kind.

## The kinds

| Kind                             | The value comes from                                                     | What you set                                               |
| -------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------- |
| **Analog input**                 | A voltage on one of the unit's analog inputs                             | The input, a calibration table, the sampling rate          |
| **Digital input** (an indicator) | A level on one of the unit's digital inputs: on or off                   | The input, the sampling rate, a debounce and an input mode |
| **CAN signal**                   | One signal of a message the unit receives                                | The channel, the message's frame ID and the signal's name  |
| **CAN frame**                    | Every frame of one message the unit receives, kept as it is, for the log | The channel and the frame ID                               |
| **Virtual**                      | A math expression over other sensors, and nothing else                   | The expression                                             |
| **Scripted**                     | A Lua script, or what other scripts write into it                        | The script, the sampling rate                              |
| **Control**                      | A control on the unit's own gauge: a button, a toggle or a slider        | Which control drives it, set on the gauge side             |

An **indicator** is a sensor whose value is on or off, 0 or 1: a digital input, a CAN signal one bit wide, a virtual indicator, a scripted one. It is what a warning is, and what starts and stops logging.

## What every sensor has

- **ID.** The name everything else uses: `oil_pressure`. Lower-case letters, digits and underscores, starting with a letter. Renaming a sensor in the app renames it everywhere it is used.
- **Name, unit and description.** For people: "Oil pressure", `bar`, and a note.
- **Enabled.** A sensor that is disabled is kept in the configuration but not run; anything that reads it reads nothing.

## The calibration table

An analog input gives the unit a voltage. The **calibration table** turns it into the value you want: a lookup table (LUT) of points, each a voltage and the value it stands for, taken from the sender's data sheet or measured. The unit interpolates between the points, **linearly** or with a **cubic spline**, and holds the value at the ends outside them.

A table has two points at least and fifty at most, each voltage once. The app plots the curve through the points as you type them, so a wrong point shows at once.

## The sampling rate

How often the unit reads an input, runs a script or works an expression out, in milliseconds. An analog input and a scripted sensor need one; a digital input and a virtual sensor may have one. A CAN sensor and a control sensor have none: they are updated when their message or their control does.

## Debounce and input mode

A digital input can be **debounced**: a change has to hold for that many milliseconds before it counts. The **input mode** says what the input means: **Level**, on while the input is on, or **Toggle**, which flips the value at each press. A button on a gauge can be read the same way through a control indicator.

## A math expression

Any sensor but a CAN frame can carry a **math expression**, worked out on the unit after the value is read: `x` is the sensor's own value (the calibrated voltage, the level, the decoded signal), and any other sensor is named by its ID. A virtual sensor is nothing but its expression.

```
x * 4 + 1.6
rpm > 1500 && oil_pressure < 1.5
```

The language is in [Math expressions](/docs/scripting/math-expressions/).

## A Lua script

Where an expression is not enough, a sensor can run a **Lua script**: a file on the unit's SD card, which the app sends along with the configuration. A scripted sensor gets its value from its script; any other kind but a CAN frame can post-process its value with one. See [Lua scripts](/docs/scripting/lua-scripts/).

## Order and groups

The app lists sensors by kind, in the order you put them in. The unit does not care about the order; the gauge, the logger and the bus find a sensor by its ID.

## What the unit checks

The unit refuses a sensors configuration it cannot run, and the app shows the same findings before you write it: an input the unit does not have, a calibration table with too few points, an expression that names a sensor that does not exist, a CAN signal the CAN bus configuration has no message for. A warning marks what the unit takes but you may not mean, such as a sensor that reads a disabled one.
