---
title: Lua scripts
description: 'Lua on a unit: the scripts a sensor or a CAN message can run, the functions they define and can call, what the interpreter has, with examples.'
sidebar:
  order: 2
---

<a href="https://www.lua.org/" class="lua-mark" title="Lua"><img src="/lua-logo.svg" alt="Lua" width="72" height="72" /></a>

Where a [math expression](/docs/scripting/math-expressions/) is not enough, a unit runs **Lua**: a small, fast scripting language, here in its version **5.4**, with numbers held as 32-bit floats and integers. A script is a file on the unit's SD card that a sensor or a CAN message names; the app keeps it in the project, edits it, and sends it to the unit with the configuration.

This page is about what the unit gives a script. The language itself is in the [Lua 5.4 reference manual](https://www.lua.org/manual/5.4/) and in [Programming in Lua](https://www.lua.org/pil/).

## Where a script runs

- **On a sensor.** A **scripted sensor** gets its value from its script, at the sensor's sampling rate; any other kind of sensor can hand its value to a script after the calibration table and the expression, and take back what the script returns.
- **On a CAN message the unit sends.** Just before each send, the script gets the frame's bytes as the signals were encoded and returns the bytes to send: a checksum, a rolling counter, a layout no signal can say.

A script belongs to the item that names it. A sensor's script and the sensor's own globals live as long as the configuration runs, so a script can keep state between calls: a counter, a peak, the last value.

## Functions a sensor script defines

```lua
function create_sensor_value(sensor_id)
```

Called at the sampling rate of a scripted sensor, with the sensor's ID. Returns the reading, a number.

```lua
function post_process_sensor_value(sensor_id, value)
```

Called once for each reading of any sensor that names the script, after the calibration table and the expression, with the reading so far (`nil` when there is none). Return a number to replace it, or `nil` to keep it.

A script may define either or both. An error inside a call marks that reading failed; the sensors that read it keep their previous values, and the next reading runs the script again.

## The function a CAN message script defines

```lua
function process_can_frame(frame_id, data)
```

Called before every send of the message. `data` is a string of exactly the message's size, one byte per character, with the signals already in it; a message without signals arrives as zeros. Return a string of the same size to send instead, or an empty string to send the bytes as they are.

## Functions a script can call

| Function                         | Gives                                                                                                                                                                |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `get_sensor_value(id)`           | The latest value of the sensor with that ID, or `nil` when it has none yet or does not exist                                                                         |
| `update_sensor_value(id, value)` | Writes a value into another sensor, as if it had read it; `false` when there is no such sensor. To change the sensor the script belongs to, return the value instead |
| `print(text)`                    | Writes a line to the unit's console                                                                                                                                  |
| `sleep_ms(ms)`                   | Waits. Avoid it: a script runs on the thread that reads the sensors or sends on the bus, and holds it meanwhile                                                      |

With `update_sensor_value` a script can feed a **scripted sensor that has no script of its own**: it holds whatever was last written into it, so one script can drive several sensors.

## What the interpreter has

The base library (`tonumber`, `tostring`, `pairs`, `pcall`, …), and `string`, `table`, `math` and `utf8`. There is no `io`, `os`, `package`, `coroutine` or `debug`, and no `require`: a script is one file. Each script has a memory budget of its own, and one that runs out fails only itself.

A script must return quickly. It is called on the unit's sensor or CAN thread, and a loop that waits holds the readings or the bus with it.

## Examples

A scripted sensor that counts its readings:

```lua
local counter = 0

function create_sensor_value(sensor_id)
    counter = counter + 1
    return counter
end
```

A peak that holds the highest boost seen, on a boost sensor's own reading:

```lua
local peak = 0

function post_process_sensor_value(sensor_id, value)
    if value == nil then
        return nil
    end
    if value > peak then
        peak = value
    end
    update_sensor_value("boost_peak", peak)
    return value
end
```

A clamp and a scale that reads another sensor:

```lua
function post_process_sensor_value(sensor_id, value)
    if value == nil then
        return nil
    end

    local rpm = get_sensor_value("engine_rpm")
    if rpm == nil then
        return -1 -- the other sensor has no value yet
    end

    return math.min(value, 100.0) * rpm
end
```

A sent message with a rolling counter in its last byte and a checksum before it:

```lua
local alive = 0

function process_can_frame(frame_id, data)
    local bytes = { data:byte(1, #data) }
    bytes[8] = alive
    alive = (alive + 1) % 16

    local sum = 0
    for i = 1, 6 do
        sum = (sum + bytes[i]) & 0xFF
    end
    bytes[7] = sum

    return string.char(table.unpack(bytes))
end
```

## The files

A script is a `.lua` file of up to 64 KiB, named with letters, digits, dots, underscores and hyphens. The app keeps a sensor's scripts under `scripts/sensors/` and a message's under `scripts/can/` in the project and on the unit's SD card, shows which copy differs, and sends what changed with **Write to unit**; the unit loads a script when it loads the configuration that names it, so a script sent on its own takes effect at the next write. A script that a stored configuration names cannot be deleted from the unit.
