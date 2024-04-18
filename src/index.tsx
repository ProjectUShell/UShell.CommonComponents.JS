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

export * from './components/shell-layout/_Templates/ShellLayout'

// const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
// root.render(<Demo></Demo>)
