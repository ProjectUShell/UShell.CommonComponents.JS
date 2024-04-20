import React, { useEffect, useState } from 'react'
import { IDataSource, IDataSourceManagerBase } from 'ushell-modulebase'
import FloppyDiskIcon from '../../../_Icons/FloppyDiskIcon'
import Group from '../_Atoms/Group'
import InputField from '../_Atoms/InputField'
import { getForeignKeyValue, getValue, lowerFirstLetter, setValue } from '../../../utils/StringUtils'
import { FieldSchema, RelationSchema } from 'fusefx-modeldescription'
import XMarkIcon from '../../../_Icons/XMarkIcon'
import { IndexSchema } from 'fusefx-modeldescription'
import { EntitySchemaService } from '../../../data/EntitySchemaService'
import DropdownSelect from '../../../_Atoms/DropdownSelect'
import LookUpSelect from '../_Molecules/LookUpSelect'
import BoltIcon from '../../../_Icons/BoltIcon'

const EntityForm: React.FC<{
  dataSource: IDataSource
  className?: string
  dataSourceManager: IDataSourceManagerBase
  entity: any
  dirty: boolean
  setDirty: (d: boolean) => void
  onChange: (updatedEntity: any) => void
}> = ({ dataSourceManager, dataSource, className, entity, dirty, setDirty, onChange }) => {
  // states
  const [currentEntity, setCurrentEntity] = useState({ ...entity })
  const [fkRelations, setFkRelations] = useState<RelationSchema[]>([])
  const [fieldsToDisplay, setFieldsToDisplay] = useState<FieldSchema[]>([])

  // effects
  useEffect(() => {
    const nonLookupfkRelations: RelationSchema[] = EntitySchemaService.getRelationsByFilter(
      dataSourceManager.getSchemaRoot(),
      (r: RelationSchema) => r.foreignEntityName == dataSource.entitySchema!.name && !r.isLookupRelation,
    )

    const fkRelationsToSet: RelationSchema[] = EntitySchemaService.getRelationsByFilter(
      dataSourceManager.getSchemaRoot(),
      (r: RelationSchema) => r.foreignEntityName == dataSource.entitySchema!.name && r.isLookupRelation,
    )
    setFkRelations(fkRelationsToSet)
    const fieldsToSet: FieldSchema[] = dataSource.entitySchema!.fields.filter((f) => {
      const nonLookupfkRelationForField: RelationSchema | undefined = nonLookupfkRelations.find(
        (r) => r.foreignKeyIndexName == f.name,
      )
      const fkRelationForField: RelationSchema | undefined = fkRelationsToSet.find(
        (r) => r.foreignKeyIndexName == f.name,
      )
      const primaryKey: IndexSchema | undefined = dataSource.entitySchema!.indices.find(
        (i) =>
          i.name == dataSource.entitySchema!.primaryKeyIndexName &&
          i.memberFieldNames.includes(f.name) &&
          (f.name == 'Id' || f.name == 'id'),
      )
      return !fkRelationForField && !nonLookupfkRelationForField && !primaryKey && !f.dbGeneratedIdentity
    })
    setFieldsToDisplay(fieldsToSet)
  }, [dataSourceManager, dataSource])

  function save() {
    dataSource.entityUpdateMethod(currentEntity).then((newEntry: any) => {
      if (newEntry) {
        onChange(newEntry)
      }
    })
  }

  function changeValue(field: FieldSchema, newValue: any) {
    setDirty(true)

    if (field.type == 'Int32') {
      newValue = Number.parseInt(newValue)
    }
    setValue(currentEntity, field.name, newValue)
    setCurrentEntity({ ...currentEntity })
  }

  function changeLookUpValues(l: RelationSchema, keyValues: any) {
    setDirty(true)

    currentEntity[l.foreignNavigationName] = { label: '', key: keyValues }
    currentEntity[l.foreignKeyIndexName] = keyValues
    setCurrentEntity({ ...currentEntity })
  }

  function cancel() {
    setCurrentEntity({ ...entity })
    setDirty(false)
  }

  return (
    <div className='flex flex-col h-full'>
      <div className={`flex justify-end p-1 ${className} bg-backgroundtwo dark:bg-backgroundtwodark rounded-md mb-2`}>
        {dirty && (
          <button
            disabled={!dirty}
            className={`rounded-md p-1
              ${dirty ? 'text-red-400 dark:text-red-400 hover:bg-backgroundone dark:hover:bg-backgroundonedark' : ''}`}
            onClick={(e) => cancel()}
          >
            <XMarkIcon size={6}></XMarkIcon>
          </button>
        )}
        {!dirty && (
          <button
            disabled={!dirty}
            className={`rounded-md p-1
              ${dirty ? 'text-red-400 dark:text-red-400 hover:bg-backgroundone dark:hover:bg-backgroundonedark' : ''}`}
            onClick={(e) => setDirty(true)}
          >
            <BoltIcon size={6}></BoltIcon>
          </button>
        )}
        <button
          disabled={!dirty}
          className={`rounded-md p-1 
            ${dirty ? 'text-blue-400 dark:text-blue-400 hover:bg-backgroundone dark:hover:bg-backgroundonedark' : ''}`}
          onClick={(e) => save()}
        >
          <FloppyDiskIcon size={6}></FloppyDiskIcon>
        </button>
      </div>
      <Group name={dataSource.entitySchema!.name} className='overflow-auto h-full'>
        <div className='my-2'>
          {fieldsToDisplay.map((f) => (
            <InputField
              className='my-2'
              key={f.name}
              inputType={f.type}
              label={f.name}
              initialValue={getValue(currentEntity, f.name)}
              onValueChange={(newValue: any) => changeValue(f, newValue)}
            ></InputField>
          ))}
          {fkRelations.map((l, i) => (
            <LookUpSelect
              key={i}
              lookUpRelation={l}
              dataSourceManager={dataSourceManager}
              // initialValue={currentEntity[lowerFirstLetter(l.foreignKeyIndexName)]}
              initialValue={getForeignKeyValue(currentEntity, l)}
              onValueSet={(keyValues: any) => {
                changeLookUpValues(l, keyValues)
              }}
            ></LookUpSelect>
          ))}
        </div>
      </Group>
    </div>
  )
}

export default EntityForm
