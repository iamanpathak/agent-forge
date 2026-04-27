import React from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { Globe } from 'lucide-react';

export default function APINode({ id, data }: any) {
  const { setNodes } = useReactFlow();

  // Dynamically update field values (method, url, or body)
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

  // Determine if we need to show the Request Body input
  const currentMethod = data.method || 'GET';
  const requiresBody = currentMethod === 'POST' || currentMethod === 'PUT';

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 overflow-hidden w-80 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-4 h-4 bg-white border-4 border-emerald-500 rounded-full shadow-sm left-[-8px]" 
      />
      
      {/* Header mapped to the 'Actions' category in Sidebar */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
          <Globe className="w-4 h-4" /> 
          API Request
        </div>
      </div>

      {/* Input Fields */}
      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          {/* Method Dropdown: thin and standard, added focus:border-emerald-500 */}
          <select 
            className="nodrag nopan nowheel text-xs font-normal p-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none w-24 cursor-pointer text-gray-700"
            value={currentMethod}
            onChange={(e) => updateField('method', e.target.value)}
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
          </select>
          
          {/* URL Input: thin and standard, added focus:border-emerald-500 */}
          <input 
            type="text"
            className="nodrag nopan nowheel text-sm font-normal p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-50 w-full outline-none text-gray-700"
            value={data.url || ''}
            onChange={(e) => updateField('url', e.target.value)}
            placeholder="https://api.example.com"
          />
        </div>

        {/* SMART UX: Only show Request Body if POST or PUT is selected */}
        {requiresBody && (
          <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
               <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Request Body (JSON)</label>
            </div>
            <textarea 
              // font-mono keeps the code alignment, font-normal keeps the text thin, added focus:border-emerald-500
              className="nodrag nopan nowheel text-[11px] font-normal font-mono p-3 border border-gray-800 rounded-lg h-24 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-900 text-green-400 leading-relaxed"
              value={data.body !== undefined ? data.body : '{\n  "key": "value"\n}'}
              onChange={(e) => updateField('body', e.target.value)}
              // Prevent React Flow from stealing backspace/delete keys while typing JSON
              onKeyDown={(e) => e.stopPropagation()}
              spellCheck="false"
            />
          </div>
        )}
      </div>

      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-4 h-4 bg-white border-4 border-emerald-500 rounded-full shadow-sm right-[-8px]" 
      />
    </div>
  );
}