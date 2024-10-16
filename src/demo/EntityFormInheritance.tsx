import React from 'react'
import EntityTable from '../components/guifad/_Organisms/EntityTable'
import { EntitySchema, FieldSchema } from 'fusefx-modeldescription'
import { ObjectGraphDataSource } from '../data/ObjectGraphDataSource'
import { LayoutDescriptionRoot } from '../[Move2LayoutDescription]/LayoutDescriptionRoot'
import { EntityLayout } from '../[Move2LayoutDescription]/EntityLayout'
import EntityForm, { EntityForm1 } from '../components/guifad/_Organisms/EntityForm'

const colorField: FieldSchema = new FieldSchema('Color', 'string')
colorField.filterable = 1
const idField: FieldSchema = new FieldSchema('Id', 'int32')
idField.required = true

const animalEntitySchema: EntitySchema = {
  fields: [idField, new FieldSchema('DateOfBirth', 'datetime'), colorField],
  indices: [{ name: 'Id', memberFieldNames: ['Id'], unique: true }],
  inheritedEntityName: '',
  isBlEntrypoint: false,
  name: 'Animal',
  namePlural: 'Animals',
  primaryKeyIndexName: 'Id',
  summary: 'Animals...',
}
const catEntitySchema: EntitySchema = {
  fields: [
    idField,
    new FieldSchema('DateOfBirth', 'datetime'),
    colorField,
    new FieldSchema('BigCat', 'bool'),
  ],
  indices: [{ name: 'Id', memberFieldNames: ['Id'], unique: true }],
  inheritedEntityName: '',
  isBlEntrypoint: false,
  name: 'Cat',
  namePlural: 'Cats',
  primaryKeyIndexName: 'Id',
  summary: 'Cats...',
}
const dogEntitySchema: EntitySchema = {
  fields: [
    idField,
    new FieldSchema('DateOfBirth', 'datetime'),
    colorField,
    new FieldSchema('FightingDog', 'bool'),
  ],
  indices: [{ name: 'Id', memberFieldNames: ['Id'], unique: true }],
  inheritedEntityName: '',
  isBlEntrypoint: false,
  name: 'Dog',
  namePlural: 'Dogs',
  primaryKeyIndexName: 'Id',
  summary: 'Dogs...',
}

const animal: any = { Id: 1, DateOfBirth: '2000-01-01', Color: 'Red' }
const cat: any = { Id: 1, DateOfBirth: '2000-01-01', Color: 'Red', BigCat: false }
const dog: any = { Id: 1, DateOfBirth: '2000-01-01', Color: 'Red', FightingDog: true }
const dataSource: ObjectGraphDataSource = new ObjectGraphDataSource(
  animalEntitySchema,
  animal,
  '',
  (g: any) => console.log('Entity changed', g),
)
const dataSourceCat: ObjectGraphDataSource = new ObjectGraphDataSource(
  catEntitySchema,
  cat,
  '',
  (g: any) => console.log('Cat changed', g),
)
const dataSourceDog: ObjectGraphDataSource = new ObjectGraphDataSource(
  dogEntitySchema,
  dog,
  '',
  (g: any) => console.log('Dog changed', g),
)

const animalLayout: EntityLayout = new EntityLayout('Car', [
  { fieldName: 'DateOfBirth', displayLabel: 'Date of Birthn' },
  {
    fieldName: 'Color',
    displayLabel: 'Color',
    dropdownStaticEntries: { Bmw: 'Red', Audi: 'Black', Fiat: 'Brown', Renault: 'White' },
  },
])

const EntityFormInheritance = () => {
  // return <div></div>
  return (
    <div className='border-0 border-menuBorder p-2 bg-bg1 dark:bg-bg1dark w-full'>
      <EntityForm1
        dataSources={[dataSource, dataSourceCat, dataSourceDog]}
        entityLayout={animalLayout}
        dirty={true}
        entity={{}}
        isCreation={true}
        onSaved={() => {}}
      ></EntityForm1>
    </div>
  )
}

export default EntityFormInheritance
