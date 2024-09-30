import React, { useEffect, useState } from 'react'
import { IDataSource, IDataSourceManagerBase } from 'ushell-modulebase'
import FloppyDiskIcon from '../../../_Icons/FloppyDiskIcon'
import Group from '../_Atoms/Group'
import InputField from '../_Atoms/InputField'
import { getForeignKeyValue, getValue, setValue } from '../../../utils/StringUtils'
import { FieldSchema, RelationSchema } from 'fusefx-modeldescription'
import XMarkIcon from '../../../_Icons/XMarkIcon'
import { IndexSchema } from 'fusefx-modeldescription'
import { EntitySchemaService } from '../../../data/EntitySchemaService'
import LookUpSelect from '../_Molecules/LookUpSelect'
import BoltIcon from '../../../_Icons/BoltIcon'
import ErrorPage from '../../../_Molecules/ErrorScreen'
import { EntityLayout, LayoutPartition } from '../../../[Move2LayoutDescription]/EntityLayout'
import EntityFormGroup from '../_Molecules/EntityFormGroup'
import Modal from '../../../_Atoms/Modal'
import { IDataSourceManagerWidget } from '../_Templates/IDataSourceManagerWidget'

const EntityForm: React.FC<{
  dataSource: IDataSource
  dataSourceManager: IDataSourceManagerWidget
  entity: any
  dirty: boolean
  setDirty: (d: boolean) => void
  onChange: (updatedEntity: any) => void
  entityLayout?: EntityLayout
  labelPosition?: 'top' | 'left'
}> = ({
  dataSourceManager,
  dataSource,
  entity,
  dirty,
  setDirty,
  onChange,
  entityLayout,
  labelPosition = 'top',
}) => {
  // states
  const [currentEntity, setCurrentEntity] = useState({ ...entity })
  const [fkRelations, setFkRelations] = useState<RelationSchema[]>([])
  const [fieldsToDisplay, setFieldsToDisplay] = useState<FieldSchema[]>([])
  const [error, setError] = useState<any>(null)

  // effects
  useEffect(() => {
    try {
      const nonLookupfkRelations: RelationSchema[] = EntitySchemaService.getRelationsByFilter(
        dataSourceManager.getSchemaRoot(),
        (r: RelationSchema) =>
          r.foreignEntityName == dataSource.entitySchema!.name && !r.isLookupRelation,
      )

      const fkRelationsToSet: RelationSchema[] = EntitySchemaService.getRelationsByFilter(
        dataSourceManager.getSchemaRoot(),
        (r: RelationSchema) =>
          r.foreignEntityName == dataSource.entitySchema!.name && r.isLookupRelation,
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
        return (
          !fkRelationForField &&
          !nonLookupfkRelationForField &&
          !primaryKey &&
          !f.dbGeneratedIdentity
        )
      })
      setFieldsToDisplay(fieldsToSet)
    } catch (err) {
      setError(err)
    }
  }, [dataSourceManager, dataSource])

  if (error) {
    return (
      <Modal
        margin={40}
        terminate={() => {
          setError(null)
        }}
      >
        <ErrorPage messages={[error.toString()]}></ErrorPage>
        {/* {error.toString()} */}
      </Modal>
    )
    // return <ErrorPage messages={[error]}></ErrorPage>
  }

  function save() {
    dataSource
      .entityUpdateMethod(currentEntity)
      .then((newEntry: any) => {
        if (newEntry) {
          onChange(newEntry)
        }
      })
      .catch((ex) => {
        setError(ex)
        console.error('error in entityUpdateMethod', ex)
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

  function getCoveredFields(partitions: LayoutPartition[]): string[] {
    const result: string[] = []
    for (let p of partitions) {
      for (let fn of p.fields) {
        if (!result.includes(fn)) {
          result.push(fn)
        }
      }
      for (let fn of getCoveredFields(p.children)) {
        result.push(fn)
      }
    }
    return result
  }
  function getRemainingFields(): string[] {
    if (!entityLayout) return fieldsToDisplay.map((f) => f.name)
    const coveredFields: string[] = getCoveredFields(entityLayout.partitions)
    return fieldsToDisplay.map((f) => f.name).filter((fn) => !coveredFields.includes(fn))
  }
  function getRemainingFkRelations(): string[] {
    if (!entityLayout) return fieldsToDisplay.map((f) => f.name)
    const coveredFields: string[] = getCoveredFields(entityLayout.partitions)
    return fkRelations.map((f) => f.primaryEntityName).filter((fn) => !coveredFields.includes(fn))
  }

  return (
    <div className='flex flex-col h-full overflow-hidden'>
      <div
        className={`UShell_EntityForm_Toolbar bg-toolbar dark:bg-toolbarDark flex justify-start p-1 rounded-sm 
        border border-toolbarBorder dark:border-toolbarBorderDark my-1`}
      >
        {dirty && (
          <button
            disabled={!dirty}
            className={`rounded-md p-1
              ${
                dirty
                  ? 'text-red-400 dark:text-red-400 hover:bg-toolbarHover dark:hover:bg-toolbarHoverDark'
                  : ''
              }`}
            onClick={(e) => cancel()}
          >
            <XMarkIcon size={6}></XMarkIcon>
          </button>
        )}
        {!dirty && (
          <button
            disabled={dirty}
            className={`rounded-md p-1
              ${
                !dirty
                  ? 'text-blue-400 dark:text-blue-400 hover:bg-toolbarHover dark:hover:bg-toolbarHoverDark'
                  : ''
              }`}
            onClick={(e) => setDirty(true)}
          >
            <BoltIcon size={6}></BoltIcon>
          </button>
        )}
        <button
          disabled={!dirty}
          className={`rounded-md p-1 
            ${
              dirty
                ? 'text-blue-400 dark:text-blue-400 hover:bg-toolbarHover dark:hover:bg-toolbarHoverDark'
                : ''
            }`}
          onClick={(e) => save()}
        >
          <FloppyDiskIcon size={6}></FloppyDiskIcon>
        </button>
      </div>
      <div className='flex flex-col h-full overflow-auto'>
        {entityLayout?.partitions
          .filter((p) => p.type == 'group')
          .map((p, i) => (
            <EntityFormGroup
              key={i}
              label={p.name}
              allFields={fieldsToDisplay}
              fieldsToDisplay={fieldsToDisplay.filter((f) => p.fields.includes(f.name))}
              currentEntity={currentEntity}
              changeValue={changeValue}
              fkRelations={fkRelations}
              fkRelationsToDisplay={fkRelations.filter((fk) =>
                p.fields.includes(fk.primaryEntityName),
              )}
              dataSourceManager={dataSourceManager}
              changeLookUpValues={changeLookUpValues}
              partitions={p.children}
              labelPosition={labelPosition}
              fieldLayouts={entityLayout?.fieldLayouts || []}
            ></EntityFormGroup>
          ))}
        <div className='flex gap-1 w-full '>
          {entityLayout?.partitions
            .filter((p) => p.type == 'column')
            .map((p) => (
              <div key={p.name}>
                <EntityFormGroup
                  label={p.name}
                  allFields={fieldsToDisplay}
                  fieldsToDisplay={fieldsToDisplay.filter((f) => p.fields.includes(f.name))}
                  currentEntity={currentEntity}
                  changeValue={changeValue}
                  fkRelations={fkRelations}
                  fkRelationsToDisplay={fkRelations.filter((fk) =>
                    p.fields.includes(fk.primaryEntityName),
                  )}
                  dataSourceManager={dataSourceManager}
                  changeLookUpValues={changeLookUpValues}
                  partitions={p.children}
                  labelPosition={labelPosition}
                  fieldLayouts={entityLayout?.fieldLayouts || []}
                ></EntityFormGroup>
              </div>
            ))}
        </div>
        {(!entityLayout || entityLayout.dislpayRemainingFields) && (
          <EntityFormGroup
            label={dataSource.entitySchema!.name}
            allFields={fieldsToDisplay}
            fieldsToDisplay={fieldsToDisplay.filter((f) => getRemainingFields().includes(f.name))}
            currentEntity={currentEntity}
            changeValue={changeValue}
            fkRelations={fkRelations}
            fkRelationsToDisplay={fkRelations.filter((f) =>
              getRemainingFkRelations().includes(f.primaryEntityName),
            )}
            dataSourceManager={dataSourceManager}
            changeLookUpValues={changeLookUpValues}
            partitions={[]}
            labelPosition={labelPosition}
            fieldLayouts={entityLayout?.fieldLayouts || []}
          ></EntityFormGroup>
        )}
      </div>
    </div>
  )
}

export default EntityForm
