import React from 'react'
import DocComponent from './DocComponent'
import GuifadBasic from './GuifadBasic'
import GuifadNavigation from './GuifadNavigation'

const GuifadDoc = () => {
  return (
    <DocComponent
      title='GuiFAD'
      subTitle='Generic UI For Any Data Model'
      explanation={
        <div>
          See <a href='http://vodi.de/VodisPatterns/'>http://vodi.de/VodisPatterns/</a>
        </div>
      }
      demos={[
        {
          demoTitle: 'Basic Demo',
          demoExplanation: 'Basic Demo....',
          sourceCode: require('!!raw-loader!./GuifadBasic.tsx').default.toString(),
          demoComponent: <GuifadBasic></GuifadBasic>,
        },
        {
          demoTitle: 'With Navigation',
          demoExplanation: 'With LookUp and Dependent Properties....',
          sourceCode: require('!!raw-loader!./GuifadNavigation.tsx').default.toString(),
          demoComponent: <GuifadNavigation></GuifadNavigation>,
        },
      ]}
    ></DocComponent>
  )
}

export default GuifadDoc
