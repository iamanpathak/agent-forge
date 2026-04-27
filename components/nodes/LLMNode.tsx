import React from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { Brain, Settings2 } from 'lucide-react';

export default function LLMNode({ id, data }: any) {
  const { setNodes } = useReactFlow();

  // Function to dynamically update the prompt state in the canvas
  const updatePrompt = (newPrompt: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, prompt: newPrompt } };
        }
        return node;
      })
    );
  };

  return (
    // Deep soft shadow, crisp thin borders (Reverted to the premium look)
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 overflow-hidden w-[320px] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      
      {/* Input Handle: Clean white center with matching category border */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-4 h-4 bg-white border-4 border-purple-500 rounded-full shadow-sm left-[-8px]" 
      />

      {/* Premium Gradient Header matching the AI & Extraction category color */}
      <div className="bg-gradient-to-r from-purple-500 to-fuchsia-500 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
          <Brain className="w-4 h-4" />
          AI Model (LLM)
        </div>
        <div className="p-1 bg-white/10 rounded hover:bg-white/20 transition-colors cursor-pointer">
           <Settings2 className="w-3.5 h-3.5 text-white" />
        </div>
      </div>

      {/* Highly readable Body Form - Kept Compact! */}
      <div className="p-4 flex flex-col gap-4">
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Model Selection</label>
          {/* Changed font-medium to font-normal for standard text weight */}
          <select className="nodrag nopan nowheel text-sm font-normal p-2.5 border border-gray-200 rounded-lg text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all cursor-pointer">
            <option>Llama 3.1 (8B)</option>
            <option>GPT-4 (OpenAI)</option>
            <option>Claude 3.5 Sonnet</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
             <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">System Prompt</label>
             {/* Updated Variable Hint to show all available memory tags */}
             <span className="text-[8px] text-purple-600 font-bold bg-purple-50 border border-purple-100 px-1.5 py-0.5 rounded">
               Vars: {'{{trigger}}, {{scraper}}, {{api}}, {{parser}}, {{db}}'}
             </span>
          </div>
          {/* Removed font-mono and kept font-normal to ensure it matches the clean, thin standard UI font */}
          <textarea 
            className="nodrag nopan nowheel text-sm font-normal p-3 border border-gray-200 rounded-lg h-24 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-gray-700 bg-gray-50 placeholder-gray-400 leading-relaxed"
            placeholder="Type your instructions..."
            value={data.prompt || ''}
            onChange={(e) => updatePrompt(e.target.value)}
          />
        </div>

      </div>

      {/* Output Handle */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-4 h-4 bg-white border-4 border-purple-500 rounded-full shadow-sm right-[-8px]" 
      />
    </div>
  );
}