import React from 'react'
import DocComponent from './DocComponent'
import GuifadBasic from './GuifadBasic'
import GuifadNavigation from './GuifadNavigation'
import GuifadLocal from './GuifadLocal'

const GuifadLocalDoc = () => {
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
          demoTitle: 'Local Demo',
          demoExplanation: 'Local Demo....',
          sourceCode: require('!!raw-loader!./GuifadLocal.tsx').default.toString(),
          demoComponent: <GuifadLocal></GuifadLocal>,
        },
      ]}
    ></DocComponent>
  )
}

export default GuifadLocalDoc
