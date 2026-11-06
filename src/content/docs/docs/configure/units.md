---
title: Units and the project
description: "How the app reaches a unit and the network behind it, how a project's configurations get to and from a unit, and how a unit is updated."
sidebar:
  order: 5
---

Everything a unit does comes from the app: the configurations are made in a project, written to the unit over Bluetooth, and read back from it.

## The project

A **project** is one file that holds every unit of a car: a device for each, with its name, its product and its four configurations. It opens on the desktop and on a phone alike, and a device can be exported on its own and imported into another project.

A device is **bound** to a unit when the app connects to one: the binding is this computer's, not the file's, so a project opened on another machine is bound again there.

## Connecting, and the network

The app connects to one unit over **Bluetooth**. The units connected to it on their COM channel form a **network**, and the app reaches every one of them through the unit it is connected to: it reads and writes their configurations, their logs and their files, and shows their status, as if each were connected itself. Live values, which stream, come only from the unit the app is connected to.

## Reading from and writing to a unit

A unit holds its own copy of each configuration. The app never changes a unit by itself:

- **Read from unit** takes what the unit holds into the project.
- **Write to unit** sends the project's configuration to the unit, with the files it names: scripts, pictures, animations, fonts.

When a unit connects, the app compares the project's copy with the unit's and says, part by part, whether they are **in sync**. A part the unit changed under a configuration you have not edited is read without asking; a part that differs on both sides is left as it is and marked, for you to decide. A write that would replace a change made on the unit asks first, and so does any write while a unit is known to be logging, since a write stops it.

A unit keeps a configuration it cannot run, and runs a default in its place; the app marks such a part **not applied** until a write it accepts replaces it.

## Files on the unit

A unit with an SD card holds the **scripts** its configurations name; a unit with a display holds **pictures, animations and fonts** in its own memory. The app shows, for each kind, what the project has and what the unit has, which copies differ, and which files nothing uses; a file is sent with the configuration that names it, or on its own.

## Firmware updates

A unit's firmware is updated from an image file, **over the air through the app**: the file is sent to the unit, the unit restarts into it, checks itself and keeps the old firmware as a backup, to which it can roll back. The app checks the image against the unit before it sends anything, says how long sending takes, and that the update stops logging and drops the Bluetooth link while the unit restarts.
