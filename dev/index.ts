import { removeDefault } from '../src/index'

const target = {
  a: 0,
  b: {
    c: '',
  }
}
const result = removeDefault(target, {
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
})

console.info(result)
