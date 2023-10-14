import React, { useEffect, useState } from 'react'
import { RelationElement } from 'fusefx-repositorycontract'
import Dropdown from '../../../_Atoms/Dropdown'
import DropdownSelect from '../../../_Atoms/DropdownSelect'
import { FieldSchema } from 'fusefx-modeldescription'

export interface IFieldInfo {
  name: string
  type: string
}

const RelationEditor: React.FC<{
  initialRelation: RelationElement
  onUpdateRelation: (r: RelationElement) => void
  fields: IFieldInfo[]
}> = ({ initialRelation, fields, onUpdateRelation }) => {
  console.log('initialRelation', initialRelation)

  const [currrentField, setCurrentField] = useState<IFieldInfo | null>(null)
  const [currentOperator, setCurrentOperator] = useState<string>('')
  const [currrentValue, setCurrentValue] = useState<string>('')

  useEffect(() => {
    setCurrentField({ name: initialRelation.propertyName, type: initialRelation.propertyType })
    setCurrentOperator(initialRelation.relation)
    setCurrentValue(initialRelation.value)
  }, [initialRelation])

  function getValidOperators(fieldType?: string): string[] {
    return ['=', '<', '>', 'in']
    if (!fieldType) {
      return []
    }
    return ['=', '<', '>', 'in']
  }

  function notifyRelationUpdated(field: IFieldInfo | null, operator: string | null, value: string) {
    console.log('notifyRelationUpdate', { field: field, operator: operator, value: value })
    if (field && operator && value) {
      onUpdateRelation({
        propertyName: field.name,
        propertyType: field.type,
        relation: operator,
        value: value,
      })
    }
  }

  function onFieldSet(fieldName: string) {
    const fieldToSet: IFieldInfo | undefined = fields.find((f) => f.name == fieldName)
    if (!fieldToSet) {
      setCurrentField(null)
      return
    }
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
    console.log('value set', v)
  }

  console.log('initialRelation RE', initialRelation)
  console.log('currrentOperator', currentOperator)

  return (
    <div className='flex p-2 gap-1 bg-backgroundthree dark:bg-backgroundthreedark rounded-sm'>
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
        options={getValidOperators(currrentField?.type).map((o) => {
          return { label: o, value: o }
        })}
        initialOption={currrentField && { label: currentOperator, value: currentOperator }}
        onOptionSet={(o) => onOperatorSet(o?.value)}
        placeholder={currrentField ? 'Select a operator' : 'Select a field first'}
      ></DropdownSelect>
      <input
        value={currrentValue}
        type='text'
        onChange={(e) => onValueSet(e.target.value)}
        className='p-0.5 outline-1 outline-gray-400 outline rounded-sm w-64 focus:z-50 relative bg-backgroundonw dark:bg-backgroundonedark'
      ></input>
    </div>
  )
}

export default RelationEditor
