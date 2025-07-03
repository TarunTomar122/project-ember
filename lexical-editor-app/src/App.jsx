import LexicalEditor from './components/LexicalEditor'

function App() {
  return (
    <div style={{minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem'}}>
      <div style={{maxWidth: '64rem', margin: '0 auto', padding: '0 1rem'}}>
        <h1 style={{fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '2rem', textAlign: 'center'}}>
          Project Ember
        </h1>
        
        <div style={{backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '1.5rem'}}>
          <LexicalEditor />
        </div>
      </div>
    </div>
  )
}

export default App
