import React, { useState } from 'react'
import UForm1 from '../components/guifad/_Molecules/UForm1'

const FormAlt = () => {
  const [firstName, setFirstName] = useState('')
  const [id, setId] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('1900-01-01')
  const [height, setHeight] = useState(0)

  return (
    <div className='bg-content dark:bg-contentDark p-2'>
      <UForm1
        fieldsToDisplay={[
          {
            name: 'Id',
            setabilityFlags: 7,
            type: 'guid',
            value: id,
            setValue: (v) => setId(v),
          },
          {
            name: 'First Name',
            setabilityFlags: 7,
            type: 'string',
            value: firstName,
            setValue: (v) => setFirstName(v),
          },
        ]}
        labelPosition='left'
        classNameBg='bg-content dark:bg-contentDark'
      ></UForm1>
    </div>
  )
}

export default FormAlt
