import React, { useState } from 'react'
import EntityTable from '../components/guifad/_Organisms/EntityTable'
import { EntitySchema, FieldSchema } from 'fusefx-modeldescription'
import { ObjectGraphDataSource } from '../data/ObjectGraphDataSource'
import { LayoutDescriptionRoot } from '../[Move2LayoutDescription]/LayoutDescriptionRoot'
import { EntityLayout } from '../[Move2LayoutDescription]/EntityLayout'

const brandField: FieldSchema = new FieldSchema('Brand', 'string')
brandField.filterable = 1
const carEntitySchema: EntitySchema = {
  fields: [
    new FieldSchema('Id', 'int32'),
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

const EntityTableOptions = () => {
  const [enableCrud, setEnableCrud] = useState(false)
  const [enableParentFilter, setEnableParentFilter] = useState(false)
  const [enableQueryEditor, setEnableQueryEditor] = useState(false)
  const [enableSearch, setEnableSearch] = useState(false)

  return (
    <div className='border-0 border-menuBorder p-2 bg-bg1 dark:bg-bg1dark'>
      <div className='flex gap-1'>
        <button
          className='p-2 rounded-sm border dark:border-bg8dark hover:bg-bg6 dark:hover:bg-bg6dark'
          onClick={() => setEnableCrud((c) => !c)}
        >
          {enableCrud ? 'Crud on' : 'Crud off'}
        </button>
        <button
          className='p-2 rounded-sm border dark:border-bg8dark hover:bg-bg6 dark:hover:bg-bg6dark'
          onClick={() => setEnableParentFilter((c) => !c)}
        >
          {enableParentFilter ? 'Parentfilter on' : 'Parentfilter off'}
        </button>
        <button
          className='p-2 rounded-sm border dark:border-bg8dark hover:bg-bg6 dark:hover:bg-bg6dark'
          onClick={() => setEnableQueryEditor((c) => !c)}
        >
          {enableQueryEditor ? 'Query-Editor on' : 'Query-Editor off'}
        </button>
        <button
          className='p-2 rounded-sm border dark:border-bg8dark hover:bg-bg6 dark:hover:bg-bg6dark'
          onClick={() => setEnableSearch((c) => !c)}
        >
          {enableSearch ? 'Search on' : 'Search off'}
        </button>
      </div>
      <EntityTable
        dataSource={dataSource}
        entitySchema={carEntitySchema}
        layoutDescription={layoutDescription}
        enableCrud={enableCrud}
        enableParentFilter={enableParentFilter}
        enableQueryEditor={enableQueryEditor}
        enableSearch={enableSearch}
        formStyleType={1}
        formLabelPosition='left'
      ></EntityTable>
    </div>
  )
}

export default EntityTableOptions
