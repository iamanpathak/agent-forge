import React from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { SendToBack } from 'lucide-react';

export default function ResponseNode({ id, data }: any) {
  const { setNodes } = useReactFlow();

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
      
      {/* Input Handle */}
      <Handle 
        type="target" position={Position.Left} 
        className="w-4 h-4 bg-white border-4 border-emerald-500 rounded-full shadow-sm left-[-8px]" 
      />
      
      {/* Action Category: Emerald Gradient */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
          <SendToBack className="w-4 h-4" /> 
          HTTP Response
        </div>
        <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] text-white font-semibold uppercase tracking-wider border border-white/10">
          End
        </span>
      </div>

      <div className="p-5 flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Status Code</label>
          
          {/* Dropdown for HTTP Status Codes - Already using font-normal */}
          <select 
            className="nodrag nopan nowheel text-sm font-normal p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-50 w-full outline-none text-gray-700 transition-colors cursor-pointer"
            value={data.statusCode || '200'}
            onChange={(e) => updateField('statusCode', e.target.value)}
          >
            <option value="200">200 - OK (Success)</option>
            <option value="201">201 - Created</option>
            <option value="400">400 - Bad Request</option>
            <option value="500">500 - Server Error</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
           <div className="flex items-center justify-between">
             <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Response Body (JSON)</label>
             
             {/* Available variables hint badge including the new parser variable */}
             <span className="text-[8px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
               Vars: {'{{trigger}}, {{scraper}}, {{llm}}, {{api}}, {{parser}}, {{db}}'}
             </span>
          </div>
          {/* Added font-normal explicitly to ensure the mono font doesn't render too thick */}
          <textarea 
            className="nodrag nopan nowheel text-[11px] font-normal p-3 border border-gray-200 rounded-lg h-24 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-900 text-green-400 font-mono transition-colors"
            value={data.responseBody !== undefined ? data.responseBody : '{\n  "status": "success",\n  "data": "{{scraper}}"\n}'}
            onChange={(e) => updateField('responseBody', e.target.value)}
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
}