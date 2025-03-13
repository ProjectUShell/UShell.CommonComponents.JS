//import { BehaviorSubject, Observable, from, of } from 'rxjs';
//import { IDataSource } from 'ushell-modulebase';
//import { EntitySchema } from 'fusefx-modeldescription';

import { EntitySchema } from 'fusefx-modeldescription'
import {
  LogicalExpression,
  PagingParams,
  SortingField,
  PaginatedList,
} from 'fusefx-repositorycontract'
import { IDataSource } from 'ushell-modulebase'
import { EntitySchemaService } from './EntitySchemaService'

export class LocalStoreDataSource implements IDataSource {
  constructor(dataSourceUid: string, entitySchema?: EntitySchema) {
    this.dataSourceUid = dataSourceUid
    this.entitySchema = entitySchema
    this.reload()
  }
  extractIdentityFrom(entity: object): object {
    throw new Error('Method not implemented.')
  }
  getRecord(identityFields: object): Promise<object> {
    return this.getRecords().then((records) =>
      records.page.find(
        (r) => EntitySchemaService.getPrimaryKey(this.entitySchema!, r) == identityFields,
      ),
    )
  }

  private addOrUpdate(entity: object): Promise<boolean> {
    let found: any = EntitySchemaService.findEntryWithMatchingIdentity(
      this.records,
      entity,
      this.entitySchema!,
    )
    if (found) {
      this.records[this.records.indexOf(found)] = entity
      this.persist()
    } else {
      this.records.push(entity)
      this.persist()
    }
    return new Promise<boolean>((res) => res(found))
  }

  entityUpdateMethod: (entity: any[]) => Promise<boolean> = this.addOrUpdate
  entityInsertMethod: (entity: any[]) => Promise<boolean> = this.addOrUpdate
  entityDeleteMethod(entity: any[]): Promise<boolean> {
    // let found: any = this.pickEntityByIdentityOf(entity)
    let found: any = EntitySchemaService.findEntryWithMatchingIdentity(
      this.records,
      entity,
      this.entitySchema!,
    )
    if (found) {
      this.records = this.records.splice(this.records.indexOf(found), 1)
      this.persist()
    }
    return new Promise<boolean>((res) => res(found))
  }
  containsIdentityOf(entity: object): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
  getRecords(
    filter?: LogicalExpression,
    pagingParams?: PagingParams,
    sortingParams?: SortingField[],
  ): Promise<PaginatedList> {
    return new Promise((res) => res({ page: this.records, total: this.records.length }))
  }
  getEntityRefs(
    filter?: LogicalExpression,
    pagingParams?: PagingParams,
    sortingParams?: SortingField[],
  ): Promise<PaginatedList> {
    return new Promise((res) =>
      res({
        page: this.records.map((r) => {
          return { key: EntitySchemaService.getPrimaryKey(this.entitySchema!, r), label: 'hi' }
        }),
        total: this.records.length,
      }),
    )
  }

  private records: object[] = []

  private reload() {
    let raw = localStorage.getItem('datastore_' + this.dataSourceUid)
    if (raw) {
      this.records = JSON.parse(raw) as object[]
    } else {
      this.records = []
    }
  }

  public dataSourceUid: string
  public entitySchema?: EntitySchema

  public entityFactoryMethod(): any {
    return EntitySchemaService.createNewEntity(this.entitySchema!)
  }
  // public readonly entityUpdateMethod: (entity: object)=>Observable<boolean>;
  // public readonly entityInsertMethod: (entity: object)=>Observable<boolean> = null;
  // public readonly entityDeleteMethod: (entity: object)=>Observable<boolean> = null;

  // public extractIdentityFrom(entity: object): object {
  //   EntitySchemaService.findEntryWithMatchingIdentity
  //   if (this.entitySchema) {
  //     let iFound = this.entitySchema.indices.findIndex(
  //       (itm, idx, arr) => this.entitySchema.primaryKeyIndexName == itm.name,
  //     )
  //     let pkFieldNames = this.entitySchema.indices[iFound].memberFieldNames
  //     let newObj = {}
  //     for (var pkFieldName of pkFieldNames) {
  //       if (!entity[pkFieldName]) {
  //         console.error("Entity does not have the required key property '" + pkFieldName + "'")
  //         newObj[pkFieldName] = null
  //       } else {
  //         newObj[pkFieldName] = entity[pkFieldName]
  //       }
  //     }
  //     return newObj
  //   } else {
  //     return entity
  //   }
  // }

  // private pickEntityByIdentityOf(entity: object): object {
  //   this.reload()
  //   let identityToSerach = JSON.stringify(this.extractIdentityFrom(entity))
  //   for (var record of this.records) {
  //     if (JSON.stringify(this.extractIdentityFrom(record)) == identityToSerach) {
  //       return record
  //     }
  //   }
  //   return null
  // }

  // public containsIdentityOf(entity: object): Observable<boolean>{
  //    let found = this.pickEntityByIdentityOf(entity);
  //     if(found){
  //         console.warn(entity);
  //         return new BehaviorSubject<boolean>(true);
  //     }
  //     else{
  //         console.info(entity);
  //         return new BehaviorSubject<boolean>(false);
  //     }
  // }

  // Only for this datasource
  public setAllRecords(records: object[]) {
    this.records = records
    this.persist()
  }

  private persist() {
    localStorage.setItem('datastore_' + this.dataSourceUid, JSON.stringify(this.records))
  }

  // public getRecords(): Observable<object[]>{
  //     this.reload();
  //     return new BehaviorSubject<object[]>(this.records);
  // }

  // public getRecord(identityFields: object): Observable<object> {
  //   let foundEntity = this.pickEntityByIdentityOf(identityFields)
  //   console.warn('foundeentity:')
  //   console.warn(foundEntity)
  //   return from([foundEntity])
  // }
}
