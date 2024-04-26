import React, { useEffect, useState } from 'react'

import Dropdown from '../../../_Atoms/Dropdown'
import DropdownSelect from '../../../_Atoms/DropdownSelect'
import { FieldSchema, RelationSchema } from 'fusefx-modeldescription'
import { FieldPredicate } from 'fusefx-repositorycontract/lib/FieldPredicate'
import InputField from '../_Atoms/InputField'
import { EntitySchemaService } from '../../../data/EntitySchemaService'
import LookUpSelect from './LookUpSelect'
import { IDataSourceManagerBase } from 'ushell-modulebase'

// export interface IFieldInfo {
//   name: string
//   type: string
// }

const RelationEditor: React.FC<{
  initialRelation: FieldPredicate
  onUpdateRelation: (r: FieldPredicate) => void
  fields: FieldSchema[]
  fkRelations: RelationSchema[]
  dataSourceManager: IDataSourceManagerBase
}> = ({ initialRelation, fields, fkRelations, onUpdateRelation, dataSourceManager }) => {
  console.log('RelationEditor render', initialRelation)
  const [currrentField, setCurrentField] = useState<FieldSchema | null>(null)
  const [currentFkRelation, setCurrentFkRelation] = useState<RelationSchema | null>(null)
  const [currentOperator, setCurrentOperator] = useState<string>('')
  const [currentValue, setCurrentValue] = useState<string>('')

  useEffect(() => {
    console.log('RelationEditor init', initialRelation)
    setCurrentField(fields.find((f) => f.name.toLocaleLowerCase() == initialRelation.fieldName.toLocaleLowerCase())!)

    setCurrentFkRelation((cfk) => {
      if (cfk && cfk.foreignKeyIndexName == initialRelation.fieldName) {
        return cfk
      }
      return fkRelations.find(
        (f) => f.foreignNavigationName.toLocaleLowerCase() == initialRelation.fieldName.toLocaleLowerCase(),
      )!
    })

    setCurrentOperator(initialRelation.operator)
    setCurrentValue(initialRelation.value)
  }, [initialRelation, fields, fkRelations])

  function getFieldOptions(): { label: string; value: any }[] {
    const result = fields.map((f) => {
      return { label: f.name, value: f.name }
    })
    for (const fkRelation of fkRelations) {
      result.push({ label: fkRelation.foreignNavigationName, value: fkRelation.foreignNavigationName })
    }
    return result
  }
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
    if (field && operator && value) {
      onUpdateRelation({
        fieldName: field.name,
        operator: operator,
        value: value,
      })
    }
  }

  function onFieldSet(fieldName: string) {
    let fieldToSet: FieldSchema | undefined = fields.find(
      (f) => f.name.toLocaleLowerCase() == fieldName.toLocaleLowerCase(),
    )
    const fkRelationToSet: RelationSchema | undefined = fkRelations.find(
      (r) => r.foreignNavigationName.toLocaleLowerCase() == fieldName.toLocaleLowerCase(),
    )
    if (fkRelationToSet) {
      console.log('fkRelationToSet', fkRelationToSet)
      fieldToSet = fields.find(
        (f) => f.name.toLocaleLowerCase() == fkRelationToSet.foreignKeyIndexName.toLocaleLowerCase(),
      )
      if (!fieldToSet) {
        setCurrentField(null)
        return
      }
      setCurrentFkRelation(fkRelationToSet)
      setCurrentField(fieldToSet)
      notifyRelationUpdated(fieldToSet, currentOperator, currentValue)
      return
    }
    if (!fieldToSet) {
      setCurrentField(null)
      return
    }
    setCurrentField(fieldToSet)
    notifyRelationUpdated(fieldToSet, currentOperator, currentValue)
  }

  function onOperatorSet(o: string) {
    setCurrentOperator(o)
    notifyRelationUpdated(currrentField, o, currentValue)
  }

  function onValueSet(v: any) {
    setCurrentValue(v)
    notifyRelationUpdated(currrentField, currentOperator, v)
  }

  console.log('currentField', currrentField)
  return (
    <div className='flex p-2 gap-1  rounded-sm'>
      <DropdownSelect
        forceFocus
        options={getFieldOptions()}
        initialOption={
          currentFkRelation
            ? { label: currentFkRelation.foreignNavigationName, value: currentFkRelation.foreignNavigationName }
            : currrentField && { label: currrentField.name, value: currrentField.name }
        }
        onOptionSet={(o) => onFieldSet(o?.value)}
        placeholder='Select a field'
      ></DropdownSelect>
      <DropdownSelect
        options={getValidOperators(currrentField?.type)}
        initialOption={currrentField && { label: getOperatorLabel(currentOperator), value: currentOperator }}
        onOptionSet={(o) => onOperatorSet(o?.value)}
        placeholder={currrentField ? 'Select a operator' : 'Select a field first'}
      ></DropdownSelect>
      {currentFkRelation ? (
        <LookUpSelect
          showLabel={false}
          dataSourceManager={dataSourceManager}
          initialValue={null}
          lookUpRelation={currentFkRelation}
          onValueSet={(keyValues: any[]) => onValueSet(keyValues)}
        ></LookUpSelect>
      ) : (
        <input
          value={currentValue}
          type={EntitySchemaService.getHtmlInputType(currrentField?.type || 'string')}
          onChange={(e) => onValueSet(e.target.value)}
          className='p-0.5 outline-1 outline-gray-400 outline rounded-sm w-64 focus:z-50 relative bg-backgroundonw dark:bg-backgroundonedark'
        ></input>
      )}
    </div>
  )
}

export default RelationEditor
