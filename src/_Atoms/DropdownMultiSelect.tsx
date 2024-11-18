import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Option } from './MultiSelect'
import Dropdown from './Dropdown'
import FunnelIcon from '../_Icons/FunnelIcon'
import ArrowUpDownIcon from '../_Icons/ArrowUpDownIcon'
import ChevrodnDownIcon from '../_Icons/ChevrodnDownIcon'
import XMarkIcon from '../_Icons/XMarkIcon'
import { getInputStyleClassName } from '../components/guifad/_Atoms/InputField'

const DropdownMultiSelect: React.FC<{
  options: Option[]
  initialOptions?: Option[]
  onOptionsSet?: (o: Option[]) => void
  placeholder?: string
  forceFocus?: boolean
  topOffset?: number
  bottomOffset?: number
  styleType?: number
  classNameBg?: string
  classNameHoverBg?: string
  classNameHoverBgDark?: string
  minWidth?: number
}> = ({
  options,
  initialOptions = [],
  onOptionsSet,
  placeholder,
  forceFocus,
  topOffset,
  bottomOffset,
  styleType = 0,
  classNameBg,
  classNameHoverBg,
  classNameHoverBgDark,
  minWidth,
}) => {
  const [open, setOpen] = useState(false)
  const [currentOptions, setCurrentOptions] = useState<Option[]>(initialOptions)

  // useEffect(() => {
  //   setCurrentOptions(initialOptions)
  // }, [initialOptions])

  useEffect(() => {
    notifyOptionsSet()
  }, [currentOptions])

  function notifyOptionsSet() {
    if (onOptionsSet) {
      onOptionsSet(currentOptions)
    }
  }

  function onSelectOption(o: Option) {
    const currentIndex: number = currentOptions.findIndex((co) => co.value == o.value)
    if (currentIndex >= 0) {
      setCurrentOptions((cos) => {
        cos.splice(currentIndex, 1)
        return [...cos]
      })
    } else {
      setCurrentOptions([...currentOptions, o])
    }
  }

  function isOptionSelected(o: Option): boolean {
    return currentOptions.findIndex((co) => co.value == o.value) >= 0
  }

  function getLabel(): string {
    if (currentOptions.length == 0) return 'Select values'
    return currentOptions.map((co) => co.label).reduce((a, b) => a + ', ' + b)
  }

  const ref: any = useRef()
  const refId: string = useMemo(() => {
    return 'UShell_DropdownSelect_' + crypto.randomUUID()
  }, [])

  return (
    <div className='w-full' onBlur={(e) => setOpen(false)}>
      {/* <button onClick={(e) => setOpen(true)}> */}
      <div
        id={refId}
        ref={ref}
        className='p-0 w-full rounded-sm focus:z-50 relative flex
         bg-bg1 dark:bg-bg2dark border-0 border-red-400'
      >
        <input
          style={{ minWidth: minWidth ? `${minWidth}rem` : undefined }}
          readOnly
          autoFocus={forceFocus}
          className={`w-full focus:z-50 relative outline-none             
            ${getInputStyleClassName(
              styleType,
              classNameBg,
              false,
              classNameHoverBg,
              classNameHoverBgDark,
              false,
            )}`}
          onClick={(e) => setOpen(true)}
          value={getLabel()}
          type='text'
          placeholder={placeholder || 'enter valid value'}
        ></input>
      </div>
      {open && (
        <div className={`${open ? '' : ''}`}>
          <Dropdown
            refId={refId}
            leftOffset={0}
            bottomOffset={bottomOffset ? bottomOffset : undefined}
            topOffset={topOffset ? topOffset : undefined}
            minWidth={true}
          >
            <div
              className={`w-full p-0 border-2 dark:border-bg6dark ${
                classNameBg || 'bg-content dark:bg-contentDark'
              }`}
            >
              {options.map((o) => (
                <div
                  className={`cursor-default  p-2 ${
                    isOptionSelected(o)
                      ? 'bg-prim2 dark:bg-prim2Dark'
                      : 'hover:bg-bg7 dark:hover:bg-bg7dark'
                  }`}
                  key={o.value}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onSelectOption(o)
                  }}
                >
                  {o.label}
                </div>
              ))}
            </div>
          </Dropdown>
        </div>
      )}
    </div>
  )
}

export default DropdownMultiSelect
