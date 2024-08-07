import React from 'react'
import './tailwind.css'

import ReactDOM from 'react-dom/client'
import Demo from './DemoOverview'
// import MyComponent from './MyComponent'
import Guifad from './components/guifad/_Templates/Guifad'
import GuifadFuse from './components/guifad/_Templates/GuifadFuse'
import Table from './components/guifad/_Organisms/Table'
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

export * from './components/shell-layout/_Templates/ShellLayout'

// const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
// root.render(<Demo></Demo>)
