import React from 'react'
import EntityTable from '../components/guifad/_Organisms/EntityTable'
import { EntitySchema, FieldSchema } from 'fusefx-modeldescription'
import { ObjectGraphDataSource } from '../data/ObjectGraphDataSource'
import { LayoutDescriptionRoot } from '../[Move2LayoutDescription]/LayoutDescriptionRoot'
import { EntityLayout } from '../[Move2LayoutDescription]/EntityLayout'

const idField: FieldSchema = new FieldSchema('Id', 'int32')
idField.required = true
const typeField: FieldSchema = new FieldSchema('WorkItemType', 'string')
typeField.filterable = 1
const workItemSchema: EntitySchema = {
  fields: [
    idField,
    new FieldSchema('DueDate', 'datetime'),
    new FieldSchema('Title', 'string'),
    typeField,
    new FieldSchema('ParentId', 'int32'),
  ],
  indices: [{ name: 'Id', memberFieldNames: ['Id'], unique: true }],
  inheritedEntityName: '',
  isBlEntrypoint: false,
  name: 'WorkItem',
  namePlural: 'WorkItems',
  primaryKeyIndexName: 'Id',
  summary: 'WorkItems...',
}

const dataSource: ObjectGraphDataSource = new ObjectGraphDataSource(
  workItemSchema,
  {
    WorkItems: [
      { Id: 1, Title: 'Nested Table', DueDate: '2000-01-01', WorkItemType: 'Feature', ParentId: 0 },
      {
        Id: 2,
        Title: 'Nested Table Api',
        DueDate: '2000-01-01',
        WorkItemType: 'ChangeRequest',
        ParentId: 1,
      },
      { Id: 3, Title: 'IsParent Param', DueDate: '2000-01-01', WorkItemType: 'Pbi', ParentId: 2 },
      {
        Id: 4,
        Title: 'Test IsParent in Demo',
        DueDate: '2000-01-01',
        WorkItemType: 'Pbi',
        ParentId: 2,
      },
      {
        Id: 5,
        Title: 'Nested Table Implementation',
        DueDate: '2000-01-01',
        WorkItemType: 'ChangeRequest',
        ParentId: 1,
      },
      {
        Id: 6,
        Title: 'Function: Calculate Nesting',
        DueDate: '2000-01-01',
        WorkItemType: 'Pbi',
        ParentId: 5,
      },
      {
        Id: 7,
        Title: 'Implement Nested Styling',
        DueDate: '2000-01-01',
        WorkItemType: 'Pbi',
        ParentId: 5,
      },
      { Id: 8, Title: 'Make Dinner', DueDate: '2000-01-01', WorkItemType: 'Feature', ParentId: 0 },
      {
        Id: 9,
        Title: 'Make Appetizer',
        DueDate: '2000-01-01',
        WorkItemType: 'ChangeRequest',
        ParentId: 8,
      },
      { Id: 10, Title: 'Cook Shrimps', DueDate: '2000-01-01', WorkItemType: 'Pbi', ParentId: 9 },
      { Id: 11, Title: 'Season Shrimps', DueDate: '2000-01-01', WorkItemType: 'Pbi', ParentId: 9 },
      {
        Id: 12,
        Title: 'Make Main Course',
        DueDate: '2000-01-01',
        WorkItemType: 'ChangeRequest',
        ParentId: 8,
      },
      { Id: 13, Title: 'Make Steak', DueDate: '2000-01-01', WorkItemType: 'Pbi', ParentId: 12 },
      { Id: 14, Title: 'Make Rice', DueDate: '2000-01-01', WorkItemType: 'Pbi', ParentId: 12 },
    ],
  },
  'WorkItems',
  (g: any) => console.log('Entity changed', g),
)

const workItemLayout: EntityLayout = new EntityLayout('WorkItem', [
  { fieldName: 'DueDate', displayLabel: 'Due Date' },
  {
    fieldName: 'WorkItemType',
    displayLabel: 'Type',
    dropdownStaticEntries: { Feature: 'Feature', ChangeRequest: 'ChangeRequest', Pbi: 'Pbi' },
  },
])
workItemLayout.displayLabel = 'Work Item'
workItemLayout.tableFields = ['Id', 'Title', 'WorkItemType', 'DueDate']
const layoutDescription: LayoutDescriptionRoot = {
  entityLayouts: [workItemLayout],
}

function isParent(potentialChild: any, potentialParent: any): boolean {
  return potentialChild.ParentId == potentialParent.Id
}

const EntityTableWithNesting = () => {
  // return <div></div>
  return (
    <div className='border-0 border-menuBorder p-2 bg-bg1 dark:bg-bg1dark'>
      <EntityTable
        dataSource={dataSource}
        entitySchema={workItemSchema}
        layoutDescription={layoutDescription}
        rowHeight={4}
        isParent={isParent}
      ></EntityTable>
    </div>
  )
}

export default EntityTableWithNesting
