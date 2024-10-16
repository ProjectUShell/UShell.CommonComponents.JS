import React from 'react'
import DocComponent from './DocComponent'
import EntityTableBasic from './EntityTableBasic'
import EntityTableOptions from './EntityTableOptions'
import EntityFormBasic from './EntityFormBasic'

const EntityFormDoc = () => {
  return (
    <DocComponent
      title='Entity Form'
      subTitle='Entity Form...'
      explanation='Entity Form....'
      demos={[
        {
          demoTitle: 'Basic Entity Table',
          demoExplanation: 'Basic Entity Table',
          demoComponent: <EntityFormBasic></EntityFormBasic>,
          sourceCode: require('!!raw-loader!./EntityFormBasic.tsx').default.toString(),
        },
      ]}
    ></DocComponent>
  )
}

export default EntityFormDoc
