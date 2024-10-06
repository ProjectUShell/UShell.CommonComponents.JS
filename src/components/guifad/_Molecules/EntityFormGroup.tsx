import { FieldSchema, RelationSchema } from 'fusefx-modeldescription'
import React from 'react'
import { IDataSourceManagerBase } from 'ushell-modulebase'
import { getValue, getForeignKeyValue } from '../../../utils/StringUtils'
import Group from '../_Atoms/Group'
import InputField from '../_Atoms/InputField'
import LookUpSelect from './LookUpSelect'
import { EntityLayout, LayoutPartition } from '../../../[Move2LayoutDescription]/EntityLayout'
import UForm from './UForm'
import { IDataSourceManagerWidget } from '../_Templates/IDataSourceManagerWidget'
import { FieldLayout } from '../../../[Move2LayoutDescription]/FieldLayout'

const EntityFormGroup: React.FC<{
  label?: string
  allFields: FieldSchema[]
  fieldsToDisplay: FieldSchema[]
  currentEntity: any
  changeValue: (field: FieldSchema, newValue: any) => void
  fkRelations: RelationSchema[]
  fkRelationsToDisplay: RelationSchema[]
  dataSourceManager?: IDataSourceManagerWidget
  changeLookUpValues: (l: RelationSchema, keyValues: any) => void
  partitions: LayoutPartition[]
  labelPosition: 'left' | 'top'
  fieldLayouts: FieldLayout[]
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
  labelPosition,
  fieldLayouts,
}) => {
  return (
    <>
      {partitions.length > 0 && (
        <Group name={label} className='overflow-auto1 bg-bg1 dark:bg-bg2dark p-1 rounded-md'>
          <div className='flex gap-1 w-full h-full border-0 border-red-400'>
            {partitions
              .filter((p) => p.type == 'column')
              .map((p) => (
                <div key={p.name} className='w-full h-full'>
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
                    labelPosition={labelPosition}
                    fieldLayouts={fieldLayouts}
                  ></EntityFormGroup>
                </div>
              ))}
          </div>
        </Group>
      )}
      {(fieldsToDisplay.length > 0 || fkRelationsToDisplay.length > 0) && (
        <Group name={label} className='overflow-auto1 bg-bg1 dark:bg-bg2dark p-1 rounded-md'>
          <UForm
            changeLookUpValues={changeLookUpValues}
            changeValue={changeValue}
            currentEntity={currentEntity}
            dataSourceManager={dataSourceManager}
            fieldsToDisplay={fieldsToDisplay}
            fkRelationsToDisplay={fkRelationsToDisplay}
            labelPosition={labelPosition}
            fieldLayouts={fieldLayouts}
          ></UForm>
        </Group>
      )}
    </>
  )
}

export default EntityFormGroup
