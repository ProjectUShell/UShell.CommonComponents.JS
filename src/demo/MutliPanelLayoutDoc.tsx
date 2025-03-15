import React from 'react'
import DocComponent from './DocComponent'
import AccordionBasic from './AccordionBasic'
import AccordionMultiple from './AccordionMultiple'
import MutliPanelLayoutBasic from './MutliPanelLayoutBasic'

const MutliPanelLayoutDoc = () => {
  return (
    <DocComponent
      title='MutliPanelLayout'
      subTitle='MutliPanelLayout...'
      explanation='...'
      demos={[
        {
          demoTitle: 'Basic',
          demoExplanation: '...',
          demoComponent: <MutliPanelLayoutBasic></MutliPanelLayoutBasic>,
          sourceCode: require('!!raw-loader!./MutliPanelLayoutBasic.tsx').default.toString(),
        },
      ]}
    ></DocComponent>
  )
}

export default MutliPanelLayoutDoc
