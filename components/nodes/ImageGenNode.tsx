import React from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { ImageIcon } from 'lucide-react';

export default function ImageGenNode({ id, data }: any) {
  const { setNodes } = useReactFlow();

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 overflow-hidden w-80 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      <Handle type="target" position={Position.Left} className="w-4 h-4 bg-white border-4 border-purple-500 rounded-full shadow-sm left-[-8px]" />
      
      {/* PERFECT MATCH: Document Parser Color (Purple to Fuchsia) */}
      <div className="bg-gradient-to-r from-purple-500 to-fuchsia-500 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
          <ImageIcon className="w-4 h-4" /> AI Image Generator
        </div>
      </div>
      
      <div className="p-5 flex flex-col gap-3">
        <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Image Prompt</label>
        {/* Added focus:border-purple-500 to match the dark inner rim styling */}
        <textarea 
          className="nodrag nopan nowheel text-xs p-2.5 border border-gray-200 rounded-lg bg-gray-50 h-24 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none text-gray-700" 
          value={data.imagePrompt || ''} 
          onChange={(e) => setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, imagePrompt: e.target.value } } : n))}
          placeholder="Describe the image... e.g. {{scraper}} in cyberpunk style" 
        />
      </div>
      <Handle type="source" position={Position.Right} className="w-4 h-4 bg-white border-4 border-purple-500 rounded-full shadow-sm right-[-8px]" />
    </div>
  );
}