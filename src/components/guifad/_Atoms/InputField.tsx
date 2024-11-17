import React, { useEffect, useMemo, useState } from 'react'
import { EntitySchemaService } from '../../../data/EntitySchemaService'
import GuidInputField from './GuidInputField'
import InputStyle from './InputStyle'
import BoolInputField from './BoolInputField'
import DropdownSelect from '../../../_Atoms/DropdownSelect'
import ExclamationCircleIcon from '../../../_Icons/ExclamationCircleIcon'
import Tooltip from '../../../_Atoms/Tooltip'
import DropdownMultiSelect from '../../../_Atoms/DropdownMultiSelect'

const InputField: React.FC<{
  label: string | null
  inputType: string
  initialValue: any
  onValueChange: (newValue: any, errors: string | null) => void
  allowedValues?: { [key: string]: string }
  allowedValuesSeparator?: string | null
  setabilityFlags?: number
  classNameBg?: string
  classNameHoverBg?: string
  classNameHoverBgDark?: string
  classNameDropdownBg?: string
  classNameDropdownHoverBg?: string
  multiLine?: boolean
  styleType?: number
  readOnly?: boolean
  isCreation?: boolean
  required?: boolean
  numberDecimals?: number
  unit?: string
}> = ({
  label,
  inputType,
  initialValue,
  onValueChange,
  allowedValues,
  allowedValuesSeparator = null,
  setabilityFlags = 7,
  classNameBg,
  classNameHoverBg,
  classNameHoverBgDark,
  classNameDropdownBg,
  classNameDropdownHoverBg,
  multiLine = false,
  styleType = 0,
  readOnly = false,
  isCreation = false,
  required = false,
  numberDecimals = 0,
  unit,
}) => {
  const [currentValue, setCurrentValue] = useState<any>(initialValue)
  useEffect(() => {
    function getInitialValue(initialValue: any): any {
      const htmlType: string = EntitySchemaService.getHtmlInputType(inputType)
      if (htmlType == 'date') {
        if (!initialValue) {
          return undefined
          return new Date().toISOString().replace(/T.*/, '')
        }
        return new Date(initialValue).toISOString().replace(/T.*/, '')
      }
      if (initialValue) return initialValue

      if (htmlType == 'text') return ''
      if (htmlType == 'number') return 0

      return initialValue
    }
    setCurrentValue(getInitialValue(initialValue))
  }, [initialValue, inputType])

  const id: string = useMemo(() => crypto.randomUUID(), [])

  const fixAfterCreation: boolean = setabilityFlags < 6 //TODO adjust setability check after Fix in EntityAnnotations
  const disabled: boolean = readOnly || (fixAfterCreation && !isCreation)
  const classNameInput: string = getInputStyleClassName(
    styleType,
    classNameBg,
    disabled,
    classNameHoverBg,
    classNameHoverBgDark,
    getErrors(initialValue) != null,
  )

  function getErrors(v: any): string | null {
    return EntitySchemaService.getErrors(v, required, inputType)
  }

  function renderInnerInput() {
    if (inputType.toLocaleLowerCase() == 'guid') {
      return (
        <GuidInputField
          initialValue={initialValue}
          currentValue={currentValue}
          setCurrentValue={setCurrentValue}
          onValueChange={(nv) => onValueChange(nv, getErrors(nv))}
          disabled={disabled}
          classNameBg={classNameBg}
          classNameHoverBg={classNameHoverBg}
          classNameHoverBgDark={classNameHoverBgDark}
          styleType={styleType}
          hasErrors={getErrors(initialValue) != null}
        ></GuidInputField>
      )
    }
    if (inputType.toLocaleLowerCase() == 'bool' || inputType.toLocaleLowerCase() == 'boolean') {
      return (
        <BoolInputField
          initialValue={initialValue}
          currentValue={currentValue}
          setCurrentValue={setCurrentValue}
          onValueChange={(nv) => {
            onValueChange(nv, getErrors(nv))
          }}
          disabled={disabled}
          classNameBg={classNameBg}
          classNameHoverBg={classNameHoverBg}
          classNameHoverBgDark={classNameHoverBgDark}
          classNameDropdownBg={classNameDropdownBg}
          classNameDropdownHoverBg={classNameDropdownHoverBg}
          styleType={styleType}
          required={required}
        ></BoolInputField>
      )
    }
    if (allowedValues) {
      if (!allowedValuesSeparator) {
        const options: any[] = Object.keys(allowedValues).map((av) => {
          return { label: allowedValues[av], value: av }
        })
        if (!required) {
          options.push({ label: 'Unset', value: undefined })
        }
        return (
          <DropdownSelect
            disabled={disabled}
            classNameBg={classNameBg}
            classNameHoverBg={classNameHoverBg}
            classNameHoverBgDark={classNameHoverBgDark}
            classNameDropdownBg={classNameDropdownBg}
            classNameDropdownHoverBg={classNameDropdownHoverBg}
            styleType={styleType}
            options={options}
            onOptionSet={(o) => {
              setCurrentValue(o?.value)
              onValueChange(o?.value, getErrors(o?.value))
            }}
            initialOption={{ label: allowedValues[initialValue], value: initialValue }}
          ></DropdownSelect>
        )
      } else {
        return (
          <DropdownMultiSelect
            classNameBg={classNameBg}
            classNameHoverBg={classNameHoverBg}
            classNameHoverBgDark={classNameHoverBgDark}
            styleType={styleType}
            options={Object.keys(allowedValues).map((av) => {
              return { label: allowedValues[av], value: av }
            })}
            onOptionsSet={(opts: any[]) => {
              const newValue =
                opts && opts.length > 0
                  ? opts.reduce(
                      (o1: any, o2: any, i) =>
                        i > 0 ? o1 + allowedValuesSeparator + o2.value : o2.value,
                      '',
                    )
                  : ''
              setCurrentValue(newValue)
              onValueChange(newValue, getErrors(newValue))
            }}
            initialOptions={initialValue
              ?.toString()
              .split(allowedValuesSeparator)
              .map((s: string) => {
                return { label: s, value: s }
              })}
          ></DropdownMultiSelect>
        )
      }
    }
    if (EntitySchemaService.getHtmlInputType(inputType) == 'text' && multiLine) {
      return (
        <textarea
          rows={4}
          disabled={disabled}
          className={classNameInput}
          value={currentValue}
          onChange={(e) => {
            onValueChange(e.target.value, getErrors(e.target.value))
            setCurrentValue(e.target.value)
          }}
        ></textarea>
      )
    }
    if (unit) {
      return (
        // <div className={`before:content-['${unit}'] ` + classNameInput}>
        // <div className={`before:content-['${unit}']`}>
        <div data-content={unit} className={`Unit overflow-hidden w-full ` + classNameInput}>
          <input
            style={{ width: currentValue ? 'calc(100% - 25px)' : 'calc(100% - 20px)' }}
            step={numberDecimals}
            value={currentValue ? currentValue.toLocaleString('en') : ''}
            onChange={(e) => {
              onValueChange(e.target.value, getErrors(e.target.value))
              setCurrentValue(e.target.value)
            }}
            type={EntitySchemaService.getHtmlInputType(inputType)}
            className='px-1 outline-none bg-transparent overflow-hidden'
          ></input>
        </div>
      )
    }
    return (
      <input
        step={numberDecimals}
        disabled={disabled}
        className={classNameInput}
        type={EntitySchemaService.getHtmlInputType(inputType)}
        value={currentValue || ''}
        onChange={(e) => {
          onValueChange(e.target.value, getErrors(e.target.value))
          setCurrentValue(e.target.value)
        }}
      ></input>
    )
  }
  const errors: string | null = getErrors(initialValue)
  return (
    <div className={`w-full ${false ? 'flex justify-between gap-2 items-baseline ' : ''}`}>
      {label && (
        <label className='block mb-2 text-xs font-medium whitespace-nowrap align-baseline'>
          {label}
        </label>
      )}
      <div className='flex items-center'>
        <div className='w-full'>{renderInnerInput()}</div>
        {errors != null && (
          <div id={id} className='text-red-500 dark:text-red-400 pl-1 w-8'>
            <ExclamationCircleIcon></ExclamationCircleIcon>
            <Tooltip targetId={id}>
              <div className='whitespace-nowrap p-2 border-0 bg-content dark:bg-contentDark border-contentBorder dark:border-contentBorderDark'>
                {errors}
              </div>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  )
}

export default InputField
export function getInputStyleClassName(
  styleType: number,
  classNameBg: string | undefined,
  disabled: boolean,
  classNameHoverBg: string | undefined,
  classNameHoverBgDark: string | undefined,
  hasErrors: boolean,
): string {
  return `text-sm rounded-sm p-3 outline-none block w-full transition-all 
     border-bg7 dark:border-bg7dark ${
       hasErrors
         ? 'focus:border-red-500 dark:focus:border-red-400'
         : 'focus:border-prim4 dark:focus:border-prim6'
     }
        ${styleType == 0 ? 'border-b-2   ' : 'border-2 '}          
        ${classNameBg || 'bg-bg3 dark:bg-bg3dark'}
        ${
          disabled
            ? ''
            : `
           hover:${classNameHoverBg || 'bg-bg5'}
           dark:hover:${classNameHoverBgDark || 'bg-bg5dark'}`
        }
        `
}
