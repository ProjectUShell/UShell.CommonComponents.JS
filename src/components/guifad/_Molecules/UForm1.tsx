import React from 'react'
import InputField from '../_Atoms/InputField'
import { FieldLayout } from '../../../[Move2LayoutDescription]/FieldLayout'

export class FieldInputInfo {
  name: string = ''
  type: string = ''
  setabilityFlags: number = 0
  value: any
  setValue: (v: any) => void = () => {}
}

const UForm1: React.FC<{
  fieldsToDisplay: FieldInputInfo[]
  labelPosition: 'top' | 'left'
  fieldLayouts: FieldLayout[]
  customInputs?: { label: string; render: () => JSX.Element }[]
  classNameBg?: string
  classNameInputBg?: string
  classNameInputHoverBg?: string
  classNameInputHoverBgDark?: string
  styleType?: number
  readOnly?: boolean
}> = ({
  fieldsToDisplay,
  labelPosition,
  fieldLayouts,
  customInputs = [],
  classNameBg,
  classNameInputBg,
  classNameInputHoverBg,
  classNameInputHoverBgDark,
  styleType = 0,
  readOnly = false,
}) => {
  function getLabel(f: FieldInputInfo) {
    const fieldLayout: FieldLayout | undefined = fieldLayouts.find((fl) => fl.fieldName == f.name)
    if (!fieldLayout) return f.name
    return fieldLayout.displayLabel
  }
  function getAllowedValues(f: FieldInputInfo): { [key: string]: string } | undefined {
    const fieldLayout: FieldLayout | undefined = fieldLayouts.find((fl) => fl.fieldName == f.name)
    if (!fieldLayout) return undefined
    return fieldLayout.dropdownStaticEntries
  }
  return (
    <div className='flex gap-6'>
      {labelPosition == 'left' && (
        <div
          className={`my-2 h-full flex flex-col gap-6
      ${classNameBg || ''}`}
        >
          {fieldsToDisplay.map((f) => (
            <div className='flex items-baseline border-0 border-red-400'>
              <label
                style={{ borderColor: 'transparent' }}
                className={`whitespace-nowrap p-3 text-sm align-baseline ${
                  styleType == 0 ? 'border-b-2' : 'border-2'
                }  border-b-transparent`}
              >
                {getLabel(f)}
              </label>
            </div>
          ))}
          {customInputs.map((f) => (
            <div className='flex items-baseline border-0 border-red-400'>
              <label className='whitespace-nowrap p-3 font-medium text-sm align-baseline border-b-2 border-b-transparent'>
                {f.label}
              </label>
            </div>
          ))}
        </div>
      )}
      <div
        className={`my-2 h-full w-full flex flex-col gap-6
      ${classNameBg || ''}`}
      >
        {fieldsToDisplay.map((f) => {
          const fieldLayout: FieldLayout | undefined = fieldLayouts.find(
            (fl) => fl.fieldName == f.name,
          )
          return (
            <div key={f.name} className='border-0 border-red-400'>
              <InputField
                key={f.name}
                inputType={f.type}
                label={labelPosition == 'top' ? getLabel(f) : null}
                initialValue={f.value}
                onValueChange={(newValue: any) => f.setValue(newValue)}
                setabilityFlags={f.setabilityFlags}
                classNameBg={classNameInputBg}
                classNameHoverBg={classNameInputHoverBg}
                classNameHoverBgDark={classNameInputHoverBgDark}
                allowedValues={getAllowedValues(f)}
                multiLine={fieldLayout ? fieldLayout.textIsMultiLine : false}
                styleType={styleType}
                readOnly={readOnly}
              ></InputField>
            </div>
          )
        })}
        {customInputs.map((c) => (
          <div key={c.label}>{c.render()}</div>
        ))}
      </div>
    </div>
  )
}

export default UForm1
