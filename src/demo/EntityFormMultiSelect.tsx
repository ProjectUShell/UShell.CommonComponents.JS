import React from 'react'
import EntityTable from '../components/guifad/_Organisms/EntityTable'
import { EntitySchema, FieldSchema } from 'fusefx-modeldescription'
import { ObjectGraphDataSource } from '../data/ObjectGraphDataSource'
import { LayoutDescriptionRoot } from '../[Move2LayoutDescription]/LayoutDescriptionRoot'
import { EntityLayout } from '../[Move2LayoutDescription]/EntityLayout'
import EntityForm from '../components/guifad/_Organisms/EntityForm'

const brandField: FieldSchema = new FieldSchema('Brand', 'string')
brandField.filterable = 1
const tagsField: FieldSchema = new FieldSchema('Tags', 'string')
brandField.filterable = 1
tagsField.required = false
const idField: FieldSchema = new FieldSchema('Id', 'int32')
idField.required = true
const carEntitySchema: EntitySchema = {
  fields: [idField, brandField, tagsField],
  indices: [{ name: 'Id', memberFieldNames: ['Id'], unique: true }],
  inheritedEntityName: '',
  isBlEntrypoint: false,
  name: 'Car',
  namePlural: 'Cars',
  primaryKeyIndexName: 'Id',
  summary: 'Cars...',
}

const car: any = { Id: 1, DateOfConstruction: '2000-01-01', Brand: 'Bmw' }
const dataSource: ObjectGraphDataSource = new ObjectGraphDataSource(
  carEntitySchema,
  {},
  '',
  (g: any) => console.log('Entity changed', g),
)

const carLayout: EntityLayout = new EntityLayout('Car', [
  { fieldName: 'DateOfConstruction', displayLabel: 'Date of Construction' },
  {
    fieldName: 'Brand',
    displayLabel: 'Brand',
    dropdownStaticEntries: { Bmw: 'Bmw', Audi: 'Audi', Fiat: 'Fiat', Renault: 'Renault' },
  },
  {
    fieldName: 'Tags',
    displayLabel: 'Tags',
    dropdownStaticEntries: { Supercool: 'Supercool', TooExpensive: 'TooExpensive', Nice: 'Nice' },
    multiSelectSeparator: ',',
  },
])

const EntityFormMultiSelect = () => {
  // return <div></div>
  return (
    <div className='border-0 border-menuBorder p-2 bg-bg1 dark:bg-bg1dark w-full'>
      <EntityForm
        dataSource={dataSource}
        entityLayout={carLayout}
        dirty={true}
        entity={{}}
        isCreation={true}
        onSaved={(e) => {}}
      ></EntityForm>
    </div>
  )
}

export default EntityFormMultiSelect
