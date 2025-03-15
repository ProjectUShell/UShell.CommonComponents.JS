import React from 'react'
import MultiPanelLayout from '../_Organisms/MultiPanelLayout'

const MutliPanelLayoutBasic = () => {
  return (
    <div className='h-96'>
      <MultiPanelLayout
        mainContent={<div>Test</div>}
        leftPanelContent={<div>Left Panel Content</div>}
        rightPanelContent={<div>Right Panel Content</div>}
      ></MultiPanelLayout>
    </div>
  )
}

export default MutliPanelLayoutBasic
