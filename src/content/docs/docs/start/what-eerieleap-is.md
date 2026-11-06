---
title: What Eerie Leap is
description: 'A unit, the firmware it runs, and the app that sets it up: what each is, in the order you meet them.'
sidebar:
  order: 1
---

A unit, the firmware it runs, and the app that sets it up: what each is, in the order you meet them.

## The units

An Eerie Leap **unit** is a small computer in the car. It reads sensors wired to it and the messages on the car's CAN bus, works values out of them, and does something with the result: logs it, shows it, or sends it on.

Units come in kinds. One kind reads and logs. Another has a display and shows a gauge. Connected together on a CAN bus, they find each other and work as one system.

## The firmware

Every unit runs the same open-source firmware. It does not know what car it is in: it reads a **configuration** and does what that says.

:::note
These docs are for using a unit. The firmware's own reference, written for whoever changes it, stays with its code on [GitHub](https://github.com/EerieLeap/rt_core/tree/main/docs).
:::

## The app

**Gefera** is the app that makes the configuration. On a desktop or a phone, you describe the inputs, the messages, the gauge's screens and what to log, and write it to the unit over Bluetooth.

## What a configuration is

Four things, each set up on its own page of the app:

- **Sensors**: every value the unit knows, whether it is measured, read from the bus or worked out.
- **CAN bus**: the messages the unit listens to and the ones it sends.
- **Logging**: which sensors are logged, how often, and what starts and stops it.
- **Gauge**: the screens, on a unit with a display.

## Where to go next

[How the parts fit](/docs/start/how-the-parts-fit/) follows one value from a sensor to a gauge, and [Concepts](/docs/start/concepts/) defines the words the rest of the docs use. **Configuring** has a page for each part of a configuration, and **Scripting** the math expression engine and Lua.
