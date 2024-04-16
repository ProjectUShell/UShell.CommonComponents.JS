import { RelationSchema } from 'fusefx-modeldescription'

export function capitalizeFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function lowerFirstLetter(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1)
}

export function getValue(entity: any, fieldName: string): any | undefined {
  console.log('getValue', { e: entity, fn: fieldName })
  if (Object.keys(entity).find((k) => k == fieldName) !== undefined) {
    return entity[fieldName]
  }
  if (Object.keys(entity).find((k) => k == lowerFirstLetter(fieldName)) !== undefined) {
    return entity[lowerFirstLetter(fieldName)]
  }
  return entity[capitalizeFirstLetter(fieldName)]
}

export function getForeignKeyValue(entity: any, rel: RelationSchema) {
  const result: any | undefined = getValue(entity, rel.foreignKeyIndexName)
  if (result) return result
  return getValue(entity, rel.foreignNavigationName)?.key
}

export function setValue(entity: any, fieldName: string, valueToSet: any) {
  if (Object.keys(entity).find((k) => k == fieldName) !== undefined) {
    entity[fieldName] = valueToSet
  }
  if (Object.keys(entity).find((k) => k == lowerFirstLetter(fieldName)) !== undefined) {
    entity[lowerFirstLetter(fieldName)] = valueToSet
  }
  entity[capitalizeFirstLetter(fieldName)] = valueToSet
}
