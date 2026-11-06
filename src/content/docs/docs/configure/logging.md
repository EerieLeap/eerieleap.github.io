---
title: Logging
description: 'What a unit logs and how often, which sensors, what starts and stops it, and what becomes of the files.'
sidebar:
  order: 3
---

A unit with an SD card writes **logs**: files of sensor values over time, in the **MDF4** format that analysis tools open. Its logging configuration has two parts, the settings with the sensors to log, and the bindings that start and stop it.

## Settings

- **Interval.** How often a row of values is written, in milliseconds, 10 at the least. A sensor that is read more often than that is logged at the interval; a CAN frame sensor logs every frame.
- **File size.** When a file grows past it, in MB (1024 at most), the unit closes it and starts the next one, so that a long drive is a run of files that continue one another. 0 never starts a new file.

## Sensors to log

Each sensor you add to the list is logged. For each one you may also log:

- its **raw value**, for an input that has a math expression: the value before the expression, the calibrated reading of an analog input or the level of a digital one;
- **only new data**: a row only when the value changed, which keeps a slow value from filling the file.

A sensor not in the list is not logged. A sensor in the list that is disabled in the sensors configuration logs nothing until it is enabled.

## Starting and stopping

Logging starts and stops in three ways:

- **A binding.** An on-or-off value on the unit's event bus, such as an indicator sensor (`rpm > 500`, a switch on a digital input), starts logging when it turns on and stops it when it turns off. A binding names the unit it is for: this one, a unit of the network by its ID, or every unit that writes logs. Up to sixteen bindings.
- **The app.** Start and Stop on the unit's Logging page, with the status beside them: whether it logs, the file being written and its size.
- **The network.** A unit without a log writer, such as one with a display, can start and stop the units that have one.

:::note
Writing any configuration to a unit stops logging on every unit of the network, and nothing starts it again but a binding turning on or a Start. The app says so before it writes while a unit is known to be logging.
:::

## The files

A log is named after the time it started on the unit's clock, which counts from power-on and is not a date. The app lists a unit's logs with their length and size, saves them to the computer or the phone one at a time or all at once, and deletes them; the log being written is closed first. A log can be **plotted** in the app straight from the unit, with cursors, several logs laid over one another and a CSV export, and a set of logs saved together as a **session** file.

## What the unit checks

The unit refuses a logging configuration it cannot run, and the app shows the same findings before you write it: an interval under 10 ms, a file size past the limit, more than sixteen bindings. The app also warns of a setting that does nothing: a raw value on a sensor that has none, only new data on a CAN frame sensor, a sensor the list names that the sensors configuration lacks.
