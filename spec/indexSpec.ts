import { removeDefault } from '../dist/nodejs/index'

it('remove default array', () => {
  expect(removeDefault(
    {
      a: 0,
      b: []
    },
    {
      type: 'object',
      properties: {
        a: {
          type: 'number',
          default: 0
        },
        b: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              c: {
                type: 'string',
                default: ''
              }
            },
            default: {}
          },
          default: []
        }
      },
      default: {}
    })).toEqual(undefined)
})

it('remove default object', () => {
  expect(removeDefault(
    {
      a: 0,
      b: {
        c: '',
      }
    },
    {
      type: 'object',
      properties: {
        a: {
          type: 'number',
          default: 0
        },
        b: {
          type: 'object',
          properties: {
            c: {
              type: 'string',
              default: ''
            }
          },
          default: {}
        }
      },
      default: {}
    })).toEqual(undefined)
})

it('remove padding', () => {
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
  interface Target {
    padding?: {
      left?: number
      right?: number
      top?: number
      bottom?: number
    }
  }
  expect(removeDefault<Target>({
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

  expect(removeDefault<Target>({
    padding: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    }
  }, schema)).toEqual({})
})

it('support $ref', () => {
  const schema = {
    $ref: '#/definitions/entry',
    definitions: {
      entry: {
        type: 'object',
        properties: {
          a: {
            $ref: '#/definitions/a'
          },
          b: {
            $ref: '#/definitions/b'
          }
        },
        default: {},
      },
      a: {
        type: 'number',
        default: 0
      },
      b: {
        type: 'object',
        properties: {
          c: {
            $ref: '#/definitions/c'
          }
        },
        default: {}
      },
      c: {
        type: 'string',
        default: ''
      }
    }
  }
  expect(removeDefault({
    a: 0,
    b: {
      c: '',
    }
  }, schema)).toEqual(undefined)
})
