import test from 'ava'

import { removeDefault } from '../src'

test('remove default array', (t) => {
  t.is(removeDefault(
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
    }), undefined)
})

test('remove default object', (t) => {
  t.is(removeDefault(
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
    }), undefined)
})

test('remove padding', (t) => {
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
  t.deepEqual(removeDefault<Target>({
    padding: {
      left: 0,
      right: 10,
      top: 0,
      bottom: 0,
    }
  }, schema), {
    padding: {
      right: 10
    }
  })

  t.deepEqual(removeDefault<Target>({
    padding: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    }
  }, schema), {})
})

test('support $ref', (t) => {
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
  t.is(removeDefault({
    a: 0,
    b: {
      c: '',
    }
  }, schema), undefined)
})

test('support anyOf', (t) => {
  const schema = {
    $ref: '#/definitions/Content',
    definitions: {
      Content: {
        anyOf: [
          {
            $ref: '#/definitions/TextContent'
          },
          {
            $ref: '#/definitions/ImageContent'
          }
        ]
      },
      TextContent: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            const: 'text'
          },
          text: {
            type: 'string'
          },
          rotate: {
            type: 'number',
            default: 0
          }
        }
      },
      ImageContent: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            const: 'image'
          },
          url: {
            type: 'string'
          }
        }
      }
    }
  }
  t.deepEqual(removeDefault<{
    type: 'text',
    text: string
    rotate?: number
  }>({
    type: 'text',
    text: 'a',
    rotate: 0
  }, schema), {
    type: 'text',
    text: 'a'
  })
})
