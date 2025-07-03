import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useState } from 'react';
import { $getSelection, $isRangeSelection } from 'lexical';
import { 
  expandText, 
  rewriteText,
  describeText,
  isCurrentProviderConfigured, 
  getAvailableProviders, 
  getCurrentProvider,
  setProvider,
  getProviderDisplayName,
  getToneOptions,
  getFullDocumentContext
} from '../services/aiProvider';

// Inline Suggestion Component - shows both original and suggested text
function InlineSuggestion({ 
  suggestion, 
  originalText,
  onAccept, 
  onReject, 
  rect 
}) {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (rect) {
      const margin = -120;
      const viewportWidth = window.innerWidth;
      const containerWidth = 600; // Approximate width of the suggestion container
      
      // Calculate center position of the selected text
      const selectionCenter = rect.left + (rect.width / 2);
      
      // Calculate left position for the container (centered on selection)
      let leftPosition = selectionCenter;
      
      // Adjust if container would go off the right edge
      if (leftPosition + (containerWidth / 2) > viewportWidth - 20) {
        leftPosition = viewportWidth - (containerWidth / 2) - 20;
      }
      
      // Adjust if container would go off the left edge
      if (leftPosition - (containerWidth / 2) < 20) {
        leftPosition = (containerWidth / 2) + 20;
      }
      
      setPosition({
        top: rect.bottom + margin,
        left: leftPosition - 280,
      });
    }
  }, [rect]);

  if (!suggestion) return null;

  return (
    <div
      className="inline-suggestion-container"
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 1000,
      }}
    >
      {/* Text Comparison */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 mb-2 max-w-2xl">
        <div className="space-y-3">
          {/* Original Text - Red highlight */}
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="text-xs text-red-600 font-medium mb-1">Original:</div>
            <div className="text-sm text-red-800 line-through decoration-red-500">
              {originalText}
            </div>
          </div>
          
          {/* Suggested Text - Green highlight */}
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="text-xs text-green-600 font-medium mb-1">
              {suggestion.action === 'expand' ? 'Expanded:' : 'Rewritten:'}
            </div>
            <div className="text-sm text-green-800">
              {suggestion.action === 'expand' 
                ? suggestion.result.expanded_text 
                : suggestion.result.rewritten_text}
            </div>
          </div>
        </div>
      </div>
      
      {/* Accept/Reject Buttons */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 flex gap-3 items-center">
        <button
          onClick={onAccept}
          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center gap-1"
        >
          <span>✓</span> Accept
        </button>
        <button
          onClick={onReject}
          className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center gap-1"
        >
          <span>✗</span> Reject
        </button>
        <div className="text-xs text-gray-500 font-medium">
          {suggestion.action === 'expand' && 'Text Expansion'}
          {suggestion.action === 'rewrite' && 'Text Rewrite'}
        </div>
      </div>
    </div>
  );
}

