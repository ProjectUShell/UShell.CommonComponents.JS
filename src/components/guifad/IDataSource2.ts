import { EntitySchema } from 'fusefx-modeldescription'
export interface IDataSource2 {
  dataSourceUid: string
  entitySchema?: EntitySchema
  readonly entityFactoryMethod: (entityName: string) => object
  readonly entityUpdateMethod: (entityName: string, entity: object) => Promise<boolean>
  readonly entityInsertMethod: (entityName: string, entity: object) => Promise<boolean>
  readonly entityDeleteMethod: (entityName: string, entity: object) => Promise<boolean>
  getRecords(entityName: string): Promise<object[]>
  getRecord(entityName: string, identityFields: object): Promise<object>
}
//# sourceMappingURL=iDataSource.d.ts.map
