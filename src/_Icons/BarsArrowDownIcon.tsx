import React from 'react'

const BarsArrowDownIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      className={'w-4 h-4 ' + className}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25'
      />
    </svg>
  )
}

export default BarsArrowDownIcon
