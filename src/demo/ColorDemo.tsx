import React from 'react'

const ColorDemo = () => {
  return (
    <div className='w-screen h-full flex flex-col items-center border-2'>
      <div className='w-full h-full flex flex-col p-2'>
        <h1>Backgrounds</h1>
        <div
          className='h-full flex  items-start justify-start 
          bg-bg4dark dark:bg-bg4 text-textonedark dark:text-textone'
        >
          <div className=' '>
            <h2>bg1</h2>
            <div className='bg-bg1 dark:bg-bg1dark w-60 h-60'></div>
          </div>
          <div className=''>
            <h2>bg2</h2>
            <div className='bg-bg2 dark:bg-bg2dark w-60 h-60'></div>
          </div>
          <div className=''>
            <h2>bg3</h2>
            <div className='bg-bg3 dark:bg-bg3dark w-60 h-60'></div>
          </div>
          <div className=''>
            <h2>bg4</h2>
            <div className='bg-bg4 dark:bg-bg4dark w-60 h-60'></div>
          </div>
          <div className=''>
            <h2>bg5</h2>
            <div className='bg-bg5 dark:bg-bg5dark w-60 h-60'></div>
          </div>
          <div className=''>
            <h2>bg6</h2>
            <div className='bg-bg6 dark:bg-bg6dark w-60 h-60'></div>
          </div>
        </div>
      </div>
      <div className='w-full h-full p-2'>
        <h1>Text</h1>
        <div className='h-full flex items-start justify-start'>
          <div className=''>
            <h2>textone</h2>
            <div className='bg-textone dark:bg-textonedark w-60 h-60'></div>
          </div>
          <div className=''>
            <h2>texttwo</h2>
            <div className='bg-texttwo dark:bg-texttwodark w-60 h-60'></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ColorDemo
