import React, { useEffect, useState } from 'react'
import { RelationSchema } from 'fusefx-modeldescription'
import { IDataSource, IDataSourceManagerBase } from 'ushell-modulebase'
import DropdownSelect from '../../../_Atoms/DropdownSelect'
import { PaginatedList } from 'fusefx-repositorycontract'

const LookUpSelect: React.FC<{
  dataSourceManager: IDataSourceManagerBase
  lookUpRelation: RelationSchema
  initialValue: any
  onValueSet: (keyValues: any[]) => void
}> = ({ dataSourceManager, lookUpRelation, initialValue, onValueSet }) => {
  const [lookUpList, setLookUpList] = useState<{ label: string; value: string }[]>([])

  console.log('initialValue lookup', initialValue)

  useEffect(() => {
    const dataSource: IDataSource | null = dataSourceManager.tryGetDataSource(lookUpRelation.primaryEntityName)
    if (!dataSource) {
      console.error('No DataSource for LookUps', lookUpRelation)
      return
    }
    dataSource.getEntityRefs().then((r: PaginatedList) => {
      console.log('lookups', r)
      setLookUpList(
        r.page.map((e: any) => {
          return { value: e.key, label: e.label }
        }),
      )
    })
  }, [lookUpRelation, dataSourceManager])

  return (
    <div>
      <label className='block mb-2 text-xs font-medium'>{lookUpRelation.foreignNavigationName}</label>
      <DropdownSelect
        options={lookUpList}
        onOptionSet={(o) => {
          onValueSet(o?.value)
        }}
        initialOption={lookUpList.find((li) => li.value == initialValue)}
        bottomOffset={8}
      ></DropdownSelect>
    </div>
  )
}

export default LookUpSelect
