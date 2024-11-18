import React, { useEffect, useState } from 'react'
import { IDataSource } from 'ushell-modulebase'
import { setValue } from '../../../utils/StringUtils'
import { FieldSchema, RelationSchema } from 'fusefx-modeldescription'
import { EntitySchemaService } from '../../../data/EntitySchemaService'
import ErrorPage from '../../../_Molecules/ErrorScreen'
import { EntityLayout, LayoutPartition } from '../../../[Move2LayoutDescription]/EntityLayout'
import EntityFormGroup from '../_Molecules/EntityFormGroup'
import { IDataSourceManagerWidget } from '../_Templates/IDataSourceManagerWidget'
import Modal2 from '../../../_Atoms/Modal2Old'
import Modal3 from '../../../_Atoms/Modal3'

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
  classNameDropdownBg?: string
  classNameDropdownHoverBg?: string
  styleType?: number
  uow: any
  persistUow: (uow: any) => void
  isCreation?: boolean
  onValidationChanged?: (errors: { [fieldName: string]: string | null }) => void
  minWidthInput?: number
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
  classNameDropdownBg,
  classNameDropdownHoverBg,
  styleType = 0,
  isCreation,
  onValidationChanged,
  minWidthInput,
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
      <Modal3
        title={`${entityLayout?.displayLabel} Details`}
        terminate={() => {
          setError(null)
        }}
      >
        <ErrorPage messages={[error.toString()]}></ErrorPage>
      </Modal3>
    )
  }

  function changeValue(field: FieldSchema, newValue: any) {
    setDirty ? setDirty(true) : setDirtyLocal(true)

    if (field.type == 'Int32') {
      newValue = Number.parseInt(newValue)
    }
    if (field.type.toLocaleLowerCase().startsWith('bool')) {
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
      for (let fn of getCoveredFields(p.children || [])) {
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
    if (!entityLayout) return fkRelations.map((f) => f.primaryEntityName)
    const coveredFields: string[] = getCoveredFields(entityLayout.partitions)
    return fkRelations.map((f) => f.foreignKeyIndexName).filter((fn) => !coveredFields.includes(fn))
  }

  function getPartitionFields(p: LayoutPartition): FieldSchema[] {
    const result: FieldSchema[] = []
    p.fields.forEach((lf) => {
      const field: FieldSchema | undefined = fieldsToDisplay.find(
        (ftd) => ftd.name.toLocaleLowerCase() == lf.toLocaleLowerCase(),
      )
      if (field) {
        result.push(field)
      }
    })
    return result
  }

  return (
    <div className='UShell_EntityFormInner flex flex-col h-full overflow-auto pr-1'>
      {entityLayout?.partitions
        .filter((p) => p.type == 'group')
        .map((p, i) => (
          <EntityFormGroup
            minWidthInput={minWidthInput}
            key={'group' + p.name + i}
            label={p.name}
            allFields={fieldsToDisplay}
            fieldsToDisplay={getPartitionFields(p)}
            currentEntity={entity}
            changeValue={changeValue}
            fkRelations={fkRelations}
            fkRelationsToDisplay={fkRelations.filter((fk) =>
              p.fields.includes(fk.foreignKeyIndexName),
            )}
            dataSourceManager={dataSourceManager}
            changeLookUpValues={changeLookUpValues}
            partitions={p.children || []}
            labelPosition={labelPosition}
            fieldLayouts={entityLayout?.fieldLayouts || []}
            readOnly={readOnly}
            classNameBg={classNameBg}
            classNameInputBg={classNameInputBg}
            classNameInputHoverBg={classNameInputHoverBg}
            classNameInputHoverBgDark={classNameInputHoverBgDark}
            classNameDropdownBg={classNameDropdownBg}
            classNameDropdownHoverBg={classNameDropdownHoverBg}
            styleType={styleType}
            isCreation={isCreation}
            onValidationChanged={onValidationChanged}
          ></EntityFormGroup>
        ))}
      <div className='UShell_EntityFormInner_ColumnGroups flex gap-1 w-full border-0'>
        {entityLayout?.partitions
          .filter((p) => p.type == 'column')
          .map((p, i) => (
            <div key={p.name || '' + i} className='w-full'>
              <EntityFormGroup
                label={p.name}
                allFields={fieldsToDisplay}
                fieldsToDisplay={getPartitionFields(p)}
                currentEntity={entity}
                changeValue={changeValue}
                fkRelations={fkRelations}
                fkRelationsToDisplay={fkRelations.filter((fk) =>
                  p.fields.includes(fk.foreignKeyIndexName),
                )}
                dataSourceManager={dataSourceManager}
                changeLookUpValues={changeLookUpValues}
                partitions={p.children || []}
                labelPosition={labelPosition}
                fieldLayouts={entityLayout?.fieldLayouts || []}
                readOnly={readOnly}
                classNameBg={classNameBg}
                classNameInputBg={classNameInputBg}
                classNameInputHoverBg={classNameInputHoverBg}
                classNameInputHoverBgDark={classNameInputHoverBgDark}
                classNameDropdownBg={classNameDropdownBg}
                classNameDropdownHoverBg={classNameDropdownHoverBg}
                styleType={styleType}
                isCreation={isCreation}
                onValidationChanged={onValidationChanged}
                minWidthInput={minWidthInput}
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
            getRemainingFkRelations().includes(f.foreignKeyIndexName),
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
          classNameDropdownBg={classNameDropdownBg}
          classNameDropdownHoverBg={classNameDropdownHoverBg}
          styleType={styleType}
          isCreation={isCreation}
          onValidationChanged={onValidationChanged}
          minWidthInput={minWidthInput}
        ></EntityFormGroup>
      )}
    </div>
  )
}

export default EntityFormInner
