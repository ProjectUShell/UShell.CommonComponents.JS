import React from 'react'

const UniversityIcon: React.FC<{ rotate?: number; size?: number; strokeWidth?: number }> = ({
  rotate,
  size = 1.5,
  strokeWidth = 1.5,
}) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      stroke='none'
      viewBox='0 0 24 24'
      strokeWidth={strokeWidth}
      fill='currentColor'
      className='size-6 transition-all'
      style={{ rotate: `${rotate}deg`, width: `${size}rem`, height: `${size}rem` }}
    >
      <path d='M21 10a1 1 0 001-1V6a.999.999 0 00-.684-.948l-9-3a1.002 1.002 0 00-.632 0l-9 3A.999.999 0 002 6v3a1 1 0 001 1h1v7.184A2.995 2.995 0 002 20v2a1 1 0 001 1h18a1 1 0 001-1v-2a2.995 2.995 0 00-2-2.816V10zm-1 11H4v-1a1.001 1.001 0 011-1h14a1.001 1.001 0 011 1zM6 17v-7h2v7zm4 0v-7h4v7zm6 0v-7h2v7zM4 8V6.72l8-2.666 8 2.667V8z' />
    </svg>
  )
}

export default UniversityIcon
