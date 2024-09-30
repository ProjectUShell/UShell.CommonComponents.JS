import React from 'react'
import DocComponent from './DocComponent'
import TabControlBasic from './TabControlBasic'
import { TabControl1 } from '../_Organisms/TabControl'
import TabControlCustomColors from './TabControlCustomColors'

const TabControlDoc = () => {
  return (
    <DocComponent
      title='Tab Control'
      subTitle='Tab Controls...'
      explanation='Tab Control Explanation...'
      demos={[
        {
          demoTitle: 'Basic',
          demoExplanation: 'Baisc Tab',
          demoComponent: <TabControlBasic></TabControlBasic>,
          sourceCode: require('!!raw-loader!./TabControlBasic.tsx').default.toString(),
        },
        {
          demoTitle: 'Basic',
          demoExplanation: 'Baisc Tab',
          demoComponent: <TabControlCustomColors></TabControlCustomColors>,
          sourceCode: require('!!raw-loader!./TabControlCustomColors.tsx').default.toString(),
        },
      ]}
    ></DocComponent>
  )
}

export default TabControlDoc
