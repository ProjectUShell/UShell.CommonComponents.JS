import React, { useState } from 'react'
import Accordion from '../_Molecules/Accordion'
import Modal2 from '../_Atoms/Modal2'
import Notification, { showNotification } from '../_Molecules/Notification'

const NotificationBasic = () => {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button onClick={() => showNotification('Demo Notification', 'Info')}>Info</button>
      <button onClick={() => showNotification('Demo Notification', 'Success')}>Success</button>
      <button onClick={() => showNotification('Demo Notification', 'Warn')}>Warn</button>
      <button onClick={() => showNotification('Demo Notification', 'Error')}>Error</button>
    </div>
  )
}

export default NotificationBasic
