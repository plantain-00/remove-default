import { removeDefault, JsonSchema } from '../src/index'

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
  } as JsonSchema
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
})
