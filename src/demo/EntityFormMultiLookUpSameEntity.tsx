import React, { useState } from 'react'
import EntityTable from '../components/guifad/_Organisms/EntityTable'
import { EntitySchema, FieldSchema, RelationSchema, SchemaRoot } from 'fusefx-modeldescription'
import { ObjectGraphDataSource } from '../data/ObjectGraphDataSource'
import { LayoutDescriptionRoot } from '../[Move2LayoutDescription]/LayoutDescriptionRoot'
import { EntityLayout } from '../[Move2LayoutDescription]/EntityLayout'
import EntityForm from '../components/guifad/_Organisms/EntityForm'
import { IDataSource, IDataSourceManagerWidget } from 'ushell-modulebase'

const manufacturerNameFieldSchema: FieldSchema = new FieldSchema('Name', 'string')
manufacturerNameFieldSchema.identityLabel = true
const manufacturerEntitySchema: EntitySchema = {
  fields: [new FieldSchema('Id', 'int32'), manufacturerNameFieldSchema],
  indices: [{ name: 'Id', memberFieldNames: ['Id'], unique: true }],
  inheritedEntityName: '',
  isBlEntrypoint: false,
  name: 'Manufacturer',
  namePlural: 'Manufacturers',
  primaryKeyIndexName: 'Id',
  summary: 'Manufacturers...',
}

const carWorld: any = { cars: [], manufacturers: [] }

const manufacturerIdField: FieldSchema = new FieldSchema('ManufacturerId', 'int32')
const originalManufacturerIdField: FieldSchema = new FieldSchema('OriginalManufacturerId', 'int32')
const idField: FieldSchema = new FieldSchema('Id', 'int32')
idField.required = true
const carEntitySchema: EntitySchema = {
  fields: [idField, manufacturerIdField, originalManufacturerIdField],
  indices: [{ name: 'Id', memberFieldNames: ['Id'], unique: true }],
  inheritedEntityName: '',
  isBlEntrypoint: false,
  name: 'Car',
  namePlural: 'Cars',
  primaryKeyIndexName: 'Id',
  summary: 'Cars...',
}

const fkRelation1: RelationSchema = new RelationSchema()
fkRelation1.foreignKeyIndexName = 'ManufacturerId'
fkRelation1.foreignEntityName = 'Car'
fkRelation1.primaryEntityName = 'Manufacturer'

const fkRelation2: RelationSchema = new RelationSchema()
fkRelation2.foreignKeyIndexName = 'OriginalManufacturerId'
fkRelation2.foreignEntityName = 'Car'
fkRelation2.primaryEntityName = 'Manufacturer'

const schemaRoot: SchemaRoot = new SchemaRoot()
schemaRoot.entities = [carEntitySchema, manufacturerEntitySchema]
schemaRoot.relations = [fkRelation1, fkRelation2]

const car: any = { Id: 1, DateOfConstruction: '2000-01-01', Brand: 'Bmw' }

const carLayout: EntityLayout = new EntityLayout('Car', [
  { fieldName: 'DateOfConstruction', displayLabel: 'Date of Construction' },
  {
    fieldName: 'Brand',
    displayLabel: 'Brand',
    dropdownStaticEntries: { Bmw: 'Bmw', Audi: 'Audi', Fiat: 'Fiat', Renault: 'Renault' },
  },
  {
    fieldName: 'ManufacturerId',
    displayLabel: 'Manufacturer',
    allowCrudForLookUp: true,
  },
  {
    fieldName: 'OriginalManufacturerId',
    displayLabel: 'Original Manufacturer',
    allowCrudForLookUp: true,
  },
])

const EntityFormMultiLookUpSameEntity = () => {
  const [r, setR] = useState(0)
  const carDataSource: ObjectGraphDataSource = new ObjectGraphDataSource(
    carEntitySchema,
    carWorld,
    'cars',
    (g: any) => {
      console.log('Car changed', g)
      setR((r) => r + 1)
    },
  )
  const manufacturerDataSource: ObjectGraphDataSource = new ObjectGraphDataSource(
    manufacturerEntitySchema,
    carWorld,
    'manufacturers',
    (g: any) => {
      console.log('Manufacturer changed', g)
      setR((r) => r + 1)
    },
  )

  class MyDataSourceManager implements IDataSourceManagerWidget {
    tryGetDataSource(entityName: string, storeName?: string): IDataSource | null {
      if (entityName == 'Car') return carDataSource
      if (entityName == 'Manufacturer') return manufacturerDataSource
      throw new Error('Invalid EntityName')
    }
    getSchemaRoot(): SchemaRoot {
      return schemaRoot
    }
  }
  const dataSourceManager: MyDataSourceManager = new MyDataSourceManager()

  // return <div></div>
  return (
    <div className='border-0 border-menuBorder p-2 bg-bg1 dark:bg-bg1dark w-full'>
      <EntityForm
        dataSource={carDataSource}
        dataSourceManager={dataSourceManager}
        entityLayout={carLayout}
        dirty={true}
        entity={{}}
        isCreation={true}
        onSaved={(e) => {}}
        labelPosition='left'
      ></EntityForm>
    </div>
  )
}

export default EntityFormMultiLookUpSameEntity
