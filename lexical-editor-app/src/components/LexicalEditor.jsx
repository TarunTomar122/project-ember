import { $getSelection, $isRangeSelection } from 'lexical';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect, useState } from 'react';
import FloatingHUD from './FloatingHUD';

// Selection change plugin to detect text selection
function SelectionChangePlugin({ onSelectionChange }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const text = selection.getTextContent();
          if (text.length > 0) {
            // Get the native selection to determine position
            const nativeSelection = window.getSelection();
            if (nativeSelection.rangeCount > 0) {
              const range = nativeSelection.getRangeAt(0);
              const rect = range.getBoundingClientRect();
              onSelectionChange({
                text,
                rect,
                selection,
                hasSelection: true
              });
            }
          } else {
            onSelectionChange({ hasSelection: false });
          }
        } else {
          onSelectionChange({ hasSelection: false });
        }
      });
    });
  }, [editor, onSelectionChange]);

  return null;
}

const theme = {
  // Minimal theme for the editor
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
  },
};

const initialConfig = {
  namespace: 'LexicalEditor',
  theme,
  onError: (error) => {
    console.error('Lexical Error:', error);
  },
};

export default function LexicalEditor() {
  const [selectionData, setSelectionData] = useState({ hasSelection: false });

  const handleSelectionChange = useCallback((data) => {
    setSelectionData(data);
  }, []);

  return (
    <div className="editor-container">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="editor-content focus:outline-none"
                placeholder={
                  <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
                    Start typing here...
                  </div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <SelectionChangePlugin onSelectionChange={handleSelectionChange} />
          
          {selectionData.hasSelection && (
            <FloatingHUD
              rect={selectionData.rect}
              selectedText={selectionData.text}
            />
          )}
        </div>
      </LexicalComposer>
    </div>
  );
} 