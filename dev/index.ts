import { removeDefault } from '../src/index'

const target = {
  a: 0,
  b: {
    c: '',
  }
}
const result = removeDefault(target, {
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
})

console.info(result)
