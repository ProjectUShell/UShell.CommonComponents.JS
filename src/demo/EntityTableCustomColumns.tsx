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
carLayout.tableFields = ['ComputedDesc', 'DateOfConstruction']
// carLayout.tableFields = ['DateOfConstruction', 'Brand']
const layoutDescription: LayoutDescriptionRoot = {
  entityLayouts: [carLayout],
}

const EntityTableCustomColumns = () => {
  // return <div></div>
  return (
    <div className='border-0 border-menuBorder p-2 bg-bg1 dark:bg-bg1dark'>
      <EntityTable
        dataSource={dataSource}
        entitySchema={carEntitySchema}
        layoutDescription={layoutDescription}
        customColumns={[
          {
            fieldName: 'ComputedDesc',
            fieldType: 'string',
            key: 'CompField',
            label: 'Computed Description',
            onRenderCell: (cv: any, r: any) => {
              return (
                <div className='whitespace-nowrap'>
                  {r.IsOldtimer ? <div>Old {r.Brand}</div> : <div>New {r.Brand}</div>}
                </div>
              )
            },
          },
        ]}
      ></EntityTable>
    </div>
  )
}

export default EntityTableCustomColumns
