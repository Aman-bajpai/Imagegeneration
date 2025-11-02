import React from 'react'
import TextWorkflow from './components/TextWorkflow'
import ImageWorkflow from './components/ImageWorkflow'

function App() {
  return (
    <div className="max-w-6xl mx-auto p-5 min-h-screen py-5">
      <header className="text-center bg-white rounded-lg p-8 mb-8 shadow-md border border-gray-200">
        <h1 className="text-blue-600 m-0 text-4xl font-bold">
          AI Generation Prototype
        </h1>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TextWorkflow />
        <ImageWorkflow />
      </div>
    </div>
  )
}

export default App