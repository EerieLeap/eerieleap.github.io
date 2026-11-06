---
title: Gauge
description: 'The screens a unit with a display shows: groups, widgets and overlays, what each widget can show, and how a widget is bound to a sensor or a setting.'
sidebar:
  order: 4
---

A unit with a display shows a **gauge**: what its gauge configuration describes, drawn on the unit by the firmware itself. The configuration is designed on a canvas in the app, previewed on the unit without being stored, and written to it like any other part.

## Screens, groups and overlays

- A **screen** is what the gauge shows at once. Swiping on the display goes from one screen to the next, in the order they are listed; one of them is the **start screen**, shown at power-on.
- A screen is made of **groups**, each a set of widgets on a grid of its own, stacked over one another. A group can be kept hidden.
- An **overlay** is a group that belongs to no screen: a button shows it over whichever screen is up, above a dimmed scrim, and another takes it away.

A group's **grid** says what a widget's position and size are counted in. The app speaks pixels from the top left of the display and converts.

## Widgets

A widget is one thing drawn on a screen, with a box, a place in the stacking order and a set of properties that depends on its type:

|                | Widgets                                                                                                                                                     |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Basic**      | An **icon**: a label in a font, a picture, or a shape such as a rectangle, a line or an oval; an **arc icon**; a **Lottie animation**                       |
| **Indicators** | An **arc fill**, a **digital** readout, a **chart** of the last values, a **segment arc**, a **dial** with a needle, a **bar**, and a **setting** indicator |
| **Controls**   | A **slider**, a **toggle** and a **button**, which take touch                                                                                               |

A dial's needle is a widget of its own, owned by the dial: a shape or a picture that turns with the value.

Every indicator has a **range**, from its minimum to its maximum, and a **value** between them, which is what a binding moves. Colors are written as `#RRGGBBAA`, or left empty for the unit's theme color.

## Bindings

A **binding** makes a widget's property follow a value on the unit: a dial's value follows `rpm`, whether a warning mark is shown follows `oil_warning`, a readout follows a setting. Any property can be bound, the position and size of a widget included, so a layout can move with a value.

A **control** can send as well as follow. A slider, a toggle or a button bound both ways **drives a setting** of the unit, such as the display's brightness, or **drives a control sensor**: a sensor of the unit whose value is the control's position, state or press, which the rest of the configuration then reads like any sensor, logs, or sends on the bus.

What a binding names is chosen from what the unit has: its sensors, its settings and the events on its bus. The app says where a binding and a property do not go together, such as a number bound to something that is on or off.

## Pictures, animations and fonts

A widget that shows a picture names a file on the unit. The app converts a PNG or JPEG into the display's own format and sends the file with the configuration; an SVG goes as it is, and the unit draws its shapes, paths and gradients. A Lottie animation is a JSON file. A text widget can use a **font** of its own, a TTF file, at a size you set; the unit carries three fonts built in.

## Preview on unit

While the app is connected over Bluetooth, **Preview on unit** shows the configuration on the unit's display as you edit it, with the widget you have selected outlined. Nothing is stored and logging is not stopped; **Write to unit** is what keeps it.

In the app, a **preview value** sweeps every indicator through its range on the canvas, and **Show live values** moves them with the unit's real readings instead.

## What the unit checks

The unit refuses a gauge configuration it cannot build, and the app shows the same findings before you write it: too many groups or widgets, a widget outside its grid, a property of the wrong kind, a dial without a needle or with two, a picture or a font that is nowhere. The app also warns of what the unit takes but will not show as meant: a widget past the edge of a round display, a character the font lacks, a picture of another size than the widget says.
