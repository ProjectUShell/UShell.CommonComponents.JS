import React from 'react'
import MultiPanelLayout from '../_Organisms/MultiPanelLayout'

const MutliPanelLayoutSmallBar = () => {
  return (
    <div className='h-96'>
      <MultiPanelLayout
        mainContent={<div>Test</div>}
        initialLeftPanelContent={<div>Left Panel Content</div>}
        initialRightPanelContent={<div>Right Panel Content</div>}
        leftCollapsedMode='smallBar'
      ></MultiPanelLayout>
    </div>
  )
}

export default MutliPanelLayoutSmallBar
