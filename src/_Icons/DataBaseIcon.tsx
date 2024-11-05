import React from 'react'

const DataBaseIcon: React.FC<{ rotate?: number; size?: number; strokeWidth?: number }> = ({
  rotate,
  size = 1.5,
  strokeWidth = 1.5,
}) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={strokeWidth}
      stroke='currentColor'
      className='size-6 transition-all'
      style={{ rotate: `${rotate}deg`, width: `${size}rem`, height: `${size}rem` }}
    >
      <path d='M21 5 A9 3 0 0 1 12 8 A9 3 0 0 1 3 5 A9 3 0 0 1 21 5 z' />
      <path d='M21 12c0 1.66-4 3-9 3s-9-1.34-9-3' />
      <path d='M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5' />
    </svg>
  )
}

export default DataBaseIcon
