import React, { useState } from 'react'
import UForm1 from '../components/guifad/_Molecules/UForm1'

const FormAlt = () => {
  const [firstName, setFirstName] = useState('')
  const [description, setDescription] = useState('')
  const [id, setId] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('1900-01-01')
  const [height, setHeight] = useState(0)
  const [favColor, setFavColor] = useState('red')

  return (
    <div className='bg-content dark:bg-contentDark p-2'>
      <UForm1
        styleType={1}
        classNameInputBg='bg-white dark:bg-bg1dark'
        classNameInputHoverBg='bg-white'
        classNameInputHoverBgDark='bg-bg1dark'
        fieldLayouts={[
          { fieldName: 'FirstName', displayLabel: 'First Name' },
          {
            fieldName: 'FavColor',
            dropdownMode: 'static',
            displayLabel: 'Favorite Color',
            dropdownStaticEntries: { red: 'Red', blue: 'Blue', violet: 'Violet' },
          },
          { fieldName: 'Description', displayLabel: 'Description', textIsMultiLine: true },
        ]}
        fieldsToDisplay={[
          {
            name: 'Id',
            setabilityFlags: 7,
            type: 'guid',
            value: id,
            setValue: (v) => setId(v),
          },
          {
            name: 'FirstName',
            setabilityFlags: 7,
            type: 'string',
            value: firstName,
            setValue: (v) => setFirstName(v),
          },
          {
            name: 'DateOfBirth',
            setabilityFlags: 7,
            type: 'date',
            value: dateOfBirth,
            setValue: (v) => setDateOfBirth(v),
          },
          {
            name: 'FavColor',
            setabilityFlags: 7,
            type: 'string',
            value: favColor,
            setValue: (v) => setFavColor(v),
          },
          {
            name: 'Description',
            setabilityFlags: 7,
            type: 'string',
            value: description,
            setValue: (v) => setDescription(v),
          },
        ]}
        labelPosition='left'
        classNameBg='bg-content dark:bg-contentDark'
      ></UForm1>
    </div>
  )
}

export default FormAlt
