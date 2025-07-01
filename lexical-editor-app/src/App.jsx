import LexicalEditor from './components/LexicalEditor'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Lexical Editor with Floating HUD
        </h1>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <LexicalEditor />
        </div>
        <div className="mt-4 text-sm text-gray-600 text-center">
          <p>Select some text to see the floating HUD with "Rewrite" and "Expand" buttons</p>
          <p className="mt-1">The "Expand" button uses AI (OpenAI or Gemini) to enhance your selected text</p>
          <p className="mt-1">Switch between AI providers when multiple are configured</p>
        </div>
      </div>
    </div>
  )
}

export default App
