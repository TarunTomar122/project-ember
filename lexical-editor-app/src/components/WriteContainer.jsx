import React, { useState, useEffect, useCallback, useRef } from 'react';
import LexicalEditor from './LexicalEditor';
import { PlusIcon, DocumentTextIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';

const WriteContainer = () => {
  const [activeStory, setActiveStory] = useState(null);
  const [stories, setStories] = useState([]);
  const [showingHome, setShowingHome] = useState(true);
  const [stableStoryId, setStableStoryId] = useState(null);
  const saveTimeoutRef = useRef(null);

  // Load stories from localStorage
  useEffect(() => {
    const savedStories = localStorage.getItem('user_stories');
    if (savedStories) {
      setStories(JSON.parse(savedStories));
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Save stories to localStorage
  const saveStories = useCallback((storiesData) => {
    localStorage.setItem('user_stories', JSON.stringify(storiesData));
    setStories(storiesData);
  }, []);

  // Create new story
  const createNewStory = () => {
    const newStory = {
      id: Date.now().toString(),
      title: 'Untitled Story',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      wordCount: 0
    };
    
    const updatedStories = [...stories, newStory];
    saveStories(updatedStories);
    setActiveStory(newStory);
    setStableStoryId(newStory.id);
    setShowingHome(false);
  };

  // Open existing story
  const openStory = useCallback((story) => {
    setActiveStory(story);
    setStableStoryId(story.id);
    setShowingHome(false);
  }, []);

  // Back to home
  const goHome = () => {
    setShowingHome(true);
    setActiveStory(null);
    setStableStoryId(null);
  };

  // Update story content with debouncing
  const updateStoryContent = useCallback((content, wordCount) => {
    if (!activeStory) return;

    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Update the active story immediately for UI responsiveness
    const updatedStory = {
      ...activeStory,
      content,
      wordCount,
      updatedAt: new Date().toISOString()
    };
    setActiveStory(updatedStory);

    // Debounce the save operation
    saveTimeoutRef.current = setTimeout(() => {
      setStories(prevStories => {
        const updatedStories = prevStories.map(story => 
          story.id === activeStory.id ? updatedStory : story
        );
        localStorage.setItem('user_stories', JSON.stringify(updatedStories));
        return updatedStories;
      });
    }, 500); // Save after 500ms of inactivity
  }, [activeStory]);

  // Update story title
  const updateStoryTitle = useCallback((title) => {
    if (!activeStory) return;

    const updatedStory = {
      ...activeStory,
      title,
      updatedAt: new Date().toISOString()
    };
    
    setActiveStory(updatedStory);
    
    // Update stories array immediately for title changes
    setStories(prevStories => {
      const updatedStories = prevStories.map(story => 
        story.id === activeStory.id ? updatedStory : story
      );
      localStorage.setItem('user_stories', JSON.stringify(updatedStories));
      return updatedStories;
    });
  }, [activeStory]);

  // Delete story
  const deleteStory = (storyId) => {
    const updatedStories = stories.filter(story => story.id !== storyId);
    saveStories(updatedStories);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate reading time (assuming 200 words per minute)
  const calculateReadingTime = (wordCount) => {
    const minutes = Math.ceil(wordCount / 200);
    return minutes === 1 ? '1 min read' : `${minutes} min read`;
  };

  // Extract plain text from Lexical JSON content
  const getPlainTextFromContent = (content) => {
    if (!content) return 'No content yet';
    
    try {
      const contentObj = JSON.parse(content);
      
      // Extract text from Lexical JSON structure
      const extractText = (node) => {
        if (!node) return '';
        
        if (node.text) {
          return node.text;
        }
        
        if (node.children && Array.isArray(node.children)) {
          return node.children.map(extractText).join('');
        }
        
        return '';
      };
      
      if (contentObj.root && contentObj.root.children) {
        const text = contentObj.root.children.map(extractText).join(' ').trim();
        return text || 'No content yet';
      }
      
      return 'No content yet';
    } catch (error) {
      // If it's not JSON, treat as plain text
      return content || 'No content yet';
    }
  };

  // Story Card Component
  const StoryCard = ({ story }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {story.title}
          </h3>
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-1" />
              {formatDate(story.updatedAt)}
            </div>
            <div className="flex items-center">
              <DocumentTextIcon className="w-4 h-4 mr-1" />
              {story.wordCount} words
            </div>
            <div className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-1" />
              {calculateReadingTime(story.wordCount)}
            </div>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteStory(story.id);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 p-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      
      <div className="text-gray-600 text-sm line-clamp-3 mb-4">
        {getPlainTextFromContent(story.content).substring(0, 200) + (getPlainTextFromContent(story.content).length > 200 ? '...' : '')}
      </div>
      
      <button
        onClick={() => openStory(story)}
        className="w-full text-left text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        Continue writing →
      </button>
    </div>
  );

  if (showingHome) {
    return (
      <div className="flex h-full bg-gray-50">
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {/* Welcome Section with Button */}
            <div className="flex items-start justify-between mb-12">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h1>
                <p className="text-base text-gray-600">What will you write today?</p>
              </div>
              <button
                onClick={createNewStory}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Start new Novel
              </button>
            </div>

            {/* Stories Grid */}
            {stories.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Stories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stories.map(story => (
                    <StoryCard key={story.id} story={story} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No stories yet</h3>
                <p className="text-gray-600">Create your first story to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gray-50">
      <div className="flex-1 flex flex-col">
        {/* Header with back button and title */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={goHome}
                className="mr-4 text-gray-600 hover:text-gray-900"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <input
                type="text"
                value={activeStory?.title || ''}
                onChange={(e) => updateStoryTitle(e.target.value)}
                className="text-xl font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0"
                placeholder="Untitled Story"
              />
            </div>
            <div className="text-sm text-gray-500">
              {activeStory?.wordCount || 0} words
            </div>
          </div>
        </div>

        {/* Writing Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px]">
              <LexicalEditor 
                key={stableStoryId}
                storyId={stableStoryId}
                initialContent={activeStory?.content || ''}
                onContentChange={updateStoryContent}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteContainer; 