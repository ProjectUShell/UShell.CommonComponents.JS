import React, { useEffect, useMemo, useState } from 'react'
import { EntitySchemaService } from '../../../data/EntitySchemaService'
import GuidInputField from './GuidInputField'
import InputStyle from './InputStyle'
import BoolInputField from './BoolInputField'
import DropdownSelect from '../../../_Atoms/DropdownSelect'
import ExclamationCircleIcon from '../../../_Icons/ExclamationCircleIcon'
import Tooltip from '../../../_Atoms/Tooltip'
import DropdownMultiSelect from '../../../_Atoms/DropdownMultiSelect'
import XMarkIcon from '../../../_Icons/XMarkIcon'

const InputField: React.FC<{
  label: string | null
  inputType: string
  initialValue: any
  onValueChange: (newValue: any, errors: string | null) => void
  allowedValues?: { [key: string]: any }
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
  minWidth?: number
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
  minWidth,
}) => {
  const [currentValue, setCurrentValue] = useState<any>(initialValue)
  useEffect(() => {
    function getInitialValue(initialValue: any): any {
      const htmlType: string = EntitySchemaService.getHtmlInputType(inputType)
      if (htmlType == 'date' || htmlType == 'datetime') {
        if (!initialValue) {
          return undefined
          return new Date().toISOString().replace(/T.*/, '')
        }
        return new Date(initialValue).toISOString().replace(/T.*/, '')
      }
      if (initialValue) return initialValue

      // if (htmlType == 'text') return ''
      // if (htmlType == 'number') return 0

      return initialValue
    }
    setCurrentValue(getInitialValue(initialValue))
  }, [initialValue, inputType])

  const id: string = useMemo(() => crypto.randomUUID(), [])
  const disabled =
    readOnly || (isCreation ? (setabilityFlags & 1) == 0 : (setabilityFlags & 2) == 0)
  const classNameInput: string = getInputStyleClassName(
    styleType,
    classNameBg,
    disabled,
    classNameHoverBg,
    classNameHoverBgDark,
    getErrors(initialValue) != null,
  )

  function getErrors(v: any): string | null {
    const result = EntitySchemaService.getErrors(v, required, inputType)
    // console.log('getErrors', v, required, inputType, label, result)
    return result
  }

  function renderInnerInput() {
    const htmlType: string = EntitySchemaService.getHtmlInputType(inputType)
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
          minWidth={minWidth}
        ></BoolInputField>
      )
    }
    if (allowedValues) {
      if (!allowedValuesSeparator) {
        const options: { label: string; value: any }[] = Object.keys(allowedValues).map((av) => {
          const option: { label: string; value: any } = { label: allowedValues[av], value: av }
          return { label: allowedValues[av], value: av }
        })
        if (!required) {
          options.push({ label: 'Unset', value: undefined })
        }
        return (
          <DropdownSelect
            minWidth={minWidth}
            disabled={disabled}
            classNameBg={classNameBg}
            classNameHoverBg={classNameHoverBg}
            classNameHoverBgDark={classNameHoverBgDark}
            classNameDropdownBg={classNameDropdownBg}
            classNameDropdownHoverBg={classNameDropdownHoverBg}
            styleType={styleType}
            options={options}
            onOptionSet={(o) => {
              onValueChange(o?.value, getErrors(o?.value))
              setCurrentValue(o?.value)
            }}
            initialOption={{ label: allowedValues[initialValue], value: initialValue }}
          ></DropdownSelect>
        )
      } else {
        return (
          <DropdownMultiSelect
            minWidth={minWidth}
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
              onValueChange(newValue, getErrors(newValue))
              setCurrentValue(newValue)
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
            style={{
              width: currentValue ? 'calc(100% - 25px)' : 'calc(100% - 20px)',
              minWidth: minWidth ? `${minWidth}rem` : undefined,
            }}
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
        style={{ minWidth: minWidth ? `${minWidth}rem` : undefined }}
        step={numberDecimals}
        disabled={disabled}
        className={classNameInput}
        type={EntitySchemaService.getHtmlInputType(inputType)}
        placeholder={currentValue || currentValue == 0 || currentValue == '' ? undefined : 'null'}
        value={currentValue || currentValue == 0 || currentValue == '' ? currentValue : ''} //|| (htmlType == 'number' ? 0 : '')
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
        {!required && (currentValue || currentValue == 0 || currentValue == '') && !disabled && (
          <div
            id={`${id}_X`}
            style={{
              marginLeft:
                EntitySchemaService.getHtmlInputType(inputType) == 'text' ? '-2.5rem' : '-4.0rem',
            }}
            className='text-red-500 dark:text-red-400 hover:bg-contentHover dark:hover:bg-contentHoverDark rounded-md w-8'
            onClick={() => {
              setCurrentValue(null)
              onValueChange(null, getErrors(null))
            }}
          >
            <XMarkIcon></XMarkIcon>
            <Tooltip targetId={`${id}_X`}>
              <div className='whitespace-nowrap p-2 border-0 bg-content dark:bg-contentDark border-contentBorder dark:border-contentBorderDark'>
                Set to null
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
        ${classNameBg || 'bg-editor dark:bg-editorDark'}
        ${
          disabled
            ? ''
            : `
           hover:${classNameHoverBg || 'bg-bg5'}
           dark:hover:${classNameHoverBgDark || 'bg-bg5dark'}`
        }
        `
}
