import React from 'react'

const ArrowUturnUpd: React.FC<{ size: number; className?: string }> = ({ size, className }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      className={`w-${size} h-${size} ${className}`}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='m9 9 6-6m0 0 6 6m-6-6v12a6 6 0 0 1-12 0v-3'
      />
    </svg>
  )
}

export default ArrowUturnUpd
