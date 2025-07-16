import React, { useEffect, useMemo, useState } from 'react'
import MultiSelect, { Option } from '../../../_Atoms/MultiSelect'
import EyeIcon from '../../../_Icons/EyeIcon'
import DropdownMultiSelect from '../../../_Atoms/DropdownMultiSelect'

interface ColumnSelectorProps {
  entityName: string
  columns: { label: string; key: string }[]
  selectedColumnKeys: string[]
  onChange: (selected: string[]) => void
}

const getStorageKey = (entityName: string) => `columnSelector_${entityName}`

const ColumnSelector: React.FC<ColumnSelectorProps> = ({
  entityName,
  columns,
  selectedColumnKeys,
  onChange,
}) => {
  const [ready, setReady] = useState('')
  const options: Option[] = columns.map((c) => ({
    label: c.label,
    value: c.key,
  }))

  // Load from localStorage on mount
  useEffect(() => {
    // console.log('Loading selected columns from localStorage for entity:', entityName)
    const stored = localStorage.getItem(getStorageKey(entityName))
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          // console.log('Loaded selected columns from localStorage:', parsed)
          onChange(parsed)
        }
      } catch {}
    }
    setReady(entityName)
    // eslint-disable-next-line
  }, [entityName])

  if (ready !== entityName) {
    return <div className='flex items-center justify-center'>Loading...</div>
  }

  // Persist to localStorage on change
  // useEffect(() => {
  //   console.log('Saving selected columns:', selectedColumnKeys)
  //   localStorage.setItem(getStorageKey(entityName), JSON.stringify(selectedColumnKeys))
  // }, [entityName, selectedColumnKeys])
  // console.log('Rendering ColumnSelector:', selectedColumnKeys)
  return (
    <div className='relative flex items-center'>
      <DropdownMultiSelect
        options={options}
        initialOptions={options.filter((o) => selectedColumnKeys.includes(o.value))}
        onOptionsSet={(opts) => {
          const selected = opts.map((o) => o.value)
          // console.log('Saving selected columns:', selected)
          localStorage.setItem(getStorageKey(entityName), JSON.stringify(selected))
          onChange(selected)
        }}
        styleType={1}
        classNameBg='bg-content dark:bg-contentDark'
      />
    </div>
  )
}

export default ColumnSelector
