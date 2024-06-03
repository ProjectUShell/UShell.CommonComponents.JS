import React, { useState } from 'react'
import { LogicalExpression } from 'fusefx-repositorycontract'
import DropdownButton from '../../../_Atoms/DropdownButton'
import LogicalExpressionEditor from './LogicalExpressionEditor'
import { FieldSchema, RelationSchema } from 'fusefx-modeldescription'
import XMarkIcon from '../../../_Icons/XMarkIcon'
import { FieldPredicate } from 'fusefx-repositorycontract/lib/FieldPredicate'
import { IDataSourceManagerBase } from 'ushell-modulebase'

const FilterTag: React.FC<{
  filter: LogicalExpression
  fields: FieldSchema[]
  fkRelations: RelationSchema[]
  onUpdateFilter: (f: LogicalExpression) => void
  onDelete: () => void
  dataSourceManager: IDataSourceManagerBase
}> = ({ filter, fields, fkRelations, onUpdateFilter, onDelete, dataSourceManager }) => {
  const [open, setOpen] = useState(false)

  function getLabel(f: LogicalExpression) {
    let result = ''
    const numArgs: number = f.predicates.length + f.subTree.length
    for (let i = 0; i < f.predicates.length; ++i) {
      const r: FieldPredicate = f.predicates[i]
      if (numArgs == 1) {
        result += `${r.fieldName} ${r.operator} ${r.value}`
      } else {
        result += `(${r.fieldName} ${r.operator} ${r.value})`
      }
      if (i < f.predicates.length - 1) {
        result += ` ${f.matchAll ? 'And' : 'Or'} `
      }
    }
    if (f.subTree.length > 0) {
      result += ` ${f.matchAll ? 'And' : 'Or'} `
    }

    for (let i = 0; i < f.subTree.length; ++i) {
      const e: LogicalExpression = f.subTree[i]
      if (numArgs == 1) {
        result += `${getLabel(e)}`
      } else {
        result += `(${getLabel(e)})`
      }
      if (i < f.subTree.length - 1) {
        result += ` ${f.matchAll ? 'And' : 'Or'} `
      }
    }
    return result
  }

  return (
    <DropdownButton
      initialOpen={{ o: open }}
      leftOffset={1}
      topOffset={-1}
      buttonContent={
        <div className='group rounded-sm p-1 bg-bg3 hover:bg-bg4 dark:bg-bg3dark dark:hover:bg-bg1dark flex gap-1'>
          <button className=''>{getLabel(filter)}</button>
          <button
            className='hover:bg-bg6 hover:dark:bg-backgroundtwodark w-auto group-hover:visible group-hover:w-auto '
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onDelete()
            }}
          >
            <XMarkIcon size={4}></XMarkIcon>
          </button>
        </div>
      }
    >
      <div className='border'>
        <LogicalExpressionEditor
          fields={fields}
          fkRelations={fkRelations}
          onUpdateExpression={(e) => {
            onUpdateFilter(e)
            setOpen(false)
          }}
          intialExpression={filter}
          dataSourceManager={dataSourceManager}
        ></LogicalExpressionEditor>
      </div>
    </DropdownButton>
  )
}

export default FilterTag