// Analysis Display Component
function AnalysisDisplay({ analysis, onClose, rect }) {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (rect) {
      const margin = -120;
      const viewportWidth = window.innerWidth;
      const containerWidth = 400; // Approximate width of the analysis container
      
      // Calculate center position of the selected text
      const selectionCenter = rect.left + (rect.width / 2);
      
      // Calculate left position for the container (centered on selection)
      let leftPosition = selectionCenter;
      
      // Adjust if container would go off the right edge
      if (leftPosition + (containerWidth / 2) > viewportWidth - 20) {
        leftPosition = viewportWidth - (containerWidth / 2) - 20;
      }
      
      // Adjust if container would go off the left edge
      if (leftPosition - (containerWidth / 2) < 20) {
        leftPosition = (containerWidth / 2) + 20;
      }
      
      setPosition({
        top: rect.bottom + margin,
        left: leftPosition - 280,
      });
    }
  }, [rect]);

  if (!analysis) return null;

  return (
    <div
      className="analysis-display"
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 1000,
      }}
    >
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-md">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-gray-800">Text Analysis</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-3 text-sm">
          <div>
            <h4 className="font-medium text-gray-700 mb-1">Analysis:</h4>
            <p className="text-gray-600">{analysis.analysis}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-1">Strengths:</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {analysis.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-1">Suggestions:</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {analysis.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-1">Rating:</h4>
            <p className="text-gray-600 font-medium">{analysis.overall_rating}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FloatingHUD({ rect, selectedText }) {
  const [editor] = useLexicalComposerContext();
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProvider, setCurrentProvider] = useState(getCurrentProvider());
  const [availableProviders, setAvailableProviders] = useState([]);
  const [showProviderDropdown, setShowProviderDropdown] = useState(false);
  const [showToneDropdown, setShowToneDropdown] = useState(false);
  const [selectedTone, setSelectedTone] = useState('same_tone');
  const [toneOptions, setToneOptions] = useState({ options: {}, labels: {} });
  const [currentSuggestion, setCurrentSuggestion] = useState(null);
  const [originalText, setOriginalText] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(null);

  useEffect(() => {
    setAvailableProviders(getAvailableProviders());
    setToneOptions(getToneOptions());
  }, []);

  useEffect(() => {
    if (rect) {
      // Position the HUD below the selected text
      const margin = -120;
      const viewportWidth = window.innerWidth;
      const hudWidth = 400; // Approximate width of the HUD
      
      // Calculate center position of the selected text
      const selectionCenter = rect.left + (rect.width / 2);
      
      // Calculate left position for the HUD (centered on selection)
      let leftPosition = selectionCenter;
      
      // Adjust if HUD would go off the right edge
      if (leftPosition + (hudWidth / 2) > viewportWidth - 20) {
        leftPosition = viewportWidth - (hudWidth / 2) - 20;
      }
      
      // Adjust if HUD would go off the left edge
      if (leftPosition - (hudWidth / 2) < 20) {
        leftPosition = (hudWidth / 2) + 20;
      }
      
      setPosition({
        top: rect.bottom + margin,
        left: leftPosition - 280 ,
      });
    }
  }, [rect]);

  const handleProviderChange = (providerId) => {
    setProvider(providerId);
    setCurrentProvider(providerId);
    setShowProviderDropdown(false);
    setToneOptions(getToneOptions());
  };

  const handleToneChange = (tone) => {
    setSelectedTone(tone);
    setShowToneDropdown(false);
  };

  const handleAIAction = async (action) => {
    if (!selectedText || isProcessing) return;
    
    // Check if current provider is configured
    if (!isCurrentProviderConfigured()) {
      console.warn(`⚠️ ${getProviderDisplayName(currentProvider)} API key not configured`);
      console.log('Please add the API key to your environment variables:');
      if (currentProvider === 'openai') {
        console.log(`VITE_OPENAI_API_KEY=your_api_key_here`);
      } else if (currentProvider === 'gemini') {
        console.log(`VITE_GEMINI_API_KEY=your_api_key_here`);
      }
      return;
    }
    
    if (!selectedText.trim()) {
      console.warn('⚠️ No text selected for AI processing');
      console.log('Please select some text in the editor first.');
      return;
    }

    setIsProcessing(true);
    setOriginalText(selectedText);
    
    let fullContext = null;
    
    try {
      // Get full document context
      fullContext = await getFullDocumentContext(editor);
      
      let result;
      switch (action) {
        case 'expand':
          result = await expandText(selectedText, fullContext, selectedTone);
          break;
        case 'rewrite':
          result = await rewriteText(selectedText, fullContext, selectedTone);
          break;
        case 'describe':
          result = await describeText(selectedText, fullContext);
          break;
        default:
          throw new Error(`Unknown action: ${action}`);
      }

      if (action === 'describe') {
        // Show analysis display
        setShowAnalysis(result.result);
      } else {
        // For expand/rewrite, show suggestion comparison (DON'T replace text yet)
        setCurrentSuggestion({
          action,
          result: result.result
        });
      }
    } catch (error) {
      console.group(`🚨 Error performing ${action} with ${getProviderDisplayName(currentProvider)}`);
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.log('Selected text:', selectedText);
      console.log('Full context length:', fullContext?.length || 0);
      console.log('Selected tone:', selectedTone);
      console.log('Current provider:', currentProvider);
      console.log('Provider configured:', isCurrentProviderConfigured());
      console.groupEnd();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAcceptSuggestion = () => {
    if (!currentSuggestion) return;
    
    // Replace the selected text with the suggestion
    const newText = currentSuggestion.action === 'expand' 
      ? currentSuggestion.result.expanded_text 
      : currentSuggestion.result.rewritten_text;
    
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.insertText(newText);
      }
    });
    
    // Clear the suggestion
    setCurrentSuggestion(null);
    setOriginalText('');
  };

  const handleRejectSuggestion = () => {
    // Just clear the suggestion - keep original text as is
    setCurrentSuggestion(null);
    setOriginalText('');
  };

  const handleCloseAnalysis = () => {
    setShowAnalysis(null);
  };

  if (!rect) return null;

  return (
    <>
      {/* Main HUD - only show if no active suggestion */}
      {!currentSuggestion && !showAnalysis && (
        <div
          className="floating-hud bg-gray-800 rounded-lg shadow-lg px-4 py-3 flex gap-2 items-center"
          style={{
            position: 'absolute',
            top: `${position.top}px`,
            left: `${position.left}px`,
            transform: 'translateX(-50%)',
            zIndex: 1000,
          }}
        >
          {/* Action Buttons */}
          <button
            onClick={() => handleAIAction('expand')}
            disabled={isProcessing || availableProviders.length === 0}
            className={`px-3 py-1.5 text-white text-sm rounded transition-colors duration-150 ${
              isProcessing || availableProviders.length === 0
                ? 'bg-green-500 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
            title={availableProviders.length === 0 ? 'No AI providers configured' : 'Expand selected text'}
          >
            {isProcessing ? 'Processing...' : 'Expand'}
          </button>

          <button
            onClick={() => handleAIAction('rewrite')}
            disabled={isProcessing || availableProviders.length === 0}
            className={`px-3 py-1.5 text-white text-sm rounded transition-colors duration-150 ${
              isProcessing || availableProviders.length === 0
                ? 'bg-blue-500 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            title={availableProviders.length === 0 ? 'No AI providers configured' : 'Rewrite selected text'}
          >
            Rewrite
          </button>

          <button
            onClick={() => handleAIAction('describe')}
            disabled={isProcessing || availableProviders.length === 0}
            className={`px-3 py-1.5 text-white text-sm rounded transition-colors duration-150 ${
              isProcessing || availableProviders.length === 0
                ? 'bg-purple-500 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
            title={availableProviders.length === 0 ? 'No AI providers configured' : 'Analyze selected text'}
          >
            Describe
          </button>
          
          {/* Tone Selector */}
          {Object.keys(toneOptions.options).length > 1 && (
            <div className="relative">
              <button
                onClick={() => setShowToneDropdown(!showToneDropdown)}
                className="px-2 py-1.5 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded transition-colors duration-150 flex items-center gap-1"
                disabled={isProcessing}
              >
                <span className="max-w-20 truncate">
                  {toneOptions.labels[selectedTone] || 'Tone'}
                </span>
                <span className="text-gray-300">▼</span>
              </button>
              
              {showToneDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-gray-700 rounded shadow-lg border border-gray-600 min-w-40 z-10">
                  {Object.entries(toneOptions.options).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => handleToneChange(value)}
                      className={`block w-full text-left px-3 py-2 text-xs hover:bg-gray-600 transition-colors ${
                        value === selectedTone ? 'bg-gray-600 text-white' : 'text-gray-300'
                      }`}
                    >
                      {toneOptions.labels[value]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Provider Selector */}
          {availableProviders.length > 1 && (
            <div className="relative">
              <button
                onClick={() => setShowProviderDropdown(!showProviderDropdown)}
                className="px-2 py-1.5 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded transition-colors duration-150 flex items-center gap-1"
                disabled={isProcessing}
              >
                <span className="max-w-24 truncate">
                  {getProviderDisplayName(currentProvider)}
                </span>
                <span className="text-gray-300">▼</span>
              </button>
              
              {showProviderDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-gray-700 rounded shadow-lg border border-gray-600 min-w-max z-10">
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
        </div>
      )}

      {/* Inline Suggestion Display */}
      {currentSuggestion && (
        <InlineSuggestion
          suggestion={currentSuggestion}
          originalText={originalText}
          onAccept={handleAcceptSuggestion}
          onReject={handleRejectSuggestion}
          rect={rect}
        />
      )}

      {/* Analysis Display */}
      {showAnalysis && (
        <AnalysisDisplay
          analysis={showAnalysis}
          onClose={handleCloseAnalysis}
          rect={rect}
        />
      )}
    </>
  );
} 