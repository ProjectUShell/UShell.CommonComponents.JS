import React, { useEffect, useState } from 'react'

import Dropdown from '../../../_Atoms/Dropdown'
import DropdownSelect from '../../../_Atoms/DropdownSelect'
import { FieldSchema } from 'fusefx-modeldescription'
import { FieldPredicate } from 'fusefx-repositorycontract/lib/FieldPredicate'
import InputField from '../_Atoms/InputField'
import { EntitySchemaService } from '../../../data/EntitySchemaService'

// export interface IFieldInfo {
//   name: string
//   type: string
// }

const RelationEditor: React.FC<{
  initialRelation: FieldPredicate
  onUpdateRelation: (r: FieldPredicate) => void
  fields: FieldSchema[]
}> = ({ initialRelation, fields, onUpdateRelation }) => {
  const [currrentField, setCurrentField] = useState<FieldSchema | null>(null)
  const [currentOperator, setCurrentOperator] = useState<string>('')
  const [currrentValue, setCurrentValue] = useState<string>('')

  useEffect(() => {
    console.log('intialField', initialRelation.fieldName)
    setCurrentField(fields.find((f) => f.name.toLocaleLowerCase() == initialRelation.fieldName.toLocaleLowerCase())!)
    setCurrentOperator(initialRelation.operator)
    setCurrentValue(initialRelation.value)
  }, [initialRelation, fields])

  function getOperatorLabel(operator: string) {
    if (operator == '|*') return 'starts with'
    if (operator == '*|') return 'ends with'
    if (currrentField?.type.toLocaleLowerCase() == 'string') {
      if (operator == '<=') return 'substring of'
      if (operator == '>=') return 'contains'
    }
    return operator
  }

  function getValidOperators(fieldType?: string): { label: string; value: string }[] {
    if (!fieldType) {
      return []
    }
    console.log('fieldType', fields)
    switch (fieldType.toLocaleLowerCase()) {
      case 'string':
        // ['=', '!='] //, '<', '<=', '>', '>=', '|*', '*|']
        return [
          { label: '=', value: '=' },
          { label: '!=', value: '!=' },
          { label: 'substring of', value: '<=' },
          { label: 'contains', value: '>=' },
          { label: 'starts with', value: '|*' },
          { label: 'ends with', value: '*|' },
        ]
      default:
        return [
          { label: '=', value: '=' },
          { label: '!=', value: '!=' },
          { label: '<=', value: '<=' },
          { label: '>=', value: '>=' },
          { label: '<', value: '<' },
          { label: '>', value: '>' },
        ]
    }
  }

  function notifyRelationUpdated(field: FieldSchema | null, operator: string | null, value: string) {
    console.log('notifyRelationUpdate', { field: field, operator: operator, value: value })
    if (field && operator && value) {
      onUpdateRelation({
        fieldName: field.name,
        operator: operator,
        value: value,
      })
    }
  }

  function onFieldSet(fieldName: string) {
    const fieldToSet: FieldSchema | undefined = fields.find(
      (f) => f.name.toLocaleLowerCase() == fieldName.toLocaleLowerCase(),
    )
    if (!fieldToSet) {
      setCurrentField(null)
      return
    }
    console.log('setCurrentField', fieldToSet)
    setCurrentField(fieldToSet)
    notifyRelationUpdated(fieldToSet, currentOperator, currrentValue)
  }

  function onOperatorSet(o: string) {
    setCurrentOperator(o)
    notifyRelationUpdated(currrentField, o, currrentValue)
  }

  function onValueSet(v: string) {
    setCurrentValue(v)
    notifyRelationUpdated(currrentField, currentOperator, v)
  }

  console.log('currentField', currrentField)
  return (
    <div className='flex p-2 gap-1  rounded-sm'>
      <DropdownSelect
        forceFocus
        options={fields.map((f) => {
          return { label: f.name, value: f.name }
        })}
        initialOption={currrentField && { label: currrentField.name, value: currrentField.name }}
        onOptionSet={(o) => onFieldSet(o?.value)}
        placeholder='Select a field'
      ></DropdownSelect>
      <DropdownSelect
        options={getValidOperators(currrentField?.type)}
        initialOption={currrentField && { label: getOperatorLabel(currentOperator), value: currentOperator }}
        onOptionSet={(o) => onOperatorSet(o?.value)}
        placeholder={currrentField ? 'Select a operator' : 'Select a field first'}
      ></DropdownSelect>
      <input
        value={currrentValue}
        type={EntitySchemaService.getHtmlInputType(currrentField?.type || 'string')}
        onChange={(e) => onValueSet(e.target.value)}
        className='p-0.5 outline-1 outline-gray-400 outline rounded-sm w-64 focus:z-50 relative bg-backgroundonw dark:bg-backgroundonedark'
      ></input>
    </div>
  )
}

export default RelationEditor
