import React from 'react'
import { addGlobalElement } from '../GlobalElementsContainer'

const Notification = () => {
  return <div>Notification</div>
}

export function showNotification() {
  addGlobalElement('test', <div>First Notification</div>)
}

export default Notification
