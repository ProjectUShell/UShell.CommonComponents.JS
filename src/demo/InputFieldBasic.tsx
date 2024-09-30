import React, { useState } from 'react'
import InputField from '../components/guifad/_Atoms/InputField'

const InputFieldBasic = () => {
  const [firstName, setFirstName] = useState('')
  const [id, setId] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('1900-01-01')
  const [height, setHeight] = useState(0)

  return (
    <div className='flex flex-col gap-2 h-full p-2 bg-content dark:bg-contentDark'>
      <InputField
        initialValue={id}
        inputType='guid'
        label='Id'
        onValueChange={(v) => setId(v)}
      ></InputField>
      <InputField
        initialValue={firstName}
        inputType='string'
        label='First Name'
        onValueChange={(v) => setFirstName(v)}
      ></InputField>
      <InputField
        initialValue={dateOfBirth}
        inputType='DateTime'
        label='Date of Birth'
        onValueChange={(v) => setDateOfBirth(v)}
      ></InputField>
      <InputField
        initialValue={height}
        inputType='int32'
        label='Height'
        onValueChange={(v) => setHeight(v)}
      ></InputField>
    </div>
  )
}

export default InputFieldBasic
