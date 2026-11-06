---
title: Concepts
description: The words the docs use, each defined once, from unit and sensor to reading from and writing to a unit.
sidebar:
  order: 3
---

The words the rest of the docs use, each defined once.

## The system

**Unit.** One Eerie Leap device in the car. It runs the firmware and does what its configuration says.

**Network.** Units connected together on a CAN bus organize themselves into one network. The app reaches all of them through whichever one it is connected to.

**Firmware.** The software a unit runs. It is the same on every unit of a kind, open source, and updated over the air through the app.

## What a unit works with

**Sensor.** A value with a name. It may be measured on an input, read from the CAN bus, or worked out from other sensors. Everything else on the unit refers to a sensor by its name.

**Calibration table.** The points that turn an input's voltage into a value, such as volts into degrees.

**Expression.** A formula on a sensor, over its own value and other sensors.

**Script.** A Lua file a sensor or a CAN message runs, for what a formula can't say.

**CAN message and signal.** A message is one frame on the bus; a signal is one value inside it. A unit can receive a message and read its signals as sensors, or send a message with its own sensors in it.

**Log.** A file of sensor values over time, in the MDF4 format.

**Gauge, screen, widget.** The gauge is what a unit with a display shows. It is made of screens you swipe through, and each screen of widgets: a dial, a readout, a chart, a picture, a button.

**Binding.** What makes a widget follow a value, or a button act on one.

## In the app

**Project.** One file that holds every unit of a car and all their configurations.

**Configuration.** Everything a unit is told to do, in four parts: sensors, CAN bus, logging and gauge.

**Read from unit.** Takes the configuration a unit holds into the project.

**Write to unit.** Sends the project's configuration to the unit. Nothing you change takes effect on a unit until you write it.

**In sync, out of sync.** Whether the project and the unit hold the same configuration. The app compares them when it connects and says which parts differ.
