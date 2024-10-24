import React, { useEffect, useState } from 'react'
import InputField from '../_Atoms/InputField'
import { FieldLayout } from '../../../[Move2LayoutDescription]/FieldLayout'
import { EntitySchemaService } from '../../../data/EntitySchemaService'
import { RelationSchema } from 'fusefx-modeldescription'

export class FieldInputInfo {
  name: string = ''
  type: string = ''
  setabilityFlags: number = 0
  required: boolean = false
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
  isCreation?: boolean
  onValidationChanged?: (errors: { [fieldName: string]: string | null }) => void
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
  isCreation = false,
  onValidationChanged,
}) => {
  const [errors, setErrors] = useState<{ [fieldName: string]: string | null }>({})

  useEffect(() => {
    const initalErrors: { [fieldName: string]: string | null } = {}
    fieldsToDisplay.forEach((f) => {
      initalErrors[f.name] = getErrors(f)
    })
    if (EntitySchemaService.compareDeep(initalErrors, errors)) return
    setErrors(initalErrors)
  }, [fieldsToDisplay])
  useEffect(() => {
    onValidationChanged && onValidationChanged(errors)
  }, [errors])

  function getErrors(field: FieldInputInfo): string | null {
    if (field.required && field.type.toLocaleLowerCase().startsWith('bool')) {
      const isTrue = field.value == true
      const isFalse = field.value == false
      if (isTrue || isFalse) {
        return null
      } else {
        return 'Field is required'
      }
    }
    if (field.required && (field.value == null || field.value == undefined || field.value == '')) {
      return 'Field is required'
    }
    return null
  }
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
  function getAllowedValuesSeparator(f: FieldInputInfo): string | null | undefined {
    const fieldLayout: FieldLayout | undefined = fieldLayouts.find((fl) => fl.fieldName == f.name)
    if (!fieldLayout) return undefined
    return fieldLayout.multiSelectSeparator
  }
  function onValidation(fieldName: string, error: string | null) {
    // console.log('onValidation', { fn: fieldName, error: error, errors: errors })
    if (!(fieldName in errors)) {
      errors[fieldName] = error
      setErrors({ ...errors })
      return
    }
    const currentError: string | null = errors[fieldName]
    if (error == currentError) return
    errors[fieldName] = error
    setErrors({ ...errors })
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
              <label
                style={{ borderBottomColor: 'transparent' }}
                className='whitespace-nowrap p-3 font-medium text-sm align-baseline border-b-2'
              >
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
                onValueChange={(newValue: any, err: string | null) => {
                  f.setValue(newValue)
                  onValidation(f.name, err)
                }}
                setabilityFlags={f.setabilityFlags}
                classNameBg={classNameInputBg}
                classNameHoverBg={classNameInputHoverBg}
                classNameHoverBgDark={classNameInputHoverBgDark}
                allowedValues={getAllowedValues(f)}
                multiLine={fieldLayout ? fieldLayout.textIsMultiLine : false}
                styleType={styleType}
                readOnly={readOnly}
                isCreation={isCreation}
                required={f.required}
                allowedValuesSeparator={getAllowedValuesSeparator(f)}
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
