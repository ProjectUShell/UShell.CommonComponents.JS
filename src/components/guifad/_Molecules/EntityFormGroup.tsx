import { FieldSchema, RelationSchema } from 'fusefx-modeldescription'
import React from 'react'
import { IDataSourceManagerBase } from 'ushell-modulebase'
import { getValue, getForeignKeyValue } from '../../../utils/StringUtils'
import Group from '../_Atoms/Group'
import InputField from '../_Atoms/InputField'
import LookUpSelect from './LookUpSelect'
import { EntityLayout, LayoutPartition } from '../../../[Move2LayoutDescription]/EntityLayout'

const EntityFormGroup: React.FC<{
  label?: string
  allFields: FieldSchema[]
  fieldsToDisplay: FieldSchema[]
  currentEntity: any
  changeValue: (field: FieldSchema, newValue: any) => void
  fkRelations: RelationSchema[]
  fkRelationsToDisplay: RelationSchema[]
  dataSourceManager: IDataSourceManagerBase
  changeLookUpValues: (l: RelationSchema, keyValues: any) => void
  partitions: LayoutPartition[]
}> = ({
  label,
  allFields,
  fieldsToDisplay,
  currentEntity,
  changeValue,
  fkRelations,
  fkRelationsToDisplay,
  dataSourceManager,
  changeLookUpValues,
  partitions,
}) => {
  return (
    <>
      {partitions.length > 0 && (
        <Group name={label} className='overflow-auto h-full bg-bg1 dark:bg-bg2dark p-1 rounded-md'>
          <div className='flex gap-1 w-full border-0 border-red-400'>
            {partitions
              .filter((p) => p.type == 'column')
              .map((p) => (
                <div key={p.name} className='w-full'>
                  <EntityFormGroup
                    allFields={allFields}
                    fieldsToDisplay={allFields.filter((f) => p.fields.includes(f.name))}
                    currentEntity={currentEntity}
                    changeValue={changeValue}
                    fkRelations={fkRelations}
                    fkRelationsToDisplay={fkRelations.filter((fk) =>
                      p.fields.includes(fk.primaryEntityName),
                    )}
                    dataSourceManager={dataSourceManager}
                    changeLookUpValues={changeLookUpValues}
                    partitions={p.children}
                  ></EntityFormGroup>
                </div>
              ))}
          </div>
        </Group>
      )}
      {(fieldsToDisplay.length > 0 || fkRelationsToDisplay.length > 0) && (
        <Group name={label} className='overflow-auto h-full bg-bg1 dark:bg-bg2dark p-1 rounded-md'>
          <div className='my-2'>
            {fieldsToDisplay.map((f) => (
              <InputField
                className='my-2'
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
        </Group>
      )}
    </>
  )
}

export default EntityFormGroup
