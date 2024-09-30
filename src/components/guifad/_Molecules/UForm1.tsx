import React from 'react'
import InputField from '../_Atoms/InputField'

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
  customInputs?: { label: string; render: () => JSX.Element }[]
  classNameBg?: string
  classNameInputBg?: string
  classNameInputHoverBg?: string
  classNameInputHoverBgDark?: string
}> = ({
  fieldsToDisplay,
  labelPosition,
  customInputs = [],
  classNameBg,
  classNameInputBg,
  classNameInputHoverBg,
  classNameInputHoverBgDark,
}) => {
  return (
    <div className='flex'>
      {labelPosition == 'left' && (
        <div
          className={`my-2 h-full flex flex-col gap-2
      ${classNameBg || ''}`}
        >
          {fieldsToDisplay.map((f) => (
            <div className='flex items-baseline border-0 border-red-400'>
              <label className='whitespace-nowrap p-3 font-medium text-sm align-baseline border-b-2 border-b-transparent'>
                {f.name}
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
        className={`my-2 h-full w-full flex flex-col gap-2
      ${classNameBg || ''}`}
      >
        {fieldsToDisplay.map((f) => (
          <div className='border-0 border-red-400'>
            <InputField
              key={f.name}
              inputType={f.type}
              label={labelPosition == 'top' ? f.name : null}
              initialValue={f.value}
              onValueChange={(newValue: any) => f.setValue(newValue)}
              setabilityFlags={f.setabilityFlags}
              classNameBg={classNameInputBg}
              classNameHoverBg={classNameInputHoverBg}
              classNameHoverBgDark={classNameInputHoverBgDark}
            ></InputField>
          </div>
        ))}
        {customInputs.map((c) => (
          <div key={c.label}>{c.render()}</div>
        ))}
      </div>
    </div>
  )
}

export default UForm1
