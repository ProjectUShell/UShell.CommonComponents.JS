import React, { useState } from 'react'
import Dropdown from '../../../_Atoms/Dropdown'
import RadioGroup from '../_Atoms/RadioGroup'
import { ColorMode, LayoutMode, ShellSettings } from '../ShellSettings'
import CogWheelIcon from '../_Icons/CogWheelIcon'

const SettingsDropdown: React.FC<{
  setLayoutMode: (layoutMode: LayoutMode) => void
  setColorMode: (colorMode: ColorMode) => void
  shellSettings: ShellSettings
}> = ({ setLayoutMode, setColorMode, shellSettings }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className=''>
      <button className='align-middle' onClick={() => setIsOpen((o) => !o)}>
        <CogWheelIcon></CogWheelIcon>
      </button>
      {isOpen && (
        <Dropdown setIsOpen={setIsOpen} rightOffset={1}>
          <div className='bg-backgroundone dark:bg-backgroundonedark p-1 rounded-md'>
            <div className='mb-4'>
              <RadioGroup
                value={shellSettings.layoutMode}
                key={0}
                labelText='Layout Mode'
                options={[<div key={1}>Vertical</div>, <div key={2}>Horizontal</div>]}
                onChange={(index) => {
                  switch (index) {
                    case 0:
                      setLayoutMode(LayoutMode.Vertical)
                      break
                    case 1:
                      setLayoutMode(LayoutMode.Horizontal)
                      break
                  }
                }}
              ></RadioGroup>
            </div>
            <div className='mb-4'>
              <RadioGroup
                labelText='Color Mode'
                value={shellSettings.colorMode}
                key={0}
                options={[<div key={1}>Light</div>, <div key={2}>Dark</div>]}
                onChange={(index) => {
                  switch (index) {
                    case 0:
                      setColorMode(ColorMode.Light)
                      break
                    case 1:
                      setColorMode(ColorMode.Dark)
                      break
                  }
                }}
              ></RadioGroup>
            </div>
          </div>
        </Dropdown>
      )}
    </div>
  )
}

export default SettingsDropdown
