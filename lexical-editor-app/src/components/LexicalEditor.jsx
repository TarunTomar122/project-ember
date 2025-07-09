import { $getSelection, $isRangeSelection, $getRoot, $createParagraphNode, $createTextNode } from 'lexical';
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

// Content change plugin to track content changes
function ContentChangePlugin({ onContentChange }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        const textContent = root.getTextContent();
        const wordCount = textContent.trim().split(/\s+/).filter(word => word.length > 0).length;
        
        // Get the JSON representation of the editor state
        const contentJSON = JSON.stringify(editorState.toJSON());
        
        if (onContentChange) {
          onContentChange(contentJSON, wordCount);
        }
      });
    });
  }, [editor, onContentChange]);

  return null;
}

// Plugin to set initial content
function InitialContentPlugin({ initialContent, storyId }) {
  const [editor] = useLexicalComposerContext();
  const [hasInitialized, setHasInitialized] = useState(false);
  const [currentStoryId, setCurrentStoryId] = useState(null);

  useEffect(() => {
    // Only initialize content when:
    // 1. Story ID changes (switching stories)
    // 2. First time loading (hasInitialized is false)
    const shouldInitialize = currentStoryId !== storyId || !hasInitialized;
    
    if (shouldInitialize && initialContent) {
      try {
        // Parse the JSON content and set the editor state
        const contentJSON = JSON.parse(initialContent);
        const editorState = editor.parseEditorState(contentJSON);
        editor.setEditorState(editorState);
      } catch (error) {
        console.warn('Failed to parse initial content:', error);
        // If parsing fails, treat as plain text
        editor.update(() => {
          const root = $getRoot();
          root.clear();
          const paragraph = $createParagraphNode();
          const textNode = $createTextNode(initialContent);
          paragraph.append(textNode);
          root.append(paragraph);
        });
      }
      
      setHasInitialized(true);
      setCurrentStoryId(storyId);
    } else if (currentStoryId !== storyId) {
      // If switching to a story with no content, clear the editor
      if (!initialContent) {
        editor.update(() => {
          const root = $getRoot();
          root.clear();
        });
      }
      setCurrentStoryId(storyId);
    }
  }, [editor, initialContent, storyId, hasInitialized, currentStoryId]);

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

export default function LexicalEditor({ initialContent = '', onContentChange, storyId }) {
  const [selectionData, setSelectionData] = useState({ hasSelection: false });

  const initialConfig = {
    namespace: 'LexicalEditor',
    theme,
    onError: (error) => {
      console.error('Lexical Error:', error);
    },
  };

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
          <ContentChangePlugin onContentChange={onContentChange} />
          <InitialContentPlugin initialContent={initialContent} storyId={storyId} />
          
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