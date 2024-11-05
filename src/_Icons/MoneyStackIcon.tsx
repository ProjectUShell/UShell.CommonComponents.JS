import React from 'react'

const MoneyStackIcon: React.FC<{ rotate?: number; size?: number; strokeWidth?: number }> = ({
  rotate,
  size = 1.5,
  strokeWidth = 1.5,
}) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 15 15'
      className='transition-all'
      style={{ rotate: `${rotate}deg`, width: `${size}rem`, height: `${size}rem` }}
    >
      <path
        stroke='currentColor'
        d='M0 12.5h15m-15 2h15M2.5 4V2.5H4m7 0h1.5V4m-10 3v1.5H4m7 0h1.5V7m-5 .5a2 2 0 110-4 2 2 0 010 4zm-6-7h12a1 1 0 011 1v8a1 1 0 01-1 1h-12a1 1 0 01-1-1v-8a1 1 0 011-1z'
      />
    </svg>
  )
}

export default MoneyStackIcon
