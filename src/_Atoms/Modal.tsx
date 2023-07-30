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
      {/* <button
        className='fixed z-20 cursor-default inset-0 bg-black bg-opacity-5'
        onClick={() => setIsOpen(false)}
      ></button> */}
      <button autoFocus={true} className='absolute' onBlur={() => setIsOpen(false)}>
        {children}
      </button>
    </div>
  )
}

export default Modal
