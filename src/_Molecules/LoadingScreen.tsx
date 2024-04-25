import React from 'react'

const LoadingScreen: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div
      className='h-full w-full flex flex-col items-center align-middle
      text-blue-600 dark:text-blue-400 m-auto'
    >
      <div className='mt-16 flex flex-col items-center'>
        <h1 className='text-4xl font-bold '>Loading...</h1>
        <div className='mt-4'>{message && <div>{message}</div>}</div>
      </div>
    </div>
  )
}

export default LoadingScreen
