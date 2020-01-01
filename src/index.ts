/**
 * @public
 */
export function removeDefault(target: unknown, schema: JsonSchema) {
  if (schema.type === 'object' && schema.properties) {
    for (const propertyName in schema.properties) {
      const property = schema.properties[propertyName]
      const value = (target as { [name: string]: unknown })[propertyName]
      const result = removeDefault(value, property)
      if (result === undefined) {
        delete (target as { [name: string]: unknown })[propertyName]
      }
    }
  }
  if (schema.type === 'array' && Array.isArray(target)) {
    for (let i = 0; i < target.length; i++) {
      const item = target[i]
      const result = removeDefault(item, schema.items)
      if (result === undefined) {
        target[i] = undefined
      }
    }
  }
  if (schema.type && schema.default !== undefined && equals(target, schema.default)) {
    return undefined
  }
  return target
}

function equals(value1: unknown, value2: unknown) {
  if (value1 === null && value2 === null) {
    return true
  }
  if (value1 === null || value2 === null) {
    return false
  }
  if (typeof value1 !== typeof value2) {
    return false
  }
  const type = typeof value1
  if (type === 'number' || type === 'string' || type === 'boolean' || type === 'undefined') {
    return value1 === value2
  }
  if (type === 'function' || type === 'bigint') {
    return false
  }
  if (Array.isArray(value1) && Array.isArray(value2)) {
    if (value1.length !== value2.length) {
      return false
    }
    for (let i = 0; i < value1.length; i++) {
      if (!equals(value1[i], value2[i])) {
        return false
      }
    }
    return true
  }
  if (Array.isArray(value1) || Array.isArray(value2)) {
    return false
  }
  const keys = new Set<string>()
  for (const key in value1 as {}) {
    if (!equals((value1 as { [name: string]: unknown })[key], (value2 as { [name: string]: unknown })[key])) {
      return false
    }
    keys.add(key)
  }
  for (const key in value2 as {}) {
    if ((value2 as { [name: string]: unknown })[key] !== undefined && !keys.has(key)) {
      return false
    }
  }
  return true
}

/**
 * @public
 */
export type JsonSchema = ObjectSchema | ArraySchema | PrimarySchema | ReferenceSchema

interface ObjectSchema {
  type: 'object'
  properties: { [name: string]: JsonSchema }
  default?: unknown
}

interface ArraySchema {
  type: 'array'
  items: JsonSchema
  default?: unknown
}

interface PrimarySchema {
  type: 'number' | 'integer' | 'string' | 'boolean' | 'null'
  default?: unknown
}

interface ReferenceSchema {
  type: undefined,
  $ref: string
  definitions?: { [name: string]: JsonSchema }
}
