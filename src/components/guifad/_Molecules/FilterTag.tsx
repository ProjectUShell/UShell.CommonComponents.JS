import React, { useState } from 'react'
import { LogicalExpression } from 'fusefx-repositorycontract'
import DropdownButton from '../../../_Atoms/DropdownButton'
import LogicalExpressionEditor from './LogicalExpressionEditor'
import { FieldSchema } from 'fusefx-modeldescription'
import XMarkIcon from '../../../_Icons/XMarkIcon'
import { FieldPredicate } from 'fusefx-repositorycontract/lib/FieldPredicate'

const FilterTag: React.FC<{
  filter: LogicalExpression
  fields: FieldSchema[]
  onUpdateFilter: (f: LogicalExpression) => void
  onDelete: () => void
}> = ({ filter, fields, onUpdateFilter, onDelete }) => {
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
      leftOffset={0}
      topOffset={0}
      buttonContent={
        <div className='group rounded-md p-1 bg-backgroundone dark:bg-backgroundonedark flex gap-1'>
          <button className=''>{getLabel(filter)}</button>
          <button
            className='hover:bg-backgroundtwo hover:dark:bg-backgroundtwodark w-auto group-hover:visible group-hover:w-auto '
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
      <LogicalExpressionEditor
        fields={fields}
        onUpdateExpression={(e) => {
          onUpdateFilter(e)
          setOpen(false)
        }}
        intialExpression={filter}
      ></LogicalExpressionEditor>
    </DropdownButton>
  )
}

export default FilterTag
