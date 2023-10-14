import React, { useEffect, useState } from 'react'
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
}> = ({ options, initialOption, onOptionSet, placeholder, forceFocus }) => {
  const [open, setOpen] = useState(false)
  const [currentOption, setCurrentOption] = useState('')
  const [currentMatchingOptions, setcurrentMatchingOptions] = useState<Option[]>([])
  const [currentMatchingOptionIndex, setCurrentMatchingOptionIndex] = useState<number | null>(0)

  useEffect(() => {
    console.log('initial Option changed', initialOption)
    if (!initialOption) {
      return
    }
    setCurrentOption(initialOption.value)
  }, [initialOption])

  useEffect(() => {
    setcurrentMatchingOptions(options)
  }, [options])

  function trySetCurrentOption(fn: string) {
    if (!fn || fn == '') {
      setcurrentMatchingOptions(options)
      setCurrentMatchingOptionIndex(0)
      setCurrentOption('')
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

    setCurrentOption(fn)
    setCurrentMatchingOptionIndex(0)
  }

  function isMatchingOption(option: Option) {
    if (currentMatchingOptions.length == 0) {
      return false
    }
    const matchingOption: Option | undefined = currentMatchingOptions.find((o) => o.label == option.label)
    return matchingOption
  }

  function isCurrentMatchingOption(option: Option) {
    if (currentMatchingOptionIndex == null || currentMatchingOptions.length == 0) {
      return false
    }
    return (
      option.label.toLocaleLowerCase() == currentMatchingOptions[currentMatchingOptionIndex].label.toLocaleLowerCase()
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
      setCurrentOption(currentMatchingOptions[currentMatchingOptionIndex].label)
      notifyOptionSet(currentMatchingOptions[currentMatchingOptionIndex])
      setOpen(false)
    }
    if (e.key == 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      if (currentOption == '') {
        setOpen(false)
        return
      }
      console.log('Escape 1')
      setCurrentOption('')
      setCurrentMatchingOptionIndex(0)
      setcurrentMatchingOptions(options)
      setOpen(true)
    }
  }

  function onSelectOption(o: Option) {
    setCurrentOption(o.label)
    notifyOptionSet(o)
    setOpen(false)
  }

  console.log('current Match Index', currentMatchingOptionIndex)

  return (
    <div onBlur={(e) => setOpen(false)}>
      {/* <button onClick={(e) => setOpen(true)}> */}
      <div className='p-0.5 outline-1 outline-gray-400 outline rounded-sm w-64 focus:z-50 relative flex bg-backgroundone dark:bg-backgroundonedark'>
        <input
          autoFocus={forceFocus}
          className='w-full focus:z-50 relative outline-none bg-backgroundonw dark:bg-backgroundonedark'
          onClick={(e) => setOpen(true)}
          value={currentOption}
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
          <Dropdown leftOffset={0} topOffset={1}>
            <div className='bg-backgroundone dark:bg-backgroundonedark w-64 p-1'>
              {options
                .filter((o) => currentMatchingOptions.length == 0 || isMatchingOption(o))
                .map((o) => (
                  <div
                    className={`cursor-default hover:bg-blue-200 p-0.5 rounded-md  ${
                      isCurrentMatchingOption(o) && 'bg-green-300'
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
