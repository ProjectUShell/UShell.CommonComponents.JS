import React from 'react'
import DocComponent from './DocComponent'
import ModalBasic from './ModalBasic'
import EntitySelectionBasic from './EntitySelectionBasic'

const EntitySelectionDoc = () => {
  return (
    <DocComponent
      title='Entity Selection'
      subTitle='Entity Selection...'
      explanation='...'
      demos={[
        {
          demoTitle: 'ModalWithEntityTable',
          demoExplanation: '...',
          demoComponent: <EntitySelectionBasic></EntitySelectionBasic>,
          sourceCode: require('!!raw-loader!./EntitySelectionBasic.tsx').default.toString(),
        },
      ]}
    ></DocComponent>
  )
}

export default EntitySelectionDoc
