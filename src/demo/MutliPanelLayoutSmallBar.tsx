import React from 'react'
import MultiPanelLayout from '../_Organisms/MultiPanelLayout'

const MutliPanelLayoutSmallBar = () => {
  return (
    <div className='h-96'>
      <MultiPanelLayout
        mainContent={<div>Test</div>}
        leftPanelContent={<div>Left Panel Content</div>}
        rightPanelContent={<div>Right Panel Content</div>}
        leftCollapsedMode='smallBar'
      ></MultiPanelLayout>
    </div>
  )
}

export default MutliPanelLayoutSmallBar
