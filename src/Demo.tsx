import React, { useState } from 'react'

import './App.css'
import ShellLayout from './components/shell-layout/_Templates/ShellLayout'
import Guifad from './components/guifad/_Templates/Guifad'
import GuifadFuse from './components/guifad/_Templates/GuifadFuse'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'

const queryClient = new QueryClient()
const Demo = () => {
  const [currentComponent, setCurrentComponent] = useState<'guifad'>('guifad')

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
          ],
        }}
      >
        {currentComponent == 'guifad' && (
          <GuifadFuse rootEntityName='Employee' fuseUrl='https://localhost:7204/Api/'></GuifadFuse>
        )}
      </ShellLayout>
    </QueryClientProvider>
  )
}

export default Demo
