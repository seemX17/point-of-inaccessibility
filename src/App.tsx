import { AddPolygon } from 'components/AddPolygon'
import logo from './assets/images/logo.png'
import './assets/styles/App.scss'

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
      </header>
      <AddPolygon />
    </div>
  )
}

export default App
