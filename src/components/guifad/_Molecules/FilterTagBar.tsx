import React from 'react'
import { LogicalExpression } from '../../../fusefx-repositorycontract/LogicalExpression'
import { FieldSchema } from 'fusefx-modeldescription'
import FilterTag from './FilterTag'

const FilterTagBar: React.FC<{
  filters: LogicalExpression[]
  onUpdateFilters: (f: LogicalExpression[]) => void
  fields: FieldSchema[]
  className?: string
}> = ({ filters, fields, onUpdateFilters, className }) => {
  function onFiltersUpdate(f: LogicalExpression, index: number) {
    filters[index] = f
    onUpdateFilters([...filters])
  }

  function deleteFilter(index: number) {
    onUpdateFilters([...filters.filter((f, i) => i !== index)])
  }
  return (
    <div className={`flex justify-start gap-2 ${className} `}>
      {filters.map((f, i) => (
        <div key={i}>
          <FilterTag
            fields={fields}
            filter={f}
            onUpdateFilter={(uf) => onFiltersUpdate(uf, i)}
            onDelete={() => deleteFilter(i)}
          ></FilterTag>
        </div>
      ))}
    </div>
  )
}

export default FilterTagBar
