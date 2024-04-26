import React from 'react'

const ColorDemo = () => {
  return (
    <div className='w-screen h-full flex flex-col items-center border-2'>
      <div className='w-full h-full flex flex-col p-2'>
        <h1>Backgrounds</h1>
        <div
          className='h-full flex gap-1 items-start justify-start 
          bg-backgroundonedark dark:bg-backgroundfour text-textonedark dark:text-textone'
        >
          <div className=' m-auto'>
            <h2>backgoundone</h2>
            <div className='bg-backgroundone dark:bg-backgroundonedark w-60 h-60'></div>
          </div>
          <div className='m-auto'>
            <h2>backgoundtwo</h2>
            <div className='bg-backgroundtwo dark:bg-backgroundtwodark w-60 h-60'></div>
          </div>
          <div className='m-auto'>
            <h2>backgoundthree</h2>
            <div className='bg-backgroundthree dark:bg-backgroundthreedark w-60 h-60'></div>
          </div>
          <div className='m-auto'>
            <h2>backgoundfour</h2>
            <div className='bg-backgroundfour dark:bg-backgroundfourdark w-60 h-60'></div>
          </div>
        </div>
      </div>
      <div className='w-full h-full p-2'>
        <h1>Text</h1>
        <div className='h-full flex gap-1 items-start justify-start'>
          <div className=' m-auto'>
            <h2>textone</h2>
            <div className='bg-textone dark:bg-textonedark w-60 h-60'></div>
          </div>
          <div className=' m-auto'>
            <h2>texttwo</h2>
            <div className='bg-texttwo dark:bg-texttwodark w-60 h-60'></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ColorDemo
