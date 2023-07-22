import React, { useState } from 'react'
import ChevrodnDownIcon from '../../../_Icons/ChevrodnDownIcon'

const Group: React.FC<{ name: string; collapsible?: boolean; open?: boolean; children: any }> = ({
  name,
  collapsible,
  open,
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className='mb-8'>
      <div className='flex justify-between border-b-2 pb-1'>
        <h2>{name}</h2>
        {collapsible && (
          <button className='justify-end' onClick={(e) => setCollapsed((c) => !c)}>
            <div className={`transition-all ${collapsed ? '' : 'rotate-180'}`}>
              <ChevrodnDownIcon></ChevrodnDownIcon>
            </div>
          </button>
        )}
      </div>
      {(!collapsible || !collapsed) && <div className='ml-4'>{children}</div>}
    </div>
  )
}

export default Group
