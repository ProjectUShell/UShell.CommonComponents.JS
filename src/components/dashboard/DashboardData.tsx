import React from 'react'

export class DashboardEntry {
  title: string = ''
  row: number = 0
  column: number = 0
  render: (() => JSX.Element) | null = null
}
export class DashboardData {
  title: string = ''
  entires: DashboardEntry[] = []
}
