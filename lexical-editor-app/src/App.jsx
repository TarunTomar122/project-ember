import { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import MainSideNavigation from './components/MainSideNavigation';
import BrainstormContainer from './components/brainstorm/BrainstormContainer';
import WriteContainer from './components/WriteContainer';
import BibleContainer from './components/bible/BibleContainer';
import TextAnalysis from './components/TextAnalysis';
import ModalManager from './components/shared/ModalManager';
import useBibleStore from './stores/bibleStore';
import { initializeStorage } from './services/storage';

function App() {
  const [activeTab, setActiveTab] = useState('write');
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

  const renderMainContent = () => {
    switch (activeTab) {
      case 'brainstorm':
        return <BrainstormContainer />;
      case 'write':
        return <WriteContainer />;
      case 'bible':
        return <BibleContainer />;
      case 'analyse':
        return (
          <div className="h-full overflow-y-auto">
            <div className="p-6">
              <TextAnalysis />
            </div>
          </div>
        );
      case 'publish':
        return (
          <div className="h-full overflow-y-auto">
            <div className="p-6">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Publish</h2>
                <p className="text-gray-600">Publishing tools and options coming soon...</p>
              </div>
            </div>
          </div>
        );
      case 'marketing':
        return (
          <div className="h-full overflow-y-auto">
            <div className="p-6">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Marketing</h2>
                <p className="text-gray-600">Marketing tools and analytics coming soon...</p>
              </div>
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
      {/* Top Navigation */}
      <Navigation />
      
      {/* Main Content Area with Side Navigation */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side Navigation */}
        <MainSideNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {renderMainContent()}
        </div>
      </div>
      
      <ModalManager />
    </div>
  );
}

export default App
