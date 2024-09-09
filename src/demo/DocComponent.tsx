import React from 'react'

const DocComponent: React.FC<{
  title: string
  subTitle: string
  explanation: string
  demos: { demoTitle: string; demoExplanation: string; demoComponent: JSX.Element }[]
}> = ({ title, subTitle, explanation, demos }) => {
  return (
    <div className='flex flex-col m-4'>
      <div className='flex flex-col pb-4 mb-5 gap-2 border-b border-bg6 dark:border-bg4dark'>
        <h1 className='text-2xl font-bold'>{title}</h1>
        <h2>{subTitle}</h2>
      </div>
      <div className='mb-4'>{explanation}</div>
      {demos.map((d) => (
        <div key={d.demoTitle} className='flex flex-col gap-2'>
          <h1 className='text-xl font-bold'>{d.demoTitle}</h1>
          <h2>{d.demoExplanation}</h2>
          <div className='border rounded-md p-2 bg-bg4'>{d.demoComponent}</div>
        </div>
      ))}
    </div>
  )
}

export default DocComponent
