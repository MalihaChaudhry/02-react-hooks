// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import React, {useEffect, useState} from 'react'

function useLocalStorageState(key, defaultValue = '') {
  if (typeof defaultValue === 'object')
    defaultValue = JSON.stringify(defaultValue)

  const [value, setValue] = useState(
    () => window.localStorage.getItem(key) || defaultValue,
  )

  useEffect(() => {
    window.localStorage.setItem(key, value)
  }, [key, value])

  return [value, setValue]
}

function Greeting({initialName = ''}) {
  const [value, setValue] = useLocalStorageState('name', {num: 99})

  function handleChange(event) {
    setValue(event.target.value)
  }

  useEffect(() => {
    console.log('Component has mounted!!!!')
    return () => console.log('Component is unmounting...')
  }, [])

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={value} onChange={handleChange} id="name" />
      </form>
      {value ? <strong>Hello {value}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  const [unmount, setUnmount] = useState(false)

  return (
    <>
      <button style={{marginBottom: 100}} onClick={() => setUnmount(true)}>
        Unmount Greeting
      </button>
      {!unmount && <Greeting initialName="Ishy" />}
    </>
  )
}

export default App
