import React from 'react'
import { getValue, getForeignKeyValue } from '../../../utils/StringUtils'
import Group from '../_Atoms/Group'
import InputField from '../_Atoms/InputField'
import LookUpSelect from './LookUpSelect'
import { FieldSchema, RelationSchema } from 'fusefx-modeldescription'
import { IDataSourceManagerBase } from 'ushell-modulebase'
import UForm1 from './UForm1'
import { IDataSourceManagerWidget } from '../_Templates/IDataSourceManagerWidget'

const UForm: React.FC<{
  fieldsToDisplay: FieldSchema[]
  fkRelationsToDisplay: RelationSchema[]
  currentEntity: any
  changeValue: (field: FieldSchema, newValue: any) => void
  changeLookUpValues: (l: RelationSchema, keyValues: any) => void
  dataSourceManager: IDataSourceManagerWidget
  labelPosition: 'top' | 'left'
  classNameBg?: string
  classNameInputBg?: string
  classNameInputHoverBg?: string
  classNameInputHoverBgDark?: string
}> = ({
  fieldsToDisplay,
  currentEntity,
  changeValue,
  fkRelationsToDisplay,
  dataSourceManager,
  changeLookUpValues,
  labelPosition,
  classNameBg,
  classNameInputBg,
  classNameInputHoverBg,
  classNameInputHoverBgDark,
}) => {
  return (
    <UForm1
      labelPosition={labelPosition}
      fieldsToDisplay={fieldsToDisplay.map((f) => {
        return {
          ...f,
          value: getValue(currentEntity, f.name),
          setValue: (newValue: any) => changeValue(f, newValue),
        }
      })}
      customInputs={fkRelationsToDisplay.map((fk, i) => {
        return {
          label: fk.primaryEntityName,
          render: () => (
            <LookUpSelect
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
            ></LookUpSelect>
          ),
        }
      })}
      classNameBg={classNameBg}
      classNameInputBg={classNameInputBg}
      classNameInputHoverBg={classNameInputHoverBg}
      classNameInputHoverBgDark={classNameInputHoverBgDark}
    ></UForm1>
  )

  return (
    <div className='my-2 h-full'>
      {fieldsToDisplay.map((f) => (
        <InputField
          key={f.name}
          inputType={f.type}
          label={f.name}
          initialValue={getValue(currentEntity, f.name)}
          onValueChange={(newValue: any) => changeValue(f, newValue)}
          setabilityFlags={f.setabilityFlags}
        ></InputField>
      ))}
      {fkRelationsToDisplay.map((l, i) => (
        <LookUpSelect
          key={i}
          lookUpRelation={l}
          dataSourceManager={dataSourceManager}
          // initialValue={currentEntity[lowerFirstLetter(l.foreignKeyIndexName)]}
          initialValue={getForeignKeyValue(currentEntity, l)}
          onValueSet={(keyValues: any) => {
            changeLookUpValues(l, keyValues)
          }}
          inputClassName={`
      rounded-sm border-b-2 border-bg7 dark:border-bg7dark focus:border-prim4 focus:dark:border-prim6
       p-3 w-full transition-all bg-bg4 dark:bg-bg4dark              
    `}
        ></LookUpSelect>
      ))}
    </div>
  )
}

export default UForm