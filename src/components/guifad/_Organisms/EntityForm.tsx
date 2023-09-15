import React, { useState } from 'react'
import { IDataSource } from '../../../ushell-modulebase/lib/iDataSource'
import FloppyDiskIcon from '../../../_Icons/FloppyDiskIcon'
import Group from '../_Atoms/Group'
import InputField from '../_Atoms/InputField'
import { lowerFirstLetter } from '../../../utils/StringUtils'
import { FieldSchema } from 'fusefx-modeldescription'
import XMarkIcon from '../../../_Icons/XMarkIcon'

const EntityForm: React.FC<{
  dataSource: IDataSource
  className?: string
  entity: any
  dirty: boolean
  setDirty: (d: boolean) => void
  onChange: (updatedEntity: any) => void
}> = ({ dataSource, className, entity, dirty, setDirty, onChange }) => {
  const [currentEntity, setCurrentEntity] = useState({ ...entity })

  function save() {
    dataSource.entityUpdateMethod(currentEntity).then((newEntry: any) => {
      console.log('new Record', newEntry)
      onChange(newEntry)
    })
  }

  function changeValue(field: FieldSchema, newValue: any) {
    setDirty(true)

    if (field.type == 'Int32') {
      newValue = Number.parseInt(newValue)
    }
    currentEntity[lowerFirstLetter(lowerFirstLetter(field.name))] = newValue
    console.log('new entity', currentEntity)
  }

  function cancel() {
    console.log('cancel', entity)
    setCurrentEntity(entity)
    setDirty(false)
  }

  return (
    <div className='flex flex-col h-full'>
      <div className={`flex justify-end p-1 ${className} bg-backgroundtwo dark:bg-backgroundtwodark rounded-md mb-2`}>
        {dirty && (
          <button
            disabled={!dirty}
            className='rounded-md p-1 enabled:text-red-400 enabled:dark:text-red-400 enabled:hover:bg-backgroundone enabled:dark:hover:bg-backgroundonedark'
            onClick={(e) => cancel()}
          >
            <XMarkIcon size={6}></XMarkIcon>
          </button>
        )}
        <button
          disabled={!dirty}
          className='rounded-md p-1 enabled:text-blue-400 enabled:dark:text-blue-400 enabled:hover:bg-backgroundone enabled:dark:hover:bg-backgroundonedark'
          onClick={(e) => save()}
        >
          <FloppyDiskIcon size={6}></FloppyDiskIcon>
        </button>
      </div>
      <Group name={dataSource.entitySchema!.name} className='overflow-auto'>
        <div className='my-2'>
          {dataSource.entitySchema!.fields.map((f) => (
            <InputField
              className='my-2'
              key={f.name}
              inputType={f.type}
              label={f.name}
              initialValue={currentEntity[lowerFirstLetter(f.name)]}
              onValueChange={(newValue: any) => changeValue(f, newValue)}
            ></InputField>
          ))}
        </div>
      </Group>
    </div>
  )
}

export default EntityForm
