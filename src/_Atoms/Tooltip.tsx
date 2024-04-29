import React, { useEffect, useState } from 'react'

const Tooltip: React.FC<{ targetId: string; children: any }> = ({ targetId, children }) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const showTooltip = () => {
      setShow(true)
    }
    const hideTooltip = () => {
      setShow(false)
    }

    const targetElement: any = document.getElementById(targetId)
    if (!targetElement) return

    targetElement.addEventListener('mouseover', showTooltip)
    targetElement.addEventListener('mouseout', hideTooltip)

    return () => {
      targetElement.removeEventListener('mouseover', showTooltip)
      targetElement.removeEventListener('mouseout', hideTooltip)
    }
  }, [targetId])

  return (
    <>
      {show && (
        <div className='relative'>
          <div
            className='absolute w-40 z-40 rounded-md p-2 
          bg-backgroundone dark:bg-backgroundonedark right-0 top-1'
          >
            {children}
          </div>
        </div>
      )}
    </>
  )
}

export default Tooltip
