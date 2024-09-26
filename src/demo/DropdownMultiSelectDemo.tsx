import React from 'react'
import Dropdown from '../_Atoms/Dropdown'
import Paging from '../components/guifad/_Molecules/Paging'
import DocComponent from './DocComponent'
import DropdownSelect from '../_Atoms/DropdownSelect'

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
          sourceCode: 'xxx',
          demoComponent: (
            <DropdownSelect
              options={[
                { label: 'Option A', value: 1 },
                { label: 'Option B', value: 2 },
                { label: 'Option C', value: 3 },
                { label: 'Option D', value: 4 },
                { label: 'Option E', value: 5 },
                { label: 'Option F', value: 6 },
                { label: 'Option F', value: 6 },
                { label: 'Option F', value: 6 },
                { label: 'Option F', value: 6 },
                { label: 'Option F', value: 6 },
                { label: 'Option F', value: 6 },
                { label: 'Option F', value: 6 },
                { label: 'Option F', value: 6 },
                { label: 'Option F', value: 6 },
                { label: 'Option F', value: 6 },
                { label: 'Option F', value: 6 },
                { label: 'Option F', value: 6 },
                { label: 'Option F', value: 6 },
                { label: 'Option F', value: 6 },
                { label: 'Option F', value: 6 },
                { label: 'Option F', value: 6 },
                { label: 'Option F', value: 6 },
                { label: 'Option Z', value: 26 },
              ]}
            ></DropdownSelect>
          ),
        },
      ]}
    ></DocComponent>
  )
}

export default DropdownMultiSelectDemo
