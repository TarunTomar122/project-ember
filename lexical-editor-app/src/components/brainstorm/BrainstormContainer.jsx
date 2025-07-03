import React, { useState } from 'react';
import { 
  ArrowPathIcon,
  HeartIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const BrainstormContainer = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [storyIdeas] = useState([
    {
      id: 1,
      title: 'Fizz and Glimma, two rival magicians with clashing magic styles, must join forces to find the "Heartmallow" — a mythical core deep within Marshmallow Land that\'s melting, throwing the entire world off balance.',
      description: 'As they journey through gooey forests, toasted ridges, and rivers of cocoa, they discover each other\'s vulnerabilities beneath their spellcraft. By the time they reach the Heartmallow, they\'ve fallen in love — and only a love-infused spell can restore the land.'
    },
    {
      id: 2,
      title: 'Glimma is a fading illusionist who no longer believes in joy. Fizz is new to the land, still full of wonder. When a creeping wave of bitterness (a literal magical corruption) begins turning the marshmallow terrain into brittle, flavorless voids, the two uncover that the only way to stop it is by rekindling true emotional warmth — which has long disappeared from the land.',
      description: 'As their bond deepens, they realize Glimma\'s heart is the source of the decay — scarred by loss — and only Fizz\'s love can reignite it. But doing so means Fizz may lose their own magic. As they journey through gooey forests, toasted ridges, and rivers of cocoa, they discover each other\'s vulnerabilities beneath their spellcraft. By the time they reach the Heartmallow, they\'ve fallen in love — and only a love-infused spell can restore the land.'
    },
    {
      id: 3,
      title: 'Fizz and Glimma are accidentally magically bound to each other after a spell misfires at the Marshmallow Mixer — a social event for magicians. Now, whenever one casts a spell, the other sneezes sugar or floats three feet in the air.',
      description: 'Forced to cooperate to undo the bond, they try to outdo each other with increasingly ridiculous spell-duels and sabotage. But as antics escalate, they start falling — genuinely — for each other. In the end, they can break the bond... but they don\'t want to anymore.'
    }
  ]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      // In a real implementation, this would generate new story ideas
    }, 2000);
  };

  const handleAddToBible = (idea) => {
    // In a real implementation, this would add the idea to the story bible
    console.log('Adding to bible:', idea);
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Left Sidebar for Chats */}
      <div className="w-80 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your chats</h2>
        </div>
        <div className="p-4">
          <div className="text-sm text-gray-600">
            Start a new brainstorm session or continue previous conversations.
          </div>
        </div>
      </div>

      {/* Main Content - Always show brainstorm interface */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex-1">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 mb-2">
              <SparklesIcon className="w-4 h-4 mr-1" />
              Brainstorm
            </div>
            <p className="text-gray-600">
              I want to write a story about 2 magicians in a marshmallow land who fall in love.
            </p>
          </div>
        </div>

        {/* Story Ideas */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              That's a sweet and whimsical premise — magicians in a marshmallow land falling in love! Here's are 3 idea scaffolds you can build on, along with a few tonal options. Pick one to move ahead!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {storyIdeas.map((idea) => (
              <div key={idea.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="mb-4">
                  <p className="text-gray-900 font-medium leading-relaxed">
                    {idea.title}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {idea.description}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <ArrowPathIcon className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <HeartIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleAddToBible(idea)}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Add to bible
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-gray-600 mb-8">
            <p>Once you select an option, I can give you ideas for who these characters are!</p>
          </div>
        </div>

        {/* Prompt Input */}
        <div className="p-6 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <div className="mb-2">
              <label className="text-sm font-medium text-gray-700">Prompt</label>
            </div>
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="I want to write a story about 2 magicians in a marshmallow land who fall in love."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  isGenerating || !prompt.trim()
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isGenerating ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Generating...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <SparklesIcon className="w-4 h-4 mr-2" />
                    Generate
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrainstormContainer; 