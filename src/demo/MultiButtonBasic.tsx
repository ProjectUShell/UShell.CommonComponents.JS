import React from 'react'
import Accordion from '../_Molecules/Accordion'
import MultiButton from '../_Atoms/MultiButton'

const MultiButtonBasic = () => {
  return (
    <div className='flex justify-end'>
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
        classNameButton='text-sm bg-prim4 dark:bg-prim7Dark p-2  hover:bg-toolbarHover dark:hover:bg-prim8Dark'
        classNameBg='text-sm bg-prim4 dark:bg-prim7Dark hover:bg-toolbarHover dark:hover:bg-prim8Dark'
        classNameDropdownBorder='border-gray-600'
        classNameHoverBorder=''
      ></MultiButton>
    </div>
  )
}

export default MultiButtonBasic
