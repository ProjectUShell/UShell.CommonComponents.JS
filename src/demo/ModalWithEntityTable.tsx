import React, { useState } from 'react'
import { FieldSchema, EntitySchema } from 'fusefx-modeldescription'
import { EntityLayout } from '../[Move2LayoutDescription]/EntityLayout'
import { LayoutDescriptionRoot } from '../[Move2LayoutDescription]/LayoutDescriptionRoot'
import { ObjectGraphDataSource } from '../data/ObjectGraphDataSource'
import EntityTable from '../components/guifad/_Organisms/EntityTable'
import Modal3 from '../_Atoms/Modal3'

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
  {
    Cars: [
      { Id: 1, DateOfConstruction: '2000-01-01', Brand: 'Bmw' },
      { Id: 2, DateOfConstruction: '2000-01-01', Brand: 'Bmw' },
      { Id: 3, DateOfConstruction: '2000-01-01', Brand: 'Bmw' },
      { Id: 4, DateOfConstruction: '2000-01-01', Brand: 'Bmw' },
      { Id: 5, DateOfConstruction: '2000-01-01', Brand: 'Bmw' },
      { Id: 6, DateOfConstruction: '2000-01-01', Brand: 'Bmw' },
      { Id: 7, DateOfConstruction: '2000-01-01', Brand: 'Bmw' },
      { Id: 8, DateOfConstruction: '2000-01-01', Brand: 'Bmw' },
    ],
  },
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

const ModalWithEntityTable = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className='hover:bg-bg1 dark:hover:bg-bg1dark p-2 border dark:border-bg8dark'
        onClick={() => setOpen((o) => !o)}
      >
        Toggle Open
      </button>
      {open && (
        <Modal3
          top='20px'
          bottom='20px'
          left='20%'
          right='20%'
          height='100%'
          title='Example Modal'
          terminate={() => setOpen(false)}
        >
          <EntityTable
            dataSource={dataSource}
            entitySchema={carEntitySchema}
            layoutDescription={layoutDescription}
          ></EntityTable>
        </Modal3>
      )}
    </>
  )
}

export default ModalWithEntityTable
