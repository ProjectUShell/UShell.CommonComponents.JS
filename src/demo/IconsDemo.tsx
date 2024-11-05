import React from 'react'
import { getIcon } from '../utils/IconLib'

const IconsDemo = () => {
  return (
    <div className='w-full h-full grid grid-flow-col auto-cols-max border-4 bg-content dark:bg-contentDark p-2'>
      {[
        'institution',
        'DataBase',
        'University',
        'Hospital',
        'ReportSearch',
        'Workflow',
        'HumanQueue',
        'ReportMedical',
        'moneystack',
        'ArrowUturnLeft',
      ].map((iconKey) => (
        <div key={iconKey} className='flex flex-col items-center'>
          <div className='m-1'>{getIcon(iconKey)}</div>
          <label>{iconKey}</label>
        </div>
      ))}
    </div>
  )
}

export default IconsDemo
