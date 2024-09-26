import React, { useMemo, useRef, useState } from 'react'

import './tailwind.css'
import ShellLayout from './components/shell-layout/_Templates/ShellLayout'
import Guifad from './components/guifad/_Templates/Guifad'
import GuifadFuse from './components/guifad/_Templates/GuifadFuse'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import Table from './components/guifad/_Organisms/Table'
import { TableDemo, DropdownButtonDemo } from './demo'
import TrashIcon from './_Icons/TrashIcon'
import CogWheelIcon from './components/shell-layout/_Icons/CogWheelIcon'
import XMarkIcon from './_Icons/XMarkIcon'
import { FuseDataStore } from './data/FuseDataStore'
import ResizableTable from './components/guifad/_Organisms/ResizableTable'
import ResizableTable2 from './components/guifad/_Organisms/ResizeableTable'
import ColorDemo from './demo/ColorDemo'
import SchemaEditor from './components/schema-editor/components/SchemaEditor'
import SchemaManager from './components/schema-editor/components/SchemaManager'
import { LocalStorageSchemaProvider } from './components/schema-editor/LocalStorageSchemaProvider'
import {
  activateItem,
  loadShellMenuState,
  ShellMenuState,
} from './components/shell-layout/ShellMenuState'
import { MenuItem } from './components/shell-layout/ShellMenu'
import { SchemaRoot } from 'fusefx-modeldescription'
import { ISchemaProvider } from './components/schema-editor/ISchemaProvider'
import TabControl, { TabItem } from './_Organisms/TabControl'
import ReportChart from './components/report/_Molecules/ReportChart'
import ReportManager, { ReportManager1 } from './components/report/_Templates/ReportManager'
import { ReportServiceConnector } from './components/report/ReportServiceConnector'
import { LocalStorageReportRepository } from './components/report/LocalStorageReportRepository'
import { ColorMode, loadShellSettings } from './components/shell-layout/ShellSettings'
import Dashboard from './components/dashboard/_Templates/Dashboard'
import DropdownMultiSelectDemo from './demo/DropdownMultiSelectDemo'
import TableDemo1 from './demo/TableDemo1'

