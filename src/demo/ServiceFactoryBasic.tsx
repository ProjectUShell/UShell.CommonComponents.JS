import React, { useState } from 'react'
import { showNotification } from '../_Molecules/Notification'
import { createServiceProxy } from '../data/ServiceFactory'

interface IDemoService {
  calculate: (param: { a: number; b: number }) => Promise<{ return: number; fault?: string }>
}

const NotificationBasic = () => {
  const [a, setA] = useState(4)
  const [b, setB] = useState(3)
  const [result, setResult] = useState(0)

  const demoService: IDemoService = createServiceProxy<IDemoService>(
    'https://localhost:7288/DemoService/',
    () => {
      return {
        Authorization: 'MyToken',
      }
    },
    () => {
      return { _: { ClientId: '1234' } }
    },
  )

  return (
    <div>
      <input
        className='dark:bg-contentDark bg-content'
        type='number'
        value={a}
        onChange={(e) => setA(Number.parseInt(e.target.value))}
      ></input>
      <input
        className='dark:bg-contentDark bg-content'
        type='number'
        value={b}
        onChange={(e) => setB(Number.parseInt(e.target.value))}
      ></input>
      <button
        onClick={() => demoService.calculate({ a: a, b: b }).then((r) => setResult(r.return))}
      >
        Calculate
      </button>
      <div>
        <label>Result</label>
        <div>{result}</div>
      </div>
    </div>
  )
}

export default NotificationBasic
