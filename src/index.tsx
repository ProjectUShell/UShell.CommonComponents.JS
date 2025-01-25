import React from 'react'
import './tailwind.css'

import ReactDOM from 'react-dom/client'
import Demo from './DemoOverview'
// import MyComponent from './MyComponent'
import Guifad from './components/guifad/_Templates/Guifad'
import GuifadFuse from './components/guifad/_Templates/GuifadFuse'
import Table from './components/guifad/_Organisms/Table'
import { TableColumn } from './components/guifad/_Organisms/Table'
import MultiSelectFilter from './_Molecules/MultiSelectFilter'
import ShellLayout from './components/shell-layout/_Templates/ShellLayout'
import { ShellMenu } from './components/shell-layout/ShellMenu'
import { FuseDataStore } from './data/FuseDataStore'
import { FuseDataSourceBody } from './data/FuseDataSourceBody'
import { FuseDataSourceRoute } from './data/FuseDataSourceRoute'
import { ReportManager1, ReportManager } from './components/report/_Templates/ReportManager'
import ReportEditor from './components/report/_Organisms/ReportEditor'
import ReportExplorer from './components/report/_Organisms/ReportExplorer'
import ReportResultViewer from './components/report/_Organisms/ReportResultViewer'
import ReportChart from './components/report/_Molecules/ReportChart'
import ReportTable from './components/report/_Molecules/ReportTable'
import ReportChartEditor from './components/report/_Molecules/ReportChartEditor'
import TabControl from './_Organisms/TabControl'
import Accordion from './_Molecules/Accordion'
import AccordionMenu from './_Molecules/AccordionMenu'
import UForm from './components/guifad/_Molecules/UForm'
import UForm1 from './components/guifad/_Molecules/UForm1'
import EntityForm from './components/guifad/_Organisms/EntityForm'
import EntityTable from './components/guifad/_Organisms/EntityTable'
import GlobalElementsContainer from './GlobalElementsContainer'
import { getIcon } from './utils/IconLib'
import { applyFilter, applyPaging, applySorting } from './utils/LogicUtils'
import MultiButton from './_Atoms/MultiButton'

// export { MyComponent }

export { ShellMenu }
export { Guifad }
export { GuifadFuse }
export { Table }
export { MultiSelectFilter }
export { ShellLayout }
export { FuseDataStore }
export { FuseDataSourceBody }
export { FuseDataSourceRoute }
export { ReportManager }
export { ReportManager1 }
export { ReportEditor, ReportExplorer, ReportResultViewer, ReportChartEditor }
export { ReportChart }
export { ReportTable }
export { TabControl }
export { Accordion }
export { AccordionMenu }
export { UForm }
export { UForm1 }
export { EntityForm }
export { EntityTable }
export { getIcon }
export { MultiButton }
export { applyFilter, applyPaging, applySorting }

export * from './components/shell-layout/_Templates/ShellLayout'

// const root2 = ReactDOM.createRoot(document.getElementById('root2') as HTMLElement)
// root2.render(<GlobalElementsContainer></GlobalElementsContainer>)

/***ONLY-NEEDED-FOR-DEMO***

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(<Demo></Demo>)

***ONLY-NEEDED-FOR-DEMO***/
