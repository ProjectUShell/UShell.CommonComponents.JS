import React, { useEffect } from 'react'

const Modal: React.FC<{
  children: any
  setIsOpen: (o: boolean) => void
}> = ({ children, setIsOpen }) => {
  useEffect(() => {
    const handleEscape = (e: any) => {
      if (e.key == 'Esc' || e.key == 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <div className='relative'>
      <button autoFocus={true} className='absolute' onBlur={() => setIsOpen(false)}>
        {children}
      </button>
    </div>
  )
}

export default Modal
