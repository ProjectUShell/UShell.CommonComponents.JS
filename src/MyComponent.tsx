import React from 'react'

import './tailwind.css'

interface MyComponentProps {
  text: string
}

const MyComponent: React.FC<MyComponentProps> = ({ text }) => {
  return (
    <div>
      <div className='bg-primary text-white p-4'>{text}</div>
      <div className='bg-primary2 text-white p-4'>{text}</div>
    </div>
  )
}

export default MyComponent
