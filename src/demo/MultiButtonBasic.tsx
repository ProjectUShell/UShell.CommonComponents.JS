import React from 'react'
import Accordion from '../_Molecules/Accordion'
import MultiButton from '../_Atoms/MultiButton'

const MultiButtonBasic = () => {
  return (
    <div className='flex'>
      <MultiButton
        buttons={[
          {
            label: 'Run',
            onClick: () => {
              console.log('Run')
            },
          },
          {
            label: 'Debug',
            onClick: () => {
              console.log('Debug')
            },
          },
        ]}
        classNameHoverBorder='hover:border-menuBorder dark:hover:border-menuBorderDark'
      ></MultiButton>
    </div>
  )
}

export default MultiButtonBasic
