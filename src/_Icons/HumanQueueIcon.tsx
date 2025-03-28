import React from 'react'

const HumanQueueIcon: React.FC<{ rotate?: number; size?: number; strokeWidth?: number }> = ({
  rotate,
  size = 1.5,
  strokeWidth = 1.5,
}) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='currentColor'
      viewBox='0 0 24 24'
      className='transition-all'
      style={{ rotate: `${rotate}deg`, width: `${size}rem`, height: `${size}rem` }}
    >
      <path d='M5 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.89 2-2-.89-2-2-2m7-2a2 2 0 102 2c0-1.11-.89-2-2-2m7-2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.89 2-2-.89-2-2-2M3.5 11c-.83 0-1.5.67-1.5 1.5V17h1v5h4v-5h1v-4.5c0-.83-.67-1.5-1.5-1.5h-3m7-2C9.67 9 9 9.67 9 10.5V15h1v5h4v-5h1v-4.5c0-.83-.67-1.5-1.5-1.5h-3m7-2c-.83 0-1.5.67-1.5 1.5V13h1v5h4v-5h1V8.5c0-.83-.67-1.5-1.5-1.5h-3z' />
    </svg>
  )
}

export default HumanQueueIcon
