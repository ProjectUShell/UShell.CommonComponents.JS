import React, { useMemo } from 'react'
import { getValue, getForeignKeyValue } from '../../../utils/StringUtils'
import LookUpSelect from './LookUpSelect'
import { FieldSchema, IndexSchema, RelationSchema } from 'fusefx-modeldescription'
import UForm1 from './UForm1'
import { IDataSourceManagerWidget } from '../_Templates/IDataSourceManagerWidget'
import { FieldLayout } from '../../../[Move2LayoutDescription]/FieldLayout'
import { EntitySchemaService } from '../../../data/EntitySchemaService'

const UForm: React.FC<{
  fieldsToDisplay: FieldSchema[]
  fkRelationsToDisplay: RelationSchema[]
  currentEntity: any
  changeValue: (field: FieldSchema, newValue: any) => void
  changeLookUpValues: (l: RelationSchema, keyValues: any) => void
  dataSourceManager?: IDataSourceManagerWidget
  labelPosition: 'top' | 'left'
  fieldLayouts: FieldLayout[]
  classNameBg?: string
  classNameInputBg?: string
  classNameInputHoverBg?: string
  classNameInputHoverBgDark?: string
  classNameDropdownBg?: string
  classNameDropdownHoverBg?: string
  styleType?: number
  readOnly?: boolean
  isCreation?: boolean
  onValidationChanged?: (errors: { [fieldName: string]: string | null }) => void
  minWidthInput?: number
}> = ({
  fieldsToDisplay,
  currentEntity,
  changeValue,
  fkRelationsToDisplay,
  dataSourceManager,
  changeLookUpValues,
  labelPosition,
  fieldLayouts,
  classNameBg,
  classNameInputBg,
  classNameInputHoverBg,
  classNameInputHoverBgDark,
  classNameDropdownBg,
  classNameDropdownHoverBg,
  styleType = 0,
  readOnly = false,
  isCreation = false,
  onValidationChanged,
  minWidthInput,
}) => {
  function getAllowCrud(fk: RelationSchema): boolean {
    const fieldLayout: FieldLayout | undefined = fieldLayouts.find(
      (fl) => fl.fieldName == fk.foreignKeyIndexName,
    )
    if (!fieldLayout) return false
    return fieldLayout.allowCrudForLookUp || false
  }
  function getFkLabel(lookUpRelation: RelationSchema) {
    if (lookUpRelation.foreignKeyIndexName) {
      const fieldLayout: FieldLayout | undefined = fieldLayouts.find(
        (fl) => fl.fieldName == lookUpRelation.foreignKeyIndexName,
      )
      if (fieldLayout) return fieldLayout.displayLabel
    }
    return lookUpRelation.foreignNavigationName && lookUpRelation.foreignNavigationName != ''
      ? lookUpRelation.foreignNavigationName
      : lookUpRelation.foreignKeyIndexName
  }
  function getAllowNull(fk: RelationSchema): boolean {
    const fields: FieldSchema[] = EntitySchemaService.getFields(
      fk.foreignKeyIndexName,
      dataSourceManager?.getSchemaRoot()!.entities.find((e) => e.name == fk.foreignEntityName)!,
    )
    console.log('getAllowNull', fk, fields)
    for (const f of fields) {
      if (f.required) return false
    }
    return true
  }

  return (
    <UForm1
      minWidth={minWidthInput}
      onValidationChanged={onValidationChanged}
      styleType={styleType}
      fieldLayouts={fieldLayouts}
      labelPosition={labelPosition}
      fieldsToDisplay={fieldsToDisplay.map((f) => {
        return {
          ...f,
          value: getValue(currentEntity, f.name),
          setValue: (newValue: any) => {
            changeValue(f, newValue)
          },
          knownValues: EntitySchemaService.getKnownValues(f, dataSourceManager?.getSchemaRoot()!),
        }
      })}
      customInputs={
        dataSourceManager
          ? fkRelationsToDisplay.map((fk, i) => {
              return {
                label: getFkLabel(fk),
                render: () => (
                  <LookUpSelect
                    label={getFkLabel(fk)}
                    allowNull={getAllowNull(fk)}
                    key={i}
                    lookUpRelation={fk}
                    dataSourceManager={dataSourceManager}
                    // initialValue={currentEntity[lowerFirstLetter(l.foreignKeyIndexName)]}
                    initialValue={getForeignKeyValue(currentEntity, fk)}
                    onValueSet={(keyValues: any) => {
                      changeLookUpValues(fk, keyValues)
                    }}
                    inputClassName={`
                      rounded-sm border-b-2 border-bg7 dark:border-bg7dark focus:border-prim4 focus:dark:border-prim6
                      p-3 w-full transition-all bg-bg4 dark:bg-bg4dark              
                    `}
                    showLabel={labelPosition == 'top'}
                    styleType={styleType}
                    allowCrud={getAllowCrud(fk)}
                    classNameBg={classNameBg}
                    classNameHoverBg={classNameInputHoverBg}
                    classNameHoverBgDark={classNameInputHoverBgDark}
                    classNameDropdownBg={classNameDropdownBg}
                    classNameDropdownHoverBg={classNameDropdownHoverBg}
                  ></LookUpSelect>
                ),
              }
            })
          : []
      }
      classNameBg={classNameBg}
      classNameInputBg={classNameInputBg}
      classNameInputHoverBg={classNameInputHoverBg}
      classNameInputHoverBgDark={classNameInputHoverBgDark}
      classNameDropdownBg={classNameDropdownBg}
      classNameDropdownHoverBg={classNameDropdownHoverBg}
      readOnly={readOnly}
      isCreation={isCreation}
    ></UForm1>
  )

  // return (
  //   <div className='my-2 h-full'>
  //     {fieldsToDisplay.map((f) => (
  //       <InputField
  //         key={f.name}
  //         inputType={f.type}
  //         label={f.name}
  //         initialValue={getValue(currentEntity, f.name)}
  //         onValueChange={(newValue: any) => changeValue(f, newValue)}
  //         setabilityFlags={f.setabilityFlags}
  //       ></InputField>
  //     ))}
  //     {fkRelationsToDisplay.map((l, i) => (
  //       <LookUpSelect
  //         key={i}
  //         lookUpRelation={l}
  //         dataSourceManager={dataSourceManager}
  //         // initialValue={currentEntity[lowerFirstLetter(l.foreignKeyIndexName)]}
  //         initialValue={getForeignKeyValue(currentEntity, l)}
  //         onValueSet={(keyValues: any) => {
  //           changeLookUpValues(l, keyValues)
  //         }}
  //         inputClassName={`
  //     rounded-sm border-b-2 border-bg7 dark:border-bg7dark focus:border-prim4 focus:dark:border-prim6
  //      p-3 w-full transition-all bg-bg4 dark:bg-bg4dark
  //   `}
  //       ></LookUpSelect>
  //     ))}
  //   </div>
  // )
}

export default UForm
