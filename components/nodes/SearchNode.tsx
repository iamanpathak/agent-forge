import React from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { Search } from 'lucide-react';

export default function SearchNode({ id, data }: any) {
  const { setNodes } = useReactFlow();

  // Dynamically updates the search query field in the React Flow state
  const updateField = (field: string, value: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, [field]: value } };
        }
        return node;
      })
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 overflow-hidden w-80 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      
      {/* Input Connection Handle - Updated to Purple */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-4 h-4 bg-white border-4 border-purple-500 rounded-full shadow-sm left-[-8px]" 
      />
      
      {/* Node Header - Updated to match the AI & Extraction category color */}
      <div className="bg-gradient-to-r from-purple-500 to-fuchsia-500 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
          <Search className="w-4 h-4" /> 
          Live Web Search
        </div>
        <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] text-white font-semibold uppercase tracking-wider border border-white/10">
          Tavily
        </span>
      </div>

      {/* Node Body & Inputs */}
      <div className="p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
             <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Search Query</label>
             {/* Variable Pill - Updated to Purple */}
             <span className="text-[8px] text-purple-600 font-bold bg-purple-50 border border-purple-100 px-1.5 py-0.5 rounded">
               Vars: {'{{trigger}}'}
             </span>
          </div>
          
          <textarea 
            className="nodrag nopan nowheel text-sm font-normal p-3 border border-gray-200 rounded-lg h-20 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-gray-50 text-gray-700 transition-colors placeholder-gray-400"
            value={data.query || ''}
            onChange={(e) => updateField('query', e.target.value)}
            placeholder="e.g. Latest news about Next.js 16..."
          />
        </div>
        <p className="text-[11px] text-gray-400 leading-relaxed">
          Searches the live internet and returns a consolidated summary of the best results.
        </p>
      </div>

      {/* Output Connection Handle - Updated to Purple */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-4 h-4 bg-white border-4 border-purple-500 rounded-full shadow-sm right-[-8px]" 
      />
    </div>
  );
}