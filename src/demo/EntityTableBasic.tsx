import React from 'react'
import EntityTable from '../components/guifad/_Organisms/EntityTable'
import { EntitySchema, FieldSchema } from 'fusefx-modeldescription'
import { ObjectGraphDataSource } from '../data/ObjectGraphDataSource'
import { LayoutDescriptionRoot } from '../[Move2LayoutDescription]/LayoutDescriptionRoot'
import { EntityLayout } from '../[Move2LayoutDescription]/EntityLayout'

const brandField: FieldSchema = new FieldSchema('Brand', 'string')
brandField.filterable = 1
const idField: FieldSchema = new FieldSchema('Id', 'int32')
idField.required = true
const carEntitySchema: EntitySchema = {
  fields: [
    idField,
    new FieldSchema('DateOfConstruction', 'datetime'),
    brandField,
    new FieldSchema('InternalField', 'string'),
  ],
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
)

const carLayout: EntityLayout = new EntityLayout('Car', [
  { fieldName: 'DateOfConstruction', displayLabel: 'Date of Construction' },
  {
    fieldName: 'Brand',
    displayLabel: 'Brand',
    dropdownStaticEntries: { Bmw: 'Bmw', Audi: 'Audi', Fiat: 'Fiat', Renault: 'Renault' },
  },
])
carLayout.tableFields = ['DateOfConstruction', 'Brand']
const layoutDescription: LayoutDescriptionRoot = {
  entityLayouts: [carLayout],
}

const EntityTableBasic = () => {
  // return <div></div>
  return (
    <div className='border-0 border-menuBorder p-2 bg-bg1 dark:bg-bg1dark'>
      <EntityTable
        dataSource={dataSource}
        entitySchema={carEntitySchema}
        layoutDescription={layoutDescription}
      ></EntityTable>
    </div>
  )
}

export default EntityTableBasic
