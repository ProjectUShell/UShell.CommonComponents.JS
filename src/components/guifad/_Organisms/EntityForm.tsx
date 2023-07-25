import React, { useState } from 'react'
import { IDataSource } from 'ushell-modulebase'
import FloppyDiskIcon from '../../../_Icons/FloppyDiskIcon'
import Group from '../_Atoms/Group'
import InputField from '../_Atoms/InputField'
import { lowerFirstLetter } from '../../../utils/StringUtils'
import { FieldSchema } from 'fusefx-modeldescription'

const EntityForm: React.FC<{
  dataSource: IDataSource
  className?: string
  entity: any
  dirty: boolean
  setDirty: (d: boolean) => void
}> = ({ dataSource, className, entity, dirty, setDirty }) => {
  function save() {
    dataSource.entityUpdateMethod(entity).then((newEntry: any) => {
      console.log('new Record', newEntry)
      setDirty(false)
    })
  }

  function changeValue(field: FieldSchema, newValue: any) {
    setDirty(true)

    if (field.type == 'Int32') {
      newValue = Number.parseInt(newValue)
    }
    entity[lowerFirstLetter(lowerFirstLetter(field.name))] = newValue
    console.log('new entity', entity)
  }

  return (
    <div>
      <div className={`flex justify-end p-1 ${className} bg-backgroundtwo dark:bg-backgroundtwodark rounded-md mb-2`}>
        <button
          disabled={!dirty}
          className='rounded-md p-1 enabled:text-blue-400 enabled:dark:text-blue-400 enabled:hover:bg-backgroundone enabled:dark:hover:bg-backgroundonedark'
          onClick={(e) => save()}
        >
          <FloppyDiskIcon size={6}></FloppyDiskIcon>
        </button>
      </div>
      <Group name={dataSource.entitySchema!.name}>
        <div className='my-2'>
          {dataSource.entitySchema!.fields.map((f) => (
            <InputField
              className='my-2'
              key={f.name}
              inputType={f.type}
              label={f.name}
              initialValue={entity[lowerFirstLetter(f.name)]}
              onValueChange={(newValue: any) => changeValue(f, newValue)}
            ></InputField>
          ))}
        </div>
      </Group>
    </div>
  )
}

export default EntityForm
