import React from 'react'
import ReactDOM from 'react-dom/client'
import Demo from './Demo'
// import MyComponent from './MyComponent'
import Guifad from './components/guifad/_Templates/Guifad'
import GuifadFuse from './components/guifad/_Templates/GuifadFuse'

// export { MyComponent }
export { Guifad }
export { GuifadFuse }

export * from './components/shell-layout/_Templates/ShellLayout'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <Demo></Demo>
  </React.StrictMode>,
)
