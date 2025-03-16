import React from 'react'
import MultiPanelLayout from '../_Organisms/MultiPanelLayout'

const MutliPanelLayoutExternalControl = () => {
  const [leftPanelCollapsed, setLeftPanelCollapsed] = React.useState(false)

  return (
    <div className='h-96 flex flex-col gap-1 bg-navigation dark:bg-navigationDark'>
      <div className='flex justify-center space-x-4 rounded-md bg-topbar dark:bg-topbarDark p-2'>
        <button
          className='bg-content dark:bg-contentDark p-2 rounded-sm
         hover:bg-contentHover dark:hover:bg-contentHoverDark'
          onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
        >
          Toggle Left Panel
        </button>
      </div>
      <MultiPanelLayout
        mainContent={<div>Test</div>}
        leftPanelContent={<div>Left Panel Content</div>}
        leftCollapsedMode='none'
        leftVisible={!leftPanelCollapsed}
        setLeftVisible={(v) => setLeftPanelCollapsed(!v)}
      ></MultiPanelLayout>
    </div>
  )
}

export default MutliPanelLayoutExternalControl
