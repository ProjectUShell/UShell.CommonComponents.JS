import React from 'react'
import MultiPanelLayout, { PanelItem } from '../_Organisms/MultiPanelLayout'
import StructureIcon from '../_Icons/StructureIcon'
import FolderIcon from '../components/shell-layout/_Icons/FolderIcon'
import PencilIcon from '../_Icons/PencilIcon'
import MagnifyingGlassIcon from '../_Icons/MagnifyingGlassIcon'

const MutliPanelLayoutSmallTabs = () => {
  const rightPanelTabs: PanelItem[] = [
    {
      icon: <StructureIcon></StructureIcon>,
      content: <div>Structure</div>,
      title: 'Structure',
    },
    { icon: <FolderIcon></FolderIcon>, content: <div>Folder</div>, title: 'Folder' },
  ]
  const leftPanelTabs: PanelItem[] = [
    { icon: <PencilIcon></PencilIcon>, content: <div>Details</div>, title: 'Details' },
    {
      icon: <MagnifyingGlassIcon></MagnifyingGlassIcon>,
      content: <div>Search</div>,
      title: 'Search',
    },
  ]

  return (
    <div className='h-96'>
      <MultiPanelLayout
        leftCollapsedMode='smallTabs'
        rightCollapsedMode='smallTabs'
        mainContent={<div>Test</div>}
        // leftPanelContent={leftPanelTabs}
        initialLeftPanelContent={leftPanelTabs}
        initialRightPanelContent={rightPanelTabs}
      ></MultiPanelLayout>
    </div>
  )
}

export default MutliPanelLayoutSmallTabs
