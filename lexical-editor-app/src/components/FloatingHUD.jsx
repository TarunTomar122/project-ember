import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useState } from 'react';

export default function FloatingHUD({ rect, selection }) {
  const [editor] = useLexicalComposerContext();
  const [position, setPosition] = useState({ top: 0, left: 0 });

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

  const handleExplainClick = () => {
    editor.update(() => {
      if (selection) {
        // Replace selected text with explanation
        selection.insertText('This is an explanation.');
      }
    });
  };

  if (!rect) return null;

  return (
    <div
      className="floating-hud bg-gray-800 rounded-lg shadow-lg px-3 py-2 flex gap-2"
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
      <button
        onClick={handleExplainClick}
        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors duration-150"
      >
        Explain
      </button>
    </div>
  );
} 