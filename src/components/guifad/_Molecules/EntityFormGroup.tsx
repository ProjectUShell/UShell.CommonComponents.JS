import { FieldSchema, RelationSchema } from 'fusefx-modeldescription'
import React from 'react'
import Group from '../_Atoms/Group'
import { LayoutPartition } from '../../../[Move2LayoutDescription]/EntityLayout'
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
  readOnly: boolean
  classNameBg?: string
  classNameInputBg?: string
  classNameInputHoverBg?: string
  classNameInputHoverBgDark?: string
  styleType?: number
  isCreation?: boolean
  onValidationChanged?: (errors: { [fieldName: string]: string | null }) => void
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
  readOnly,
  classNameBg,
  classNameInputBg,
  classNameInputHoverBg,
  classNameInputHoverBgDark,
  styleType = 0,
  isCreation = false,
  onValidationChanged,
}) => {
  return (
    <>
      {partitions.length > 0 && (
        <Group name={label} className='p-1 rounded-md'>
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
                    readOnly={readOnly}
                    classNameBg={classNameBg}
                    classNameInputBg={classNameInputBg}
                    classNameInputHoverBg={classNameInputHoverBg}
                    classNameInputHoverBgDark={classNameInputHoverBgDark}
                    styleType={styleType}
                    isCreation={isCreation}
                    onValidationChanged={onValidationChanged}
                  ></EntityFormGroup>
                </div>
              ))}
          </div>
        </Group>
      )}
      {(fieldsToDisplay.length > 0 || fkRelationsToDisplay.length > 0) && (
        <Group name={label} className='p-1'>
          <UForm
            changeLookUpValues={changeLookUpValues}
            changeValue={changeValue}
            currentEntity={currentEntity}
            dataSourceManager={dataSourceManager}
            fieldsToDisplay={fieldsToDisplay}
            fkRelationsToDisplay={fkRelationsToDisplay}
            labelPosition={labelPosition}
            fieldLayouts={fieldLayouts}
            readOnly={readOnly}
            classNameBg={classNameBg}
            classNameInputBg={classNameInputBg}
            classNameInputHoverBg={classNameInputHoverBg}
            classNameInputHoverBgDark={classNameInputHoverBgDark}
            styleType={styleType}
            isCreation={isCreation}
            onValidationChanged={onValidationChanged}
          ></UForm>
        </Group>
      )}
    </>
  )
}

export default EntityFormGroup
