---
title: How the parts fit
description: One value followed from a sensor's wire to a needle on a gauge, through everything an Eerie Leap system does to it on the way.
sidebar:
  order: 2
---

The quickest way to see how an Eerie Leap system works is to follow one value through it. Take oil pressure, from a sender in the engine to a needle on the dash.

## 1. A wire becomes a number

The pressure sender is wired to an analog input of a unit. All the unit sees there is a voltage.

A **calibration table** turns that voltage into a pressure: a few points from the sender's data sheet, and the unit reads everything between them off the curve through the points.

The result is a **sensor**: a value with a name, `oil_pressure`, and a unit of measure.

## 2. The number is worked on

A sensor can have a **math expression**, for what a table can't say: a scale, an offset, or a value made of other sensors. A warning that is on while the engine runs with too little pressure is such a sensor:

```
rpm > 1500 && oil_pressure < 1.5
```

Where an expression is not enough, a sensor can run a **Lua script** instead.

## 3. The number goes places

From here on `oil_pressure` is like any other sensor on the unit, whether it was measured, read from the car's bus or worked out. It can be:

- **logged**, to an MDF4 file;
- **sent on the CAN bus**, as a signal in a message you lay out;
- **read by another sensor's** expression or script.

## 4. Another unit picks it up

A unit with a display, on the same bus, listens for that message. The signal in it becomes a sensor of its own on that unit.

## 5. A needle moves

On the gauge, a dial is **bound** to that sensor: its needle follows the value. So can a readout, a bar or a chart, or whether a warning mark is shown.

## Where all of this is set up

Every step above is a setting in Gefera: the table, the expression, the message, the dial and what it is bound to. Nothing is written in code unless you want it to be, and nothing takes effect until you write the configuration to the unit.

Next: [Concepts](/docs/start/concepts/), the words used here, each in one place.
