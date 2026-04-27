import React from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { Search } from 'lucide-react';

export default function ScraperNode({ id, data }: any) {
  const { setNodes } = useReactFlow();

  const updateField = (field: string, value: string) => {
    setNodes((nds) =>
      nds.map((node) => node.id === id ? { ...node, data: { ...node.data, [field]: value } } : node)
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 overflow-hidden w-80 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      
      <Handle type="target" position={Position.Left} className="w-4 h-4 bg-white border-4 border-purple-500 rounded-full shadow-sm left-[-8px]" />
      
      {/* AI & Extraction Category: Purple Gradient */}
      <div className="bg-gradient-to-r from-purple-500 to-fuchsia-500 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
          <Search className="w-4 h-4" /> 
          Web Scraper
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Target URL</label>
          {/* Removed font-mono and added font-normal for standard uniform text */}
          <input 
            type="text"
            className="nodrag nopan nowheel text-sm font-normal p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-gray-50 w-full outline-none text-gray-700 transition-colors"
            value={data.url || ''}
            onChange={(e) => updateField('url', e.target.value)}
            placeholder="https://wikipedia.org/..."
          />
        </div>
        <p className="text-[11px] text-gray-400 leading-relaxed">
          Extracts visible text from the provided webpage URL.
        </p>
      </div>

      <Handle type="source" position={Position.Right} className="w-4 h-4 bg-white border-4 border-purple-500 rounded-full shadow-sm right-[-8px]" />
    </div>
  );
}