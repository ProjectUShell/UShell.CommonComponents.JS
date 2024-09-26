import { LogicalExpression } from 'fusefx-repositorycontract'
import React from 'react'
import { TableColumn } from '../components/guifad/_Organisms/Table'
import MultiSelect from '../_Atoms/MultiSelect'

const AvailableStringValuesFilter: React.FC<{
  availableValues: string[]
  initialValues: string[]
  onSelectionChange: (selectedValues: string[]) => void
}> = ({ availableValues, initialValues, onSelectionChange }) => {
  return (
    <MultiSelect
      initialValues={initialValues}
      options={availableValues.sort().map((av) => {
        return { label: av.toString(), value: av }
      })}
      onSelectionChange={onSelectionChange}
    ></MultiSelect>
  )
}

export default AvailableStringValuesFilter
