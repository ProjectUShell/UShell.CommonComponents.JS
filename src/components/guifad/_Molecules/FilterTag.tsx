import React, { useState } from 'react'
import { LogicalExpression } from '../../../fusefx-repositorycontract/LogicalExpression'
import { RelationElement } from '../../../fusefx-repositorycontract/RelationElement'
import DropdownButton from '../../../_Atoms/DropdownButton'
import FunnelIcon from '../../../_Icons/FunnelIcon'
import LogicalExpressionEditor from './LogicalExpressionEditor'
import { FieldSchema } from 'fusefx-modeldescription'
import XMarkIcon from '../../../_Icons/XMarkIcon'

const FilterTag: React.FC<{
  filter: LogicalExpression
  fields: FieldSchema[]
  onUpdateFilter: (f: LogicalExpression) => void
  onDelete: () => void
}> = ({ filter, fields, onUpdateFilter, onDelete }) => {
  const [open, setOpen] = useState(false)

  function getLabel(f: LogicalExpression) {
    let result = ''
    const numArgs: number = f.atomArguments.length + f.expressionArguments.length
    for (let i = 0; i < f.atomArguments.length; ++i) {
      const r: RelationElement = f.atomArguments[i]
      if (numArgs == 1) {
        result += `${r.propertyName} ${r.relation} ${r.value}`
      } else {
        result += `(${r.propertyName} ${r.relation} ${r.value})`
      }
      if (i < f.atomArguments.length - 1) {
        result += ` ${f.operator} `
      }
    }
    for (let i = 0; i < f.expressionArguments.length; ++i) {
      const e: LogicalExpression = f.expressionArguments[i]
      if (numArgs == 1) {
        result += `${getLabel(e)}`
      } else {
        result += `(${getLabel(e)})`
      }
      if (i < f.atomArguments.length - 1) {
        result += ` ${f.operator} `
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
            className='hover:bg-backgroundtwo hover:dark:bg-backgroundtwodark invisible w-0 group-hover:visible group-hover:w-auto '
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
