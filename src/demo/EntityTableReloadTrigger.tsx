import React, { useState } from 'react'
import EntityTable from '../components/guifad/_Organisms/EntityTable'
import { EntitySchema, FieldSchema } from 'fusefx-modeldescription'
import { ObjectGraphDataSource } from '../data/ObjectGraphDataSource'
import { LayoutDescriptionRoot } from '../[Move2LayoutDescription]/LayoutDescriptionRoot'
import { EntityLayout } from '../[Move2LayoutDescription]/EntityLayout'

const brandField: FieldSchema = new FieldSchema('Brand', 'string')
brandField.filterable = 1
const idField: FieldSchema = new FieldSchema('Id', 'int32')
idField.required = true
const isOldtimerField: FieldSchema = new FieldSchema('IsOldtimer', 'boolean')
isOldtimerField.required = true
const carEntitySchema: EntitySchema = {
  fields: [idField, new FieldSchema('DateOfConstruction', 'datetime'), brandField, isOldtimerField],
  indices: [{ name: 'Id', memberFieldNames: ['Id'], unique: true }],
  inheritedEntityName: '',
  isBlEntrypoint: false,
  name: 'Car',
  namePlural: 'Cars',
  primaryKeyIndexName: 'Id',
  summary: 'Cars...',
}

const dataSource: ObjectGraphDataSource = new ObjectGraphDataSource(
  carEntitySchema,
  { Cars: [{ Id: 1, DateOfConstruction: '2000-01-01', Brand: 'Bmw' }] },
  'Cars',
  (g: any) => console.log('Entity changed', g),
)

const carLayout: EntityLayout = new EntityLayout('Car', [
  { fieldName: 'DateOfConstruction', displayLabel: 'Date of Construction' },
  {
    fieldName: 'Brand',
    displayLabel: 'Brand',
    dropdownStaticEntries: { Bmw: 'Bmw', Audi: 'Audi', Fiat: 'Fiat', Renault: 'Renault' },
  },
])
carLayout.displayLabel = 'Car'
// carLayout.tableFields = ['DateOfConstruction', 'Brand']
const layoutDescription: LayoutDescriptionRoot = {
  entityLayouts: [carLayout],
}

const EntityTableReloadTrigger = () => {
  const [r, setR] = useState(0)

  return (
    <div className='border-0 border-menuBorder p-2 bg-bg1 dark:bg-bg1dark'>
      <button
        className='p-2 cursor-pointer'
        onClick={() => {
          const newEntity: any = { Id: 123, DateOfConstruction: '2000-01-01', Brand: 'Bmw' }
          dataSource.entityInsertMethod(newEntity)
          setR((x) => x + 1)
        }}
      >
        Trigger Reload
      </button>
      <EntityTable
        dataSource={dataSource}
        entitySchema={carEntitySchema}
        layoutDescription={layoutDescription}
        reloadTriggerObject={r}
      ></EntityTable>
    </div>
  )
}

export default EntityTableReloadTrigger
