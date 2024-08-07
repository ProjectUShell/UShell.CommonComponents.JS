import React from 'react'

const ChevrodnDownIcon: React.FC<{ rotate?: number; size?: number }> = ({ rotate, size = 6 }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      style={rotate ? { rotate: `${rotate}deg` } : {}}
      className={`w-${size} h-${size} transition-all`}
    >
      <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
    </svg>
  )
}

export default ChevrodnDownIcon