const queryClient = new QueryClient()
const Demo = () => {
  FuseDataStore.getTokenMethod = () =>
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3MTM2OTg3NjYsImV4cCI6MTc0NTIzNDc2NiwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.C-c7FWta-4pyjSZL1tnOlLdI6fFHM6d11VpWVrtJwqA'
  const [currentComponent, setCurrentComponent] = useState<string>('TableDemo')
  const [tabIndex, setTabIndex] = useState(0)
  const demoComponents: string[] = ['Guifad', 'Table', 'Common', 'SchemaEditor', 'Reports']
  const subComponents: { [key: string]: string[] } = {
    Guifad: ['GuifadDemo', 'GuifadDemo2', 'GuifadDemo3'],
    Table: ['TableDemo', 'ResizeTable', 'ResizeTable2', 'Table1'],
    Common: ['ColorDemo', 'DropdownButtonDemo', 'DropdownMultiSelectDemo'],
    SchemaEditor: ['Schema Manager', 'Editor', 'Schema Guifad'],
    Reports: ['ReportService', 'ReportManager', 'ReportDashboard'],
  }

  const [schemaName, setSchemaName] = useState('')
  const [schemaProvider, setSchemaProvider] = useState<ISchemaProvider>(
    new LocalStorageSchemaProvider(),
  )

  const menuItems: MenuItem[] = demoComponents.map((dc) => {
    return {
      label: dc,
      id: dc,
      type: subComponents[dc] ? 'Group' : 'Command',
      command: (e) => {
        setCurrentComponent(dc)
      },
      children: subComponents[dc]?.map((sc) => {
        return {
          label: sc,
          id: sc,
          type: 'Command',
          command: (e) => {
            setCurrentComponent(sc)
          },
        }
      }),
    }
  })

  const shellMenuState = useMemo(() => {
    const res: ShellMenuState = loadShellMenuState()
    setCurrentComponent(res.activeItemId)
    return res
  }, [])

  const shellSettings = loadShellSettings()

  return (
    <QueryClientProvider client={queryClient}>
      <ShellLayout
        title='Demo'
        shellMenu={{
          items: menuItems,
          topBarItems: [
            {
              icon: (
                <button className='align-middle'>
                  <TrashIcon></TrashIcon>
                </button>
              ),
              id: 'hi',
            },
            {
              icon: (
                <button className='align-middle'>
                  <XMarkIcon size={0}></XMarkIcon>
                </button>
              ),
              id: 'you',
            },
          ],
        }}
        shellMenuState={shellMenuState}
      >
        {(currentComponent == 'GuifadDemo' || currentComponent == 'GuifadDemo2') && (
          <TabControl
            tabItems={[
              {
                id: '1',
                canClose: false,
                title: 'Fonds 1',
                tag: null,
                renderMethod: () => (
                  <GuifadFuse
                    rootEntityName={currentComponent == 'GuifadDemo' ? 'Depot' : 'Fund'}
                    routePattern='route'
                    fuseUrl='https://localhost:7288/FundsManagement/'
                  ></GuifadFuse>
                ),
              },
              {
                id: '2',
                canClose: false,
                title: 'Fonds 2',
                tag: null,
                renderMethod: () => (
                  <GuifadFuse
                    rootEntityName={currentComponent == 'GuifadDemo' ? 'Depot' : 'Fund'}
                    routePattern='route'
                    fuseUrl='https://localhost:7288/FundsManagement/'
                  ></GuifadFuse>
                ),
              },
            ]}
            initialActiveTabIndex={tabIndex}
            onTabChange={(i: TabItem, idx: number) => setTabIndex(idx)}
            onTabClose={() => console.log('tab close')}
          ></TabControl>
        )}
        {currentComponent == 'GuifadDemo3' && (
          <GuifadFuse
            rootEntityName='Person'
            routePattern='body'
            fuseUrl='https://localhost:7288/AccountManagement/'
            // record={{ Id: 2, MirstName: 'Max' }}
          ></GuifadFuse>
        )}
        {currentComponent == 'TableDemo' && <TableDemo></TableDemo>}
        {currentComponent == 'DropdownButtonDemo' && <DropdownButtonDemo></DropdownButtonDemo>}
        {currentComponent == 'DropdownMultiSelectDemo' && (
          <DropdownMultiSelectDemo></DropdownMultiSelectDemo>
        )}
        {currentComponent == 'ResizeTable' && (
          <ResizableTable
            columns={[
              { key: 'p1', title: 'test1' },
              { key: 'p2', title: 'test2' },
            ]}
            data={[{ p1: 'dasdsdsdasds', p2: 'dfafasfsdf' }]}
          ></ResizableTable>
        )}
        {currentComponent == 'ResizeTable2' && (
          <ResizableTable2
            columns={[
              { key: 'p1', name: 'test1', width: 100 },
              { key: 'p2', name: 'test2', width: 100 },
            ]}
            data={[
              {
                p1: 'dasdsdsdasds asdsdasd sdasdasdasd dsadasd das dsa dsad sadsadasdsad',
                p2: 'dfafasfsdf',
              },
            ]}
          ></ResizableTable2>
        )}
        {currentComponent == 'Table1' && <TableDemo1></TableDemo1>}
        {currentComponent == 'ColorDemo' && <ColorDemo></ColorDemo>}
        {currentComponent == 'Schema Manager' && (
          <SchemaManager
            schemaProvider={new LocalStorageSchemaProvider()}
            enterSchema={(sn: string) => {
              setSchemaName(sn)
              activateItem(
                menuItems
                  .find((mi) => mi.id == 'SchemaEditor')!
                  .children?.find((c) => c.id == 'Editor')!,
              )
            }}
          ></SchemaManager>
        )}
        {currentComponent == 'Editor' && (
          <SchemaEditor
            schemaName={schemaName}
            schema={schemaProvider.loadSchema(schemaName)}
            onChangeSchema={(s: SchemaRoot) => {
              schemaProvider.saveSchema(schemaName, s)
            }}
            onChangeSchemaName={(sn: string) => {
              schemaProvider.updateName(schemaName, sn)
              setSchemaName(sn)
            }}
          ></SchemaEditor>
        )}
        {currentComponent == 'ReportManager' && (
          <ReportManager1
            reportRepository={new LocalStorageReportRepository()}
            reportSerivce={new ReportServiceConnector('https://localhost:7288/ReportService')}
            dark={shellSettings.colorMode == ColorMode.Dark}
          ></ReportManager1>
        )}
        {currentComponent == 'ReportDashboard' && (
          <Dashboard
            data={{
              title: 'Dashboard Test',
              entires: [
                { column: 0, row: 0, title: 'Test 1', render: () => <div>Test 1</div> },
                { column: 0, row: 0, title: 'Test 2', render: () => <div>Test 2</div> },
              ],
            }}
          ></Dashboard>
        )}
      </ShellLayout>
    </QueryClientProvider>
  )
}

export default Demo
