import React from 'react';
import logo from './assets/images/logo.png'
import polygon_one from './assets/images/polygon_one.svg'
import './assets/styles/App.scss'

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
      </header>
      <img src={polygon_one} className='polygon' alt='logo' />
    </div>
  )
}

export default App
