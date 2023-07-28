import React, { useState } from 'react'

import './tailwind.css'
import ShellLayout from './components/shell-layout/_Templates/ShellLayout'
import Guifad from './components/guifad/_Templates/Guifad'
import GuifadFuse from './components/guifad/_Templates/GuifadFuse'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import Table from './components/guifad/_Organisms/Table.tsx'
import TableDemo from './demo/TableDemo'

const queryClient = new QueryClient()
const Demo = () => {
  const [currentComponent, setCurrentComponent] = useState<'guifad' | 'table'>('guifad')

  return (
    <QueryClientProvider client={queryClient}>
      <ShellLayout
        title='Demo'
        shellMenu={{
          items: [
            {
              label: 'Guifad',
              id: '1',
              type: 'Command',
              command: (e) => {
                setCurrentComponent('guifad')
              },
            },
            {
              label: 'Table',
              id: '2',
              type: 'Command',
              command: (e) => {
                setCurrentComponent('table')
              },
            },
          ],
        }}
      >
        {currentComponent == 'guifad' && (
          <GuifadFuse rootEntityName='Employee' fuseUrl='https://localhost:7204/Api/'></GuifadFuse>
        )}
        {currentComponent == 'table' && <TableDemo></TableDemo>}
      </ShellLayout>
    </QueryClientProvider>
  )
}

export default Demo
