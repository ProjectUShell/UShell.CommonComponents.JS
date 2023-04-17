//import { BehaviorSubject, Observable, from, of } from 'rxjs';
//import { IDataSource } from 'ushell-modulebase';
//import { EntitySchema } from 'fusefx-modeldescription';

export class LocalStoreDataSource {
  //TODO: implements IDataSource {
  /*
    constructor(dataSourceUid: string, providerArguments: any, entitySchema?: EntitySchema){
        this.dataSourceUid=dataSourceUid;
        this.entitySchema = entitySchema;
        if(providerArguments['allowInsert'] == true){
            this.entityInsertMethod = (entity)=> {
                let found = this.pickEntityByIdentityOf(entity);
                if(found){
                    //already exists
                    return of(false);
                }
                else{
                    this.records.push(entity);
                    this.persist();
                     return of(true);
                }
            };
        }
        if(providerArguments['allowUpdate'] == true){
            this.entityUpdateMethod = (entity)=> {
                let found = this.pickEntityByIdentityOf(entity);
                if(found){
                    //replace
                    this.records[this.records.indexOf(found)] = entity;
                    this.persist();
                    return of(true);
                }
                else{
                    //not exists
                    return of(false);
                }
            };
        }
        if(providerArguments['allowDelete'] == true){
            this.entityDeleteMethod = (entity)=> {
                let found = this.pickEntityByIdentityOf(entity);
                if(found){
                    this.records = this.records.splice(this.records.indexOf(found),1);
                    this.persist();
                    return of(true);
                }
                else{
                    //not exists
                    return of(false);
                }
            };
        }
        this.reload();
    }

    private records: object[] = [];

    private reload(){
        let raw = localStorage.getItem("datastore_" + this.dataSourceUid);
        if (raw){
          this.records = (JSON.parse(raw) as object[]);
        }
        else{
          this.records = [];
        }
    }

    public dataSourceUid: string;
    public entitySchema?: EntitySchema;

    public readonly entityFactoryMethod: ()=>object = null;
    public readonly entityUpdateMethod: (entity: object)=>Observable<boolean>;
    public readonly entityInsertMethod: (entity: object)=>Observable<boolean> = null;
    public readonly entityDeleteMethod: (entity: object)=>Observable<boolean> = null;

    public extractIdentityFrom(entity: object): object {
        if(this.entitySchema){
            let iFound =  this.entitySchema.indices.findIndex(
                (itm,idx,arr)=>this.entitySchema.primaryKeyIndexName == itm.name
            );
            let pkFieldNames = this.entitySchema.indices[iFound].memberFieldNames;
            let newObj = {};
            for (var pkFieldName of pkFieldNames){
                if(!entity[pkFieldName]){
                    console.error("Entity does not have the required key property '" + pkFieldName + "'");
                    newObj[pkFieldName] = null;
                }
                else{
                    newObj[pkFieldName] = entity[pkFieldName];
                }
            }
            return newObj;
        }
        else{
            return entity;
        }
    }

    private pickEntityByIdentityOf(entity: object): object{
        this.reload();
        let identityToSerach = JSON.stringify(this.extractIdentityFrom(entity));
        for (var record of this.records){
            if(JSON.stringify(this.extractIdentityFrom(record)) == identityToSerach ){
              return record;
            }
         }
         return null;
    }

    public containsIdentityOf(entity: object): Observable<boolean>{
       let found = this.pickEntityByIdentityOf(entity);
        if(found){
            //console.warn(entity);
            return new BehaviorSubject<boolean>(true);
        }
        else{
            //console.info(entity);
            return new BehaviorSubject<boolean>(false);
        }
    }

    //Only for this datasource
    public setAllRecords( records: object[]){
        this.records = records;
        this.persist();
    }

    private persist(){
        localStorage.setItem("datastore_" + this.dataSourceUid, JSON.stringify(this.records));
    }

    public getRecords(): Observable<object[]>{
        this.reload();
        return new BehaviorSubject<object[]>(this.records);
    }

    public getRecord(identityFields: object): Observable<object>{
        let foundEntity = this.pickEntityByIdentityOf(identityFields);
        //console.warn("foundeentity:");
        //console.warn(foundEntity);
        return from([foundEntity]);
    }
*/
}
