import React, { useEffect, useState } from 'react'

const Tooltip: React.FC<{ targetId: string; children: any }> = ({ targetId, children }) => {
  const [show, setShow] = useState(false)
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [showTimeout, setShowTimeout] = useState<NodeJS.Timeout | null>(null)
  const [cancelShow, setCancelShow] = useState(false)

  useEffect(() => {
    const showTooltip = (e: any) => {
      if (show) return
      setPos({ x: e.x, y: e.clientY })
      setCancelShow(false)
      const t: NodeJS.Timeout = setTimeout(() => {
        setShow(true)
      }, 500)
      setShowTimeout(t)
    }
    const hideTooltip = () => {
      if (showTimeout) {
        clearTimeout(showTimeout)
      }
      setCancelShow(true)
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

  if (showTimeout && cancelShow) {
    clearTimeout(showTimeout)
  }
  if (cancelShow && show) {
    setShow(false)
  }

  return (
    <>
      {show && (
        <div
          style={{ left: pos.x, top: pos.y }}
          className='fixed flex z-40 rounded-md p-1
              bg-bg1 dark:bg-bg1dark shadow-md border dark:border-bg3dark'
        >
          {children}
        </div>
      )}
    </>
  )
}

export default Tooltip
