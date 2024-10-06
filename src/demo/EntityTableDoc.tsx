import React from 'react'
import DocComponent from './DocComponent'
import EntityTableBasic from './EntityTableBasic'

const EntityTableDoc = () => {
  return (
    <DocComponent
      title='Entity Table'
      subTitle='Entity Table...'
      explanation='Entity Table....'
      demos={[
        {
          demoTitle: 'Basic Entity Table',
          demoExplanation: 'Basic Entity Table',
          demoComponent: <EntityTableBasic></EntityTableBasic>,
          sourceCode: require('!!raw-loader!./EntityTableBasic.tsx').default.toString(),
        },
      ]}
    ></DocComponent>
  )
}

export default EntityTableDoc
