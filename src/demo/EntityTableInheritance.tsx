import React from 'react'
import EntityTable, { EntityTable1 } from '../components/guifad/_Organisms/EntityTable'
import { EntitySchema, FieldSchema } from 'fusefx-modeldescription'
import { ObjectGraphDataSource } from '../data/ObjectGraphDataSource'
import { LayoutDescriptionRoot } from '../[Move2LayoutDescription]/LayoutDescriptionRoot'
import { EntityLayout } from '../[Move2LayoutDescription]/EntityLayout'

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

const animalLayout: EntityLayout = new EntityLayout('Animal', [
  { fieldName: 'DateOfBirth', displayLabel: 'Date of Birthn' },
  {
    fieldName: 'Color',
    displayLabel: 'Color',
    dropdownStaticEntries: { Bmw: 'Red', Audi: 'Black', Fiat: 'Brown', Renault: 'White' },
  },
])
animalLayout.displayLabel = 'Animal'
const catLayout: EntityLayout = new EntityLayout('Cat', [
  { fieldName: 'DateOfBirth', displayLabel: 'Date of Birthn' },
  {
    fieldName: 'Color',
    displayLabel: 'Color',
    dropdownStaticEntries: { Bmw: 'Red', Audi: 'Black', Fiat: 'Brown', Renault: 'White' },
  },
  {
    fieldName: 'BigCat',
    displayLabel: 'Big?',
  },
])
catLayout.displayLabel = 'Cat'
const dogLayout: EntityLayout = new EntityLayout('Dog', [
  { fieldName: 'DateOfBirth', displayLabel: 'Date of Birthn' },
  {
    fieldName: 'Color',
    displayLabel: 'Color',
    dropdownStaticEntries: { Bmw: 'Red', Audi: 'Black', Fiat: 'Brown', Renault: 'White' },
  },
  {
    fieldName: 'FightingDog',
    displayLabel: 'Fighting?',
  },
])
dogLayout.displayLabel = 'Dog'
const layoutDescription: LayoutDescriptionRoot = {
  entityLayouts: [animalLayout, catLayout, dogLayout],
}

const zoo: any = { cats: [], dogs: [], animals: [] }

const dataSourceAnimal: ObjectGraphDataSource = new ObjectGraphDataSource(
  animalEntitySchema,
  zoo,
  'animals',
  (g: any) => {
    console.log('Cat changed', g)
  },
)
const dataSourceCat: ObjectGraphDataSource = new ObjectGraphDataSource(
  catEntitySchema,
  zoo,
  'cats',
  (g: any) => {
    console.log('Cats changed 1', g)
    g.animals = []
    g.cats.forEach((c: any) => g.animals.push(c))
    g.dogs.forEach((c: any) => g.animals.push(c))
    console.log('Cats changed 2', g)
  },
)
const dataSourceDog: ObjectGraphDataSource = new ObjectGraphDataSource(
  dogEntitySchema,
  zoo,
  'dogs',
  (g: any) => {
    console.log('Dogs changed 1', g)
    g.animals = []
    g.cats.forEach((c: any) => g.animals.push(c))
    g.dogs.forEach((c: any) => g.animals.push(c))
    console.log('Dogs changed 2', g)
  },
)
// carLayout.tableFields = ['DateOfConstruction', 'Brand']

const EntityTableInheritance = () => {
  // return <div></div>
  return (
    <div className='border-0 border-menuBorder p-2 bg-bg1 dark:bg-bg1dark'>
      <EntityTable1
        dataSource={dataSourceAnimal}
        dataSourcesForm={[dataSourceCat, dataSourceDog]}
        layoutDescription={layoutDescription}
      ></EntityTable1>
    </div>
  )
}

export default EntityTableInheritance
