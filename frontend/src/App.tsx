import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_SERVICE_URL
console.log('Backend service URL:', axios.defaults.baseURL)
function App() {
  const [count, setCount] = useState(0)

  const [res, setRes] = useState('Processing...')

  useEffect(() => {
    axios.get('/hello').then((response) => {
      setRes(response.data)
    })
  })

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <p>
          Pinging the backend service at <code>{axios.defaults.baseURL}</code>: <br />
          {res}
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
