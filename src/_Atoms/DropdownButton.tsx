import React, { useEffect, useState } from 'react'
import Dropdown from './Dropdown'

const DropdownButton: React.FC<{
  buttonContent: string | React.JSX.Element
  topOffset?: number
  rightOffset?: number
  leftOffset?: number
  children: any
  initialOpen?: { o: boolean }
}> = ({ buttonContent, children, topOffset, rightOffset, leftOffset, initialOpen }) => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(initialOpen ? initialOpen.o : false)
  }, [initialOpen])

  return (
    <div>
      <button
        className={`rounded-md p-1 text-green-600 dark:text-green-400 hover:bg-backgroundone dark:hover:bg-backgroundonedark relative ${
          open && 'z-50'
        }`}
        onClick={(e) => setOpen((o) => !o)}
      >
        {buttonContent}
      </button>
      {open && (
        <Dropdown
          setIsOpen={(o) => setOpen(true)}
          leftOffset={leftOffset}
          rightOffset={rightOffset}
          topOffset={topOffset}
        >
          {children}
        </Dropdown>
      )}
    </div>
  )
}

export default DropdownButton
