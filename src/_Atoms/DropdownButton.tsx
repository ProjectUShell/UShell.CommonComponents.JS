import React, { useEffect, useMemo, useState } from 'react'
import Dropdown from './Dropdown'

const DropdownButton: React.FC<{
  buttonContent: string | React.JSX.Element
  topOffset?: number
  rightOffset?: number
  leftOffset?: number
  children: any
  initialOpen?: { o: boolean }
  className?: string
}> = ({ buttonContent, children, topOffset, rightOffset, leftOffset, initialOpen, className }) => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(initialOpen ? initialOpen.o : false)
  }, [initialOpen])

  const refId: string = useMemo(() => {
    return 'UShell_DropdownButton_' + crypto.randomUUID()
  }, [])

  return (
    <>
      <button
        className={`rounded-md p-1  relative ${open && 'z-50'}`}
        onClick={(e) => setOpen((o) => !o)}
      >
        {buttonContent}
      </button>
      {open && (
        <Dropdown
          refId={refId}
          setIsOpen={(o) => setOpen(o)}
          leftOffset={leftOffset}
          rightOffset={rightOffset}
          topOffset={topOffset}
        >
          {children}
        </Dropdown>
      )}
    </>
  )
}

export default DropdownButton
