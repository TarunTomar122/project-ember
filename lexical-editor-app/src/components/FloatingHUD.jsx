import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useState } from 'react';
import { 
  expandText, 
  isCurrentProviderConfigured, 
  getAvailableProviders, 
  getCurrentProvider,
  setProvider,
  getProviderDisplayName 
} from '../services/aiProvider';

export default function FloatingHUD({ rect, selection, selectedText }) {
  const [editor] = useLexicalComposerContext();
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isExpanding, setIsExpanding] = useState(false);
  const [currentProvider, setCurrentProvider] = useState(getCurrentProvider());
  const [availableProviders, setAvailableProviders] = useState([]);
  const [showProviderDropdown, setShowProviderDropdown] = useState(false);

  useEffect(() => {
    setAvailableProviders(getAvailableProviders());
  }, []);

  useEffect(() => {
    if (rect) {
      // Position the HUD above the selected text
      const hudHeight = 50; // Approximate height of the HUD
      const margin = 10;
      
      setPosition({
        top: rect.top - hudHeight - margin + window.scrollY,
        left: rect.left + (rect.width / 2) + window.scrollX,
      });
    }
  }, [rect]);

  const handleRewriteClick = () => {
    editor.update(() => {
      if (selection) {
        // Replace selected text with rewritten version
        selection.insertText('Rewritten text...');
      }
    });
  };

  const handleProviderChange = (providerId) => {
    setProvider(providerId);
    setCurrentProvider(providerId);
    setShowProviderDropdown(false);
  };

  const handleExpandClick = async (selectedText) => {
    if (!selectedText || isExpanding) return;
    
    // Check if current provider is configured
    if (!isCurrentProviderConfigured()) {
      console.log(`${getProviderDisplayName(currentProvider)} API key not configured. Please add the API key to your environment variables.`);
      return;
    }
    
    if (!selectedText.trim()) {
      console.log('Please select some text to expand.');
      return;
    }

    setIsExpanding(true);
    
    try {
      const expandedText = await expandText(selectedText);
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.insertText(expandedText);
        }
      });
    } catch (error) {
      console.error('Error expanding text:', error);
      alert(`Failed to expand text with ${getProviderDisplayName(currentProvider)}. Please try again.`);
    } finally {
      setIsExpanding(false);
    }
  };

  if (!rect) return null;

  return (
    <div
      className="floating-hud bg-gray-800 rounded-lg shadow-lg px-3 py-2 flex gap-2 items-center"
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateX(-50%)',
        zIndex: 1000,
      }}
    >
      <button
        onClick={handleRewriteClick}
        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors duration-150"
      >
        Rewrite
      </button>
      
      {/* Provider Selector */}
      {availableProviders.length > 1 && (
        <div className="relative">
          <button
            onClick={() => setShowProviderDropdown(!showProviderDropdown)}
            className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded transition-colors duration-150 flex items-center gap-1"
          >
            {getProviderDisplayName(currentProvider)}
            <span className="text-gray-300">▼</span>
          </button>
          
          {showProviderDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-gray-700 rounded shadow-lg border border-gray-600 min-w-max">
              {availableProviders.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => handleProviderChange(provider.id)}
                  className={`block w-full text-left px-3 py-2 text-xs hover:bg-gray-600 transition-colors ${
                    provider.id === currentProvider ? 'bg-gray-600 text-white' : 'text-gray-300'
                  }`}
                >
                  {provider.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      
      <button
        onClick={() => handleExpandClick(selectedText)}
        disabled={isExpanding || availableProviders.length === 0}
        className={`px-3 py-1 text-white text-sm rounded transition-colors duration-150 ${
          isExpanding || availableProviders.length === 0
            ? 'bg-green-500 cursor-not-allowed' 
            : 'bg-green-600 hover:bg-green-700'
        }`}
        title={availableProviders.length === 0 ? 'No AI providers configured' : ''}
      >
        {isExpanding ? 'Expanding...' : 'Expand'}
      </button>
    </div>
  );
} 