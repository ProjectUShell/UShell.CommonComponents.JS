import React from 'react'
import DocComponent from './DocComponent'
import TabControlBasic from './TabControlBasic'
import { TabControl1 } from '../_Organisms/TabControl'
import TabControlCustomColors from './TabControlCustomColors'
import InputFieldBasic from './InputFieldBasic'
import FormAlt from './FormAlt'

const InputFieldDoc = () => {
  return (
    <DocComponent
      title='Input Field'
      subTitle='Input Field...'
      explanation='Input Field Explanation...'
      demos={[
        {
          demoTitle: 'Basic Form',
          demoExplanation: 'Baisc Form',
          demoComponent: <InputFieldBasic></InputFieldBasic>,
          sourceCode: require('!!raw-loader!./InputFieldBasic.tsx').default.toString(),
        },
        {
          demoTitle: 'Alternative Form',
          demoExplanation: 'Alternative Form',
          demoComponent: <FormAlt></FormAlt>,
          sourceCode: require('!!raw-loader!./FormAlt.tsx').default.toString(),
        },
      ]}
    ></DocComponent>
  )
}

export default InputFieldDoc
