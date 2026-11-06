---
title: CAN bus
description: 'The channels of a unit, the messages it receives and sends, their signals, and how a signal becomes a sensor or a sensor a signal.'
sidebar:
  order: 2
---

A unit listens to the car's CAN bus and talks on it. Its CAN bus configuration says, for each of its channels, which messages it receives, which it sends, and how the values inside them are laid out.

## Channels

A **channel** is one of the unit's CAN ports, numbered from 0. For each one you set:

- the **type**: classical CAN, or CAN FD where the port's hardware has it;
- the **bitrate**, and for CAN FD the data bitrate;
- the **frame ID format**, standard 11-bit or extended 29-bit IDs.

Every unit of a network must agree with the bus it is on: the same type and bitrates on each channel that shares a wire. The app's System Map checks that across units once you tell it which channels are on one bus.

### The COM channel

One channel of a unit can be its **COM channel**: the one its network runs on. Units connected on it find each other and work as one system, and the app, connected to one of them, reaches the others through it. A range of frame IDs on that channel is reserved for the network, and the app marks a message of yours that lands in it.

## Messages

A **message** is one frame on the bus, named by its **frame ID**. It has a **size** in bytes (8 on classical CAN, up to 64 on CAN FD) and a **name** for people.

A message with a **send interval** is one the unit sends, that often. A message without one is one the unit **receives**. Everything else is the same both ways.

A message can be **disabled**: kept in the configuration but neither sent nor read.

## Signals

A **signal** is one value inside a message, laid out the way DBC files describe it:

- its **start bit** and **size** in bits;
- its **byte order**, big or little endian, and whether it is **signed**;
- a **factor** and an **offset**: the value is the raw bits times the factor plus the offset;
- a **name** and a **unit**.

The app draws the frame as bits, with the selected signal marked, so an overlap shows.

### Received signals become sensors

A received message's signals are read by sensors: a **CAN signal** sensor names the channel, the frame ID and the signal, and is updated every time the message arrives. A signal one bit wide is read as an indicator. From then on it is a sensor like any other: logged, shown on a gauge, read by an expression, sent on in another message.

A **CAN frame** sensor takes a received message whole, frame by frame, for the log.

### Sent signals are sensors

In a message the unit sends, each signal is named after the **sensor** whose value it carries. The unit puts the sensor's latest value into the signal, through the factor and the offset, every time it sends the message. A signal named after no sensor, or after one that is disabled, is sent as 0, and the app warns.

## DBC files

A channel's messages and signals can be **imported from a DBC file**, into that channel or a new one, and **exported** as one, in the layout other tools write. Scaling numbers are kept as written.

## A script on a message

A sent message can run a **Lua script** just before each send, with the frame's bytes as its signals were encoded, and send what the script returns instead: a checksum, a counter, a format no signal layout can say. See [Lua scripts](/docs/scripting/lua-scripts/).

## What the unit checks

The unit refuses a CAN bus configuration it cannot run, and the app shows the same findings before you write it: a channel the unit does not have or a type its port does not take, a frame ID past the format's range, a signal past the end of its message. The sensors configuration is checked against it as well: a CAN signal sensor must name a message and a signal that exist.
