import { useEffect, useState } from 'react';
import LexicalEditor from './components/LexicalEditor';
import Navigation from './components/Navigation';
import LeftSidebar from './components/LeftSidebar';
import BibleContainer from './components/bible/BibleContainer';
import TextAnalysis from './components/TextAnalysis';
import ModalManager from './components/shared/ModalManager';
import useBibleStore from './stores/bibleStore';
import { initializeStorage } from './services/storage';

function App() {
  const [activeTab, setActiveTab] = useState('editor');
  const { loadData, activeBibleSection, setActiveBibleSection } = useBibleStore();

  useEffect(() => {
    // Initialize storage and load data
    initializeStorage();
    loadData();
    // Set default bible section if none is set
    if (!activeBibleSection) {
      setActiveBibleSection('characters');
    }
  }, [loadData, activeBibleSection, setActiveBibleSection]);

  // Check if we should show the left sidebar (only for bible tab)
  const shouldShowSidebar = activeTab === 'bible';

  const renderMainContent = () => {
    switch (activeTab) {
      case 'editor':
        return (
          <div style={{minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem'}}>
            <div style={{maxWidth: '64rem', margin: '0 auto', padding: '0 1rem'}}>
              <div style={{backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '1.5rem'}}>
                <LexicalEditor />
              </div>
            </div>
          </div>
        );
      case 'bible':
        return (
          <div className="h-full overflow-y-auto">
            <BibleContainer />
          </div>
        );
      case 'tools':
        return (
          <div className="h-full overflow-y-auto">
            <div className="p-6">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tools</h2>
                <p className="text-gray-600">AI-powered brainstorming and project overview coming soon...</p>
              </div>
            </div>
          </div>
        );
      case 'analysis':
        return (
          <div className="h-full overflow-y-auto">
            <div className="p-6">
              <TextAnalysis />
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Project Ember</h3>
              <p className="text-gray-600">Select a tab to get started</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex overflow-hidden">
        {shouldShowSidebar && (
          <LeftSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
        <div className="flex-1 overflow-hidden">
          {renderMainContent()}
        </div>
      </div>
      <ModalManager />
    </div>
  );
}

export default App
