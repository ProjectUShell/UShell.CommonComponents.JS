import React, { useEffect, useRef, useState } from 'react'
import { Option } from './MultiSelect'
import Dropdown from './Dropdown'
import FunnelIcon from '../_Icons/FunnelIcon'
import ArrowUpDownIcon from '../_Icons/ArrowUpDownIcon'
import ChevrodnDownIcon from '../_Icons/ChevrodnDownIcon'
import XMarkIcon from '../_Icons/XMarkIcon'

const DropdownSelect: React.FC<{
  options: Option[]
  initialOption?: Option | null
  onOptionSet?: (o: Option | null) => void
  placeholder?: string
  forceFocus?: boolean
  topOffset?: number
  bottomOffset?: number
}> = ({
  options,
  initialOption,
  onOptionSet,
  placeholder,
  forceFocus,
  topOffset,
  bottomOffset,
}) => {
  console.log('DropdownSelect render', initialOption)
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
  return (
    <div onBlur={(e) => setOpen(false)}>
      {/* <button onClick={(e) => setOpen(true)}> */}
      <div
        ref={ref}
        className='p-0.5 w-full rounded-sm focus:z-50 relative flex bg-bg2 dark:bg-bg2dark'
      >
        <input
          autoFocus={forceFocus}
          className='w-full focus:z-50 relative outline-none bg-bg2 dark:bg-bg2dark'
          onClick={(e) => setOpen(true)}
          value={currentText}
          type='text'
          onChange={(e) => trySetCurrentOption(e.target.value)}
          onKeyDown={(e) => onInputKeyDown(e)}
          placeholder={placeholder || 'enter valid value'}
        ></input>
        {!open ? (
          <button tabIndex={-1} onClick={() => setOpen(true)}>
            <ChevrodnDownIcon></ChevrodnDownIcon>
          </button>
        ) : (
          <button tabIndex={-1} onClick={() => setOpen(false)}>
            <XMarkIcon size={2}></XMarkIcon>
          </button>
        )}
      </div>
      {/* </button> */}
      {open && (
        <div className={`${open ? '' : ''}`}>
          <Dropdown
            leftOffset={0}
            bottomOffset={bottomOffset ? bottomOffset : undefined}
            topOffset={topOffset ? topOffset : undefined}
            minWidthRef={ref}
          >
            <div className='bg-bg2 dark:bg-bg2dark w-full p-1 rounded-b-md border-0'>
              {options
                .filter((o) => currentMatchingOptions.length == 0 || isMatchingOption(o))
                .map((o) => (
                  <div
                    className={`cursor-default hover:bg-blue-200 p-0.5 rounded-md  ${
                      isCurrentMatchingOption(o) && 'bg-backgroundtwo dark:bg-backgroundtwodark'
                    } ${currentOption?.value == o.value ? 'bg-green-300 dark:bg-green-600' : ''}`}
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
