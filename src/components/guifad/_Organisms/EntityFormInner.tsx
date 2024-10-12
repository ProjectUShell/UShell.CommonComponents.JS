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
import { LayoutDescriptionRoot } from '../../../[Move2LayoutDescription]/LayoutDescriptionRoot'

const EntityFormInner: React.FC<{
  dataSource: IDataSource
  dataSourceManager?: IDataSourceManagerWidget
  entity: any
  dirty: boolean
  setDirty?: (d: boolean) => void
  onChange: (updatedEntity: any) => void
  entityLayout?: EntityLayout
  labelPosition?: 'top' | 'left'
  readOnly?: boolean
  classNameBg?: string
  classNameInputBg?: string
  classNameInputHoverBg?: string
  classNameInputHoverBgDark?: string
  styleType?: number
  uow: any
  persistUow: (uow: any) => void
  isCreation?: boolean
}> = ({
  dataSourceManager,
  dataSource,
  entity,
  dirty,
  setDirty,
  onChange,
  entityLayout,
  labelPosition = 'top',
  readOnly = false,
  classNameBg,
  classNameInputBg,
  classNameInputHoverBg,
  classNameInputHoverBgDark,
  styleType = 0,
  isCreation,
}) => {
  // states
  // const [currentEntity, setCurrentEntity] = useState({ ...entity })
  const [fkRelations, setFkRelations] = useState<RelationSchema[]>([])
  const [fieldsToDisplay, setFieldsToDisplay] = useState<FieldSchema[]>([])
  const [error, setError] = useState<any>(null)
  const [dirtyLocal, setDirtyLocal] = useState<boolean>(dirty)

  // effects

  useEffect(() => {
    try {
      const nonLookupfkRelations: RelationSchema[] = dataSourceManager
        ? EntitySchemaService.getRelationsByFilter(
            dataSourceManager.getSchemaRoot(),
            (r: RelationSchema) =>
              r.foreignEntityName == dataSource.entitySchema!.name && !r.isLookupRelation,
          )
        : []

      const fkRelationsToSet: RelationSchema[] = dataSourceManager
        ? EntitySchemaService.getRelationsByFilter(
            dataSourceManager.getSchemaRoot(),
            (r: RelationSchema) =>
              r.foreignEntityName == dataSource.entitySchema!.name && r.isLookupRelation,
          )
        : []
      setFkRelations(fkRelationsToSet)
      const fieldsToSet: FieldSchema[] = dataSource.entitySchema!.fields.filter((f) => {
        const nonLookupfkRelationForField: RelationSchema | undefined = nonLookupfkRelations.find(
          (r) => r.foreignKeyIndexName == f.name,
        )
        const fkRelationForField: RelationSchema | undefined = fkRelationsToSet.find(
          (r) => r.foreignKeyIndexName == f.name,
        )
        // const primaryKey: IndexSchema | undefined = dataSource.entitySchema!.indices.find(
        //   (i) =>
        //     i.name == dataSource.entitySchema!.primaryKeyIndexName &&
        //     i.memberFieldNames.includes(f.name) &&
        //     (f.name == 'Id' || f.name == 'id'),
        // )
        return !fkRelationForField && !nonLookupfkRelationForField && !f.dbGeneratedIdentity
      })
      setFieldsToDisplay(fieldsToSet)
    } catch (err) {
      setError(err)
    }
  }, [dataSourceManager, dataSource])

  if (error) {
    return (
      <Modal
        terminate={() => {
          setError(null)
        }}
      >
        <ErrorPage messages={[error.toString()]}></ErrorPage>
      </Modal>
    )
  }

  function changeValue(field: FieldSchema, newValue: any) {
    setDirty ? setDirty(true) : setDirtyLocal(true)

    if (field.type == 'Int32') {
      newValue = Number.parseInt(newValue)
    }
    setValue(entity, field.name, newValue)
    onChange(entity)
  }

  function changeLookUpValues(l: RelationSchema, keyValues: any) {
    setDirty ? setDirty(true) : setDirtyLocal(true)

    entity[l.foreignNavigationName] = { label: '', key: keyValues }
    entity[l.foreignKeyIndexName] = keyValues
    onChange(entity)
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
    <div className='UShell_EntityForm_Inner flex flex-col h-full overflow-auto pr-1'>
      {entityLayout?.partitions
        .filter((p) => p.type == 'group')
        .map((p, i) => (
          <EntityFormGroup
            key={i}
            label={p.name}
            allFields={fieldsToDisplay}
            fieldsToDisplay={fieldsToDisplay.filter((f) => p.fields.includes(f.name))}
            currentEntity={entity}
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
            readOnly={readOnly}
            classNameBg={classNameBg}
            classNameInputBg={classNameInputBg}
            classNameInputHoverBg={classNameInputHoverBg}
            classNameInputHoverBgDark={classNameInputHoverBgDark}
            styleType={styleType}
            isCreation={isCreation}
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
                currentEntity={entity}
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
                readOnly={readOnly}
                classNameBg={classNameBg}
                classNameInputBg={classNameInputBg}
                classNameInputHoverBg={classNameInputHoverBg}
                classNameInputHoverBgDark={classNameInputHoverBgDark}
                styleType={styleType}
                isCreation={isCreation}
              ></EntityFormGroup>
            </div>
          ))}
      </div>
      {(!entityLayout || entityLayout.dislpayRemainingFields) && (
        <EntityFormGroup
          label={dataSource.entitySchema!.name}
          allFields={fieldsToDisplay}
          fieldsToDisplay={fieldsToDisplay.filter((f) => getRemainingFields().includes(f.name))}
          currentEntity={entity}
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
          readOnly={readOnly}
          classNameBg={classNameBg}
          classNameInputBg={classNameInputBg}
          classNameInputHoverBg={classNameInputHoverBg}
          classNameInputHoverBgDark={classNameInputHoverBgDark}
          styleType={styleType}
          isCreation={isCreation}
        ></EntityFormGroup>
      )}
    </div>
  )
}

export default EntityFormInner
