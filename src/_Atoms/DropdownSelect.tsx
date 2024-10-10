import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Option } from './MultiSelect'
import Dropdown from './Dropdown'
import FunnelIcon from '../_Icons/FunnelIcon'
import ArrowUpDownIcon from '../_Icons/ArrowUpDownIcon'
import ChevrodnDownIcon from '../_Icons/ChevrodnDownIcon'
import XMarkIcon from '../_Icons/XMarkIcon'
import { getInputStyleClassName } from '../components/guifad/_Atoms/InputField'

const DropdownSelect: React.FC<{
  options: Option[]
  initialOption?: Option | null
  onOptionSet?: (o: Option | null) => void
  placeholder?: string
  forceFocus?: boolean
  disabled?: boolean
  topOffset?: number
  bottomOffset?: number
  styleType?: number
  classNameBg?: string
  classNameHoverBg?: string
  classNameHoverBgDark?: string
}> = ({
  options,
  initialOption,
  onOptionSet,
  placeholder,
  forceFocus,
  disabled = false,
  topOffset,
  bottomOffset,
  styleType = 0,
  classNameBg,
  classNameHoverBg,
  classNameHoverBgDark,
}) => {
  const [open, setOpen] = useState(false)
  const [currentOption, setCurrentOption] = useState<Option | null | undefined>(initialOption)
  const [currentText, setCurrentText] = useState<string>(initialOption ? initialOption.label : '')
  const [currentMatchingOptions, setcurrentMatchingOptions] = useState<Option[]>([])
  const [currentMatchingOptionIndex, setCurrentMatchingOptionIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!initialOption) {
      setCurrentOption(undefined)
      setCurrentText('')
      return
    }
    setCurrentOption(initialOption)
    setCurrentText(initialOption.label)
  }, [initialOption])

  useEffect(() => {
    setcurrentMatchingOptions(options)
  }, [options])

  function trySetCurrentOption(fn: string) {
    setCurrentText(fn)
    if (!fn || fn == '') {
      setcurrentMatchingOptions(options)
      setCurrentMatchingOptionIndex(0)
      setCurrentOption(null)
      notifyOptionSet(null)
      return
    }

    const matchingOptions: Option[] = options.filter((o) =>
      o.label.toLocaleLowerCase().startsWith(fn.toLocaleLowerCase()),
    )
    setcurrentMatchingOptions(matchingOptions)
    if (matchingOptions.length == 0) {
      setCurrentMatchingOptionIndex(null)
      return
    }

    const singleMatchingOption: Option | undefined = options.find((o) => o.label == fn)
    if (singleMatchingOption) {
      setCurrentOption(singleMatchingOption)
      notifyOptionSet(singleMatchingOption)
    }
    setCurrentMatchingOptionIndex(0)
  }

  function isMatchingOption(option: Option) {
    if (currentMatchingOptions.length == 0) {
      return false
    }
    const matchingOption: Option | undefined = currentMatchingOptions.find(
      (o) => o.label == option.label,
    )
    return matchingOption
  }

  function isCurrentMatchingOption(option: Option) {
    if (currentMatchingOptionIndex == null || currentMatchingOptions.length == 0) {
      return false
    }
    return (
      option.label.toLocaleLowerCase() ==
      currentMatchingOptions[currentMatchingOptionIndex].label.toLocaleLowerCase()
    )
  }

  function notifyOptionSet(option: Option | null) {
    if (onOptionSet) {
      onOptionSet(option)
    }
  }

  function onInputKeyDown(e: any) {
    setOpen(true)
    if (e.key == 'ArrowDown') {
      e.preventDefault()
      setCurrentMatchingOptionIndex((i: number | null) => {
        if (i == null) {
          return i
        }
        if (i < currentMatchingOptions.length - 1) {
          return i + 1
        }
        return i
      })
    }
    if (e.key == 'ArrowUp') {
      e.preventDefault()
      setCurrentMatchingOptionIndex((i: number | null) => {
        if (i == null) {
          return i
        }
        if (i > 0) {
          return i - 1
        }
        return i
      })
    }
    if (e.key == 'Enter' || e.key == 'Tab') {
      if (!open) {
        return
      }
      // if (e.key == 'Enter') {
      //   e.preventDefault()
      // }
      if (currentMatchingOptionIndex == null) {
        return
      }
      setCurrentOption(currentMatchingOptions[currentMatchingOptionIndex])
      setCurrentText(currentMatchingOptions[currentMatchingOptionIndex].label)
      notifyOptionSet(currentMatchingOptions[currentMatchingOptionIndex])
      setOpen(false)
    }
    if (e.key == 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      if (!currentOption) {
        setOpen(false)
        return
      }
      setCurrentOption(null)
      setCurrentMatchingOptionIndex(0)
      setcurrentMatchingOptions(options)
      setOpen(true)
    }
    if (e.key == 'Backspace') {
      // e.preventDefault()
    }
  }

  function onSelectOption(o: Option) {
    setCurrentOption(o)
    setCurrentText(o.label)
    notifyOptionSet(o)
    setOpen(false)
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
          autoFocus={forceFocus}
          disabled={disabled}
          className={`w-full focus:z-50 relative outline-none             
            ${getInputStyleClassName(
              styleType,
              classNameBg,
              disabled,
              classNameHoverBg,
              classNameHoverBgDark,
            )}`}
          onClick={(e) => setOpen(true)}
          value={currentText || ''}
          type='text'
          onChange={(e) => trySetCurrentOption(e.target.value)}
          onKeyDown={(e) => onInputKeyDown(e)}
          placeholder={placeholder || 'enter valid value'}
        ></input>
        {/* {!open ? (
          <button tabIndex={-1} onClick={() => setOpen(true)}>
            <ChevrodnDownIcon></ChevrodnDownIcon>
          </button>
        ) : (
          <button tabIndex={-1} onClick={() => setOpen(false)}>
            <XMarkIcon size={2}></XMarkIcon>
          </button>
        )} */}
      </div>
      {/* </button> */}
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
              className={`w-full p-0 border-2 dark:border-bg4dark ${
                classNameBg || 'bg-content dark:bg-contentDark'
              }`}
            >
              {options
                .filter((o) => currentMatchingOptions.length == 0 || isMatchingOption(o))
                .map((o) => (
                  <div
                    className={`cursor-default  p-1  ${
                      isCurrentMatchingOption(o) && 'bg1-backgroundtwo dark:bg1-backgroundtwodark'
                    } ${
                      currentOption?.value == o.value
                        ? 'bg-prim2 dark:bg-prim4'
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

export default DropdownSelect
