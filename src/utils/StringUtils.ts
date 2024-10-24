import { RelationSchema } from 'fusefx-modeldescription'

export function capitalizeFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function lowerFirstLetter(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1)
}

export function getValue(entity: any, fieldName: string): any | undefined {
  if (fieldName in entity) {
    return entity[fieldName]
  }
  if (lowerFirstLetter(fieldName) in entity) {
    return entity[lowerFirstLetter(fieldName)]
  }
  return entity[capitalizeFirstLetter(fieldName)]
}

export function getForeignKeyValue(entity: any, rel: RelationSchema) {
  const result: any | undefined = getValue(entity, rel.foreignKeyIndexName)

  if (result) return result
  if (!rel.foreignNavigationName || rel.foreignNavigationName == '') return undefined
  const navValue: any = getValue(entity, rel.foreignNavigationName)
  if (!navValue) return undefined
  if ('key' in navValue) {
    return navValue.key
  }
  if ('Key' in navValue) {
    return navValue.Key
  }
  if ('id' in navValue) {
    return navValue.id
  }
  if ('Id' in navValue) {
    return navValue.Id
  }
  return navValue?.key
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
