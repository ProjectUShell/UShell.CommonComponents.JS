import React from 'react'

const ErrorPage: React.FC<{ messages?: string[] }> = ({ messages }) => {
  return (
    <div
      className='h-full w-full flex flex-col items-center align-middle
      m-auto text-red-600 dark:text-red-400'
    >
      <div className='mt-16 flex flex-col items-center'>
        <h1 className='text-4xl font-bold '>Error</h1>
        <div className='mt-4'>
          {messages?.map((m, i) => (
            <div key={i}>{m || ''}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ErrorPage
