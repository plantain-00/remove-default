# remove-default

A library to remove from objects properties that match default values to minimize storage or payload.

[![Dependency Status](https://david-dm.org/plantain-00/remove-default.svg)](https://david-dm.org/plantain-00/remove-default)
[![devDependency Status](https://david-dm.org/plantain-00/remove-default/dev-status.svg)](https://david-dm.org/plantain-00/remove-default#info=devDependencies)
[![Build Status: Linux](https://travis-ci.org/plantain-00/remove-default.svg?branch=master)](https://travis-ci.org/plantain-00/remove-default)
[![Build Status: Windows](https://ci.appveyor.com/api/projects/status/github/plantain-00/remove-default?branch=master&svg=true)](https://ci.appveyor.com/project/plantain-00/remove-default/branch/master)
[![npm version](https://badge.fury.io/js/remove-default.svg)](https://badge.fury.io/js/remove-default)
[![Downloads](https://img.shields.io/npm/dm/remove-default.svg)](https://www.npmjs.com/package/remove-default)
[![gzip size](https://img.badgesize.io/https://unpkg.com/remove-default?compression=gzip)](https://unpkg.com/remove-default)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fplantain-00%2Fremove-default%2Fmaster%2Fpackage.json)](https://github.com/plantain-00/remove-default)

## install

`yarn add remove-default`

## usage

```ts
import { removeDefault } from "remove-default";
// <script src="./node_modules/remove-default/remove-default.min.js"></script>

const schema = {
  type: 'object',
  properties: {
    padding: {
      type: 'object',
      properties: {
        left: {
          type: 'number',
          default: 0
        },
        right: {
          type: 'number',
          default: 0
        },
        top: {
          type: 'number',
          default: 0
        },
        bottom: {
          type: 'number',
          default: 0
        }
      },
      default: {}
    }
  }
}
expect(removeDefault({
  padding: {
    left: 0,
    right: 10,
    top: 0,
    bottom: 0,
  }
}, schema)).toEqual({
  padding: {
    right: 10
  }
})

expect(removeDefault({
  padding: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  }
}, schema)).toEqual({})
```
