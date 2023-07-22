import { EntitySchema, SchemaRoot } from 'fusefx-modeldescription'

export class EntitySchemaService {
  static getRelations(schemaRoot: SchemaRoot, entitySchema: EntitySchema, includeLookups: boolean) {
    return schemaRoot.relations.filter(
      (r) => r.primaryEntityName == entitySchema.name && (includeLookups || !r.isLookupRelation),
    )
  }
}
