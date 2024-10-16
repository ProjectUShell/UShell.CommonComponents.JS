import { EntitySchema, FieldSchema } from 'fusefx-modeldescription'

export function copyValueFields(from: any, to: any): void {
  for (let p in from) {
    if (typeof from[p] == 'object') continue
    to[p] = from[p]
  }
}

export function fullfillsSchema(o: any, entitySchema: EntitySchema): boolean {
  for (let field of entitySchema.fields) {
    if (!(field.name in o)) return false
  }
  return true
}
