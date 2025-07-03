import React from 'react';
import LexicalEditor from './LexicalEditor';

const WriteContainer = () => {
  return (
    <div className="flex h-full bg-gray-50">
      {/* Main Content Area - Always show writing canvas */}
      <div className="flex-1 flex flex-col">
        {/* Writing Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px]">
              <LexicalEditor />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteContainer; 