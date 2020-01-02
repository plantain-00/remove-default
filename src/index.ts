/**
 * @public
 */
export function removeDefault(target: unknown, schema: unknown) {
  const jsonSchema = schema as JsonSchema
  const getReference = (name: string) => {
    if (jsonSchema.definitions) {
      return jsonSchema.definitions[name.substring('#/definitions/'.length)]
    }
    return undefined
  }
  return removeDefaultInternally(target, jsonSchema, getReference)
}

function removeDefaultInternally(
  target: unknown,
  schema: JsonSchema,
  getReference: (name: string) => JsonSchema | undefined
) {
  if (schema.$ref) {
    const reference = getReference(schema.$ref)
    if (reference) {
      schema = reference
    }
  }
  if (schema.type === 'object' && schema.properties) {
    for (const propertyName in schema.properties) {
      const property = schema.properties[propertyName]
      const value = (target as { [name: string]: unknown })[propertyName]
      const result = removeDefaultInternally(value, property, getReference)
      if (result === undefined) {
        delete (target as { [name: string]: unknown })[propertyName]
      }
    }
  }
  if (schema.type === 'array' && Array.isArray(target)) {
    for (let i = 0; i < target.length; i++) {
      const item = target[i]
      const result = removeDefaultInternally(item, schema.items, getReference)
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

type JsonSchema = ObjectSchema | ArraySchema | PrimarySchema

interface CommonSchema {
  default?: unknown
  $ref?: string
  definitions?: { [name: string]: JsonSchema }
}

interface ObjectSchema extends CommonSchema {
  type: 'object'
  properties: { [name: string]: JsonSchema }
}

interface ArraySchema extends CommonSchema {
  type: 'array'
  items: JsonSchema
}

interface PrimarySchema extends CommonSchema {
  type: 'number' | 'integer' | 'string' | 'boolean' | 'null' | undefined
}
