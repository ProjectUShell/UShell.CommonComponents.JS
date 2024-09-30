import React, { useState } from 'react'

// const useDidMount = require('!!raw-loader!./TableDemoBasic')
// const useDidMount = 'asd'
// const useDidMount = raw('./ColorDemo')

const DocComponent: React.FC<{
  title: string
  subTitle: string
  explanation: string | JSX.Element
  demos: {
    demoTitle: string
    demoExplanation: string
    demoComponent: JSX.Element
    sourceCode: string
  }[]
}> = ({ title, subTitle, explanation, demos }) => {
  return (
    <div className='flex flex-col m-4 px-1 w-full overflow-y-auto'>
      <div className='flex flex-col pb-4 mb-5 gap-2 border-b border-bg6 dark:border-bg4dark'>
        <h1 className='text-2xl font-bold'>{title}</h1>
        <h2>{subTitle}</h2>
      </div>
      <div className='mb-4'>{explanation}</div>
      {demos.map((d) => (
        <DocSubComponent key={d.demoTitle} demo={d}></DocSubComponent>
      ))}
    </div>
  )
}

const DocSubComponent: React.FC<{
  demo: {
    demoTitle: string
    demoExplanation: string
    demoComponent: JSX.Element
    sourceCode: string
  }
}> = ({ demo }) => {
  const [showCode, setShowCode] = useState(false)

  return (
    <div key={demo.demoTitle} className='flex flex-col gap-2 my-4'>
      <h1 className='text-xl font-bold'>{demo.demoTitle}</h1>
      <h2>{demo.demoExplanation}</h2>
      <div className='border border-bg8 dark:border-bg8dark rounded-md p-2 bg-bg4 dark:bg-bg4dark'>
        <div className=''>{demo.demoComponent}</div>
      </div>
      {!showCode && (
        <div className='border border-bg8 dark:border-bg8dark rounded-md p-2 bg-bg4 dark:bg-bg4dark flex flex-col'>
          <div>
            <button
              className='float-end hover:bg-bg7 dark:hover:bg-bg7dark p-1 rounded-sm m-1'
              onClick={() => setShowCode((c) => !c)}
            >
              {showCode ? 'Hide Code' : 'Show Code'}
            </button>
          </div>
        </div>
      )}
      {showCode && (
        <div className='border border-bg8 dark:border-bg8dark rounded-md p-2 bg-bg4 dark:bg-bg4dark flex flex-col'>
          <div className='flex gap-1 justify-end'>
            <button
              className='float-end hover:bg-bg7 dark:hover:bg-bg7dark p-1 rounded-sm m-1'
              onClick={() => navigator.clipboard.writeText(demo.sourceCode)}
            >
              Copy
            </button>
            <button
              className='float-end hover:bg-bg7 dark:hover:bg-bg7dark p-1 rounded-sm m-1'
              onClick={() => setShowCode((c) => !c)}
            >
              {showCode ? 'Hide Code' : 'Show Code'}
            </button>
          </div>
          <code className='text-wrap whitespace-break-spaces'>{demo.sourceCode}</code>
        </div>
      )}
    </div>
  )
}

export default DocComponent
