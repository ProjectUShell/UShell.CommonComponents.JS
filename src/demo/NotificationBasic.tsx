import React, { useState } from 'react'
import Accordion from '../_Molecules/Accordion'
import Modal2 from '../_Atoms/Modal2'
import Notification, { showNotification } from '../_Molecules/Notification'

const NotificationBasic = () => {
  const [open, setOpen] = useState(false)

  return <button onClick={() => showNotification()}>Show Notification</button>
}

export default NotificationBasic
