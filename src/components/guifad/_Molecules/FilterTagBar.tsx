import React from 'react'
import { LogicalExpression } from 'fusefx-repositorycontract'
import { FieldSchema, RelationSchema } from 'fusefx-modeldescription'
import FilterTag from './FilterTag'
import { IDataSourceManagerBase } from 'ushell-modulebase'
import { IDataSourceManagerWidget } from '../_Templates/IDataSourceManagerWidget'

const FilterTagBar: React.FC<{
  filters: LogicalExpression[]
  onUpdateFilters: (f: LogicalExpression[]) => void
  fields: FieldSchema[]
  fkRelations: RelationSchema[]
  className?: string
  dataSourceManagerForNavigations?: IDataSourceManagerWidget
}> = ({
  filters,
  fields,
  fkRelations,
  onUpdateFilters,
  className,
  dataSourceManagerForNavigations,
}) => {
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
            dataSourceManagerForNavigations={dataSourceManagerForNavigations}
            fields={fields}
            fkRelations={fkRelations}
            filter={f}
            onUpdateFilter={(uf) => onFiltersUpdate(uf, i)}
            onDelete={() => deleteFilter(i)}
          ></FilterTag>
        </div>
      ))}
      {filters.length == 0 && <div className='p-2.5'>No Queries</div>}
    </div>
  )
}

export default FilterTagBar
