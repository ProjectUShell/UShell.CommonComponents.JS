import React from 'react'
import DocComponent from './DocComponent'
import AccordionBasic from './AccordionBasic'
import AccordionMultiple from './AccordionMultiple'
import MutliPanelLayoutBasic from './MutliPanelLayoutBasic'
import MutliPanelLayoutSmallBar from './MutliPanelLayoutSmallBar'
import MutliPanelLayoutExternalControl from './MutliPanelLayoutExternalControl'
import MutliPanelLayoutSmallTabs from './MutliPanelLayoutSmallTabs'

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
        {
          demoTitle: 'Small Bar',
          demoExplanation: '...',
          demoComponent: <MutliPanelLayoutSmallBar></MutliPanelLayoutSmallBar>,
          sourceCode: require('!!raw-loader!./MutliPanelLayoutSmallBar.tsx').default.toString(),
        },
        {
          demoTitle: 'External Control',
          demoExplanation: '...',
          demoComponent: <MutliPanelLayoutExternalControl></MutliPanelLayoutExternalControl>,
          sourceCode:
            require('!!raw-loader!./MutliPanelLayoutExternalControl.tsx').default.toString(),
        },
        {
          demoTitle: 'Small Tabs',
          demoExplanation: '...',
          demoComponent: <MutliPanelLayoutSmallTabs></MutliPanelLayoutSmallTabs>,
          sourceCode: require('!!raw-loader!./MutliPanelLayoutSmallTabs.tsx').default.toString(),
        },
      ]}
    ></DocComponent>
  )
}

export default MutliPanelLayoutDoc
