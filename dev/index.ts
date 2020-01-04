import { removeDefault } from '../src/index'

const target = {
  type: 'text',
  text: 'a',
  rotate: 0
}
const result = removeDefault(target, {
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
})

console.info(result)
