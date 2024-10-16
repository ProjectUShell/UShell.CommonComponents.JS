import React from 'react'
import DocComponent from './DocComponent'
import EntityTableBasic from './EntityTableBasic'
import EntityTableOptions from './EntityTableOptions'
import EntityTableInheritance from './EntityTableInheritance'

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
        {
          demoTitle: 'Entity Table options',
          demoExplanation: 'Basic Entity Table',
          demoComponent: <EntityTableOptions></EntityTableOptions>,
          sourceCode: require('!!raw-loader!./EntityTableOptions.tsx').default.toString(),
        },
        {
          demoTitle: 'Entity Table Inheritance',
          demoExplanation: 'Inheritance Entity Table',
          demoComponent: <EntityTableInheritance></EntityTableInheritance>,
          sourceCode: require('!!raw-loader!./EntityTableInheritance.tsx').default.toString(),
        },
      ]}
    ></DocComponent>
  )
}

export default EntityTableDoc
