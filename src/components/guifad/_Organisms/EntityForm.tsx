import React from 'react'
import { IDataSource } from 'ushell-modulebase'
import FloppyDiskIcon from '../../../_Icons/FloppyDiskIcon'
import Group from '../_Atoms/Group'
import InputField from '../_Atoms/InputField'
import { lowerFirstLetter } from '../../../utils/StringUtils'

const EntityForm: React.FC<{ dataSource: IDataSource; className?: string; entity: any }> = ({
  dataSource,
  className,
  entity,
}) => {
  function save() {
    dataSource.entityUpdateMethod(entity).then((newEntry: any) => {
      console.log('new Record', newEntry)
    })
  }

  return (
    <div>
      <div className={`flex justify-end p-1 ${className} bg-backgroundtwo dark:bg-backgroundtwodark rounded-md mb-2`}>
        <button
          className='rounded-md p-1 text-blue-400 dark:text-blue-400 hover:bg-backgroundone dark:hover:bg-backgroundonedark'
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
              inputType='string'
              label={f.name}
              initialValue={entity[lowerFirstLetter(f.name)]}
              onValueChange={(newValue: any) => {
                entity[lowerFirstLetter(f.name)] = newValue
                console.log('new entity', entity)
              }}
            ></InputField>
          ))}
        </div>
      </Group>
    </div>
  )
}

export default EntityForm
