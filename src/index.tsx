import React from 'react'
import './tailwind.css'

import ReactDOM from 'react-dom/client'
import Demo from './Demo'
// import MyComponent from './MyComponent'
import Guifad from './components/guifad/_Templates/Guifad'
import GuifadFuse from './components/guifad/_Templates/GuifadFuse'
import Table from './components/guifad/_Organisms/Table.tsx'
import MultiSelectFilter from './_Molecules/MultiSelectFilter'
import ShellLayout from './components/shell-layout/_Templates/ShellLayout'

// export { MyComponent }
export { Guifad }
export { GuifadFuse }
export { Table }
export { MultiSelectFilter }
export { ShellLayout }

export * from './components/shell-layout/_Templates/ShellLayout'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(<Demo></Demo>)
