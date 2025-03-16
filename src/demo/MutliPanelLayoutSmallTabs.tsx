import React from 'react'
import MultiPanelLayout, { PanelItem } from '../_Organisms/MultiPanelLayout'
import StructureIcon from '../_Icons/StructureIcon'
import FolderIcon from '../components/shell-layout/_Icons/FolderIcon'

const MutliPanelLayoutSmallTabs = () => {
  const leftPanelTabs: PanelItem[] = [
    { icon: <StructureIcon></StructureIcon>, content: <div>Left Panel 1</div>, title: 'Structure' },
    { icon: <FolderIcon></FolderIcon>, content: <div>Left Panel 2</div>, title: 'Folder' },
  ]

  return (
    <div className='h-96'>
      <MultiPanelLayout
        leftCollapsedMode='smallTabs'
        mainContent={<div>Test</div>}
        leftPanelContent={leftPanelTabs}
        rightPanelContent={<div>Right Panel Content</div>}
      ></MultiPanelLayout>
    </div>
  )
}

export default MutliPanelLayoutSmallTabs
