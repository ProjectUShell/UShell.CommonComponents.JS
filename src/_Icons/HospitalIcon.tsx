import React from 'react'

const HospitalIcon: React.FC<{ rotate?: number; size?: number; strokeWidth?: number }> = ({
  rotate,
  size = 1.5,
  strokeWidth = 1.5,
}) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='currentColor'
      viewBox='0 0 24 24'
      strokeWidth={strokeWidth}
      className='transition-all'
      style={{ rotate: `${rotate}deg`, width: `${size}rem`, height: `${size}rem` }}
    >
      <path d='M12.5 17h-1c-.3 0-.5.2-.5.5s.2.5.5.5h1c.3 0 .5-.2.5-.5s-.2-.5-.5-.5zm-5-4h-1c-.3 0-.5.2-.5.5s.2.5.5.5h1c.3 0 .5-.2.5-.5s-.2-.5-.5-.5zm5 0h-1c-.3 0-.5.2-.5.5s.2.5.5.5h1c.3 0 .5-.2.5-.5s-.2-.5-.5-.5zm-5 4h-1c-.3 0-.5.2-.5.5s.2.5.5.5h1c.3 0 .5-.2.5-.5s-.2-.5-.5-.5zm6-9.5h-1v-1c0-.3-.2-.5-.5-.5s-.5.2-.5.5v1h-1c-.3 0-.5.2-.5.5s.2.5.5.5h1v1c0 .3.2.5.5.5s.5-.2.5-.5v-1h1c.3 0 .5-.2.5-.5s-.2-.5-.5-.5zm8-.5H18V2.5c0-.3-.2-.5-.5-.5h-11c-.3 0-.5.2-.5.5V7H2.5c-.3 0-.5.2-.5.5v14c0 .3.2.5.5.5h19c.3 0 .5-.2.5-.5v-14c0-.3-.2-.5-.5-.5zM21 21H3V8h3.5c.3 0 .5-.2.5-.5V3h10v4.5c0 .3.2.5.5.5H21v13zm-3.5-4h-1c-.3 0-.5.2-.5.5s.2.5.5.5h1c.3 0 .5-.2.5-.5s-.2-.5-.5-.5zm-1-4c-.3 0-.5.2-.5.5s.2.5.5.5h1c.3 0 .5-.2.5-.5s-.2-.5-.5-.5h-1z' />
    </svg>
  )
}

export default HospitalIcon
