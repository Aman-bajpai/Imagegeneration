import React from 'react'
import TextWorkflow from './components/TextWorkflow'
import ImageWorkflow from './components/ImageWorkflow'
import './App.css'

function App() {
  return (
    <div className="App">
      <header>
        <h1>AI Generation Prototype</h1>
      </header>
      <div className="container">
        <TextWorkflow />
        <ImageWorkflow />
      </div>
    </div>
  )
}

export default App