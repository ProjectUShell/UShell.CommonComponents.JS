import React from 'react'
import Dropdown from '../_Atoms/Dropdown'
import Paging from '../components/guifad/_Molecules/Paging'
import DocComponent from './DocComponent'
import DropdownSelect from '../_Atoms/DropdownSelect'
import DropdownSelectBasic from './DropdownSelectBasic'
import DropdownSelectLarge from './DropdownSelectLarge'

const DropdownMultiSelectDemo = () => {
  return (
    <DocComponent
      title='Dropdown MultiSelect'
      subTitle='Use DropdownMultiSelect for Dropdowns for selection of multiple values at once'
      explanation='The button component is probably the most widely used element in any user interface or website as it can be used to launch an action but also to link to other pages.
                    Flowbite provides a large variety of styles and sizes for the button component including outlined buttons, multiple colors, sizes, buttons with icons, and more.'
      demos={[
        {
          demoTitle: 'Basic',
          demoExplanation: 'Basic Demo',
          sourceCode: require('!!raw-loader!./DropdownSelectBasic.tsx').default.toString(),
          demoComponent: <DropdownSelectBasic></DropdownSelectBasic>,
        },
        {
          demoTitle: 'Large',
          demoExplanation: 'Large Demo',
          sourceCode: require('!!raw-loader!./DropdownSelectLarge.tsx').default.toString(),
          demoComponent: <DropdownSelectLarge></DropdownSelectLarge>,
        },
      ]}
    ></DocComponent>
  )
}

export default DropdownMultiSelectDemo
