import React from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { Database } from 'lucide-react';

export default function DBNode({ id, data }: any) {
  const { setNodes } = useReactFlow();

  // Update DB operation or collection name dynamically
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
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 overflow-hidden w-72 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-4 h-4 bg-white border-4 border-slate-500 rounded-full shadow-sm left-[-8px]" 
      />
      
      <div className="bg-gradient-to-r from-slate-600 to-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
          <Database className="w-4 h-4" /> 
          Insert Record
        </div>
      </div>

      <div className="p-5 flex flex-col gap-3">
         {/* Changed font-semibold to font-normal and added focus:border-slate-500 for the dark inner rim */}
         <select 
            className="nodrag nopan nowheel text-sm font-normal p-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none cursor-pointer text-gray-700"
            value={data.operation || 'Insert Record'}
            onChange={(e) => updateField('operation', e.target.value)}
          >
            <option>Insert Record</option>
            <option>Update Record</option>
          </select>
          
          {/* Explicitly added font-normal to ensure thin, clean text and focus:border-slate-500 for the rim */}
          <input 
            type="text"
            className="nodrag nopan nowheel text-sm font-normal p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 bg-gray-50 w-full outline-none text-gray-700"
            value={data.collection || ''}
            onChange={(e) => updateField('collection', e.target.value)}
            placeholder="Table / Collection Name"
          />
      </div>

      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-4 h-4 bg-white border-4 border-slate-500 rounded-full shadow-sm right-[-8px]" 
      />
    </div>
  );
}