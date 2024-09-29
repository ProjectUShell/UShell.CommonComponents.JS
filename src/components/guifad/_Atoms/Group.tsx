import React, { useState } from 'react'
import ChevrodnDownIcon from '../../../_Icons/ChevrodnDownIcon'

const Group: React.FC<{
  name?: string
  collapsible?: boolean
  open?: boolean
  children: any
  className?: string
}> = ({ name, collapsible, open, children, className }) => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={`mb-2 ${className}`}>
      {name && (
        <div className='flex justify-between border-b-2 dark:border-bg4dark pb-1'>
          <h2 className='font-medium'>{name}</h2>
          {collapsible && (
            <button className='justify-end' onClick={(e) => setCollapsed((c) => !c)}>
              <div className={`transition-all ${collapsed ? '' : 'rotate-180'}`}>
                <ChevrodnDownIcon></ChevrodnDownIcon>
              </div>
            </button>
          )}
        </div>
      )}
      {(!collapsible || !collapsed) && <div className=''>{children}</div>}
    </div>
  )
}

export default Group
