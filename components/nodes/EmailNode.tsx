import React from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { Mail, Send } from 'lucide-react';

export default function EmailNode({ id, data }: any) {
  const { setNodes } = useReactFlow();

  const updateField = (field: string, value: string) => {
    setNodes((nds) =>
      nds.map((node) => node.id === id ? { ...node, data: { ...node.data, [field]: value } } : node)
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 overflow-hidden w-80 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      
      <Handle type="target" position={Position.Left} className="w-4 h-4 bg-white border-4 border-emerald-500 rounded-full shadow-sm left-[-8px]" />
      
      {/* Actions Category: Emerald Gradient */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
          <Mail className="w-4 h-4" /> 
          Send Email
        </div>
        <Send className="w-3.5 h-3.5 text-white/80" />
      </div>

      <div className="p-5 flex flex-col gap-3">
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">To (Recipient)</label>
          {/* Added font-normal for absolute consistency */}
          <input 
            type="email"
            className="nodrag nopan nowheel text-sm font-normal p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-50 w-full outline-none text-gray-700 transition-colors"
            value={data.to || ''}
            onChange={(e) => updateField('to', e.target.value)}
            placeholder="user@example.com"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Subject</label>
          {/* Added font-normal for absolute consistency */}
          <input 
            type="text"
            className="nodrag nopan nowheel text-sm font-normal p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-50 w-full outline-none text-gray-700 transition-colors"
            value={data.subject || ''}
            onChange={(e) => updateField('subject', e.target.value)}
            placeholder="Agent Alert: Action Required"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
             <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Message Body</label>
             <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
               Vars: {'{{llm}}'}
             </span>
          </div>
          {/* Removed font-mono and added font-normal to make it match the rest of the UI */}
          <textarea 
            className="nodrag nopan nowheel text-sm font-normal p-3 border border-gray-200 rounded-lg h-20 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-50 text-gray-700 transition-colors"
            value={data.body || ''}
            onChange={(e) => updateField('body', e.target.value)}
            placeholder="Here is your result: {{llm}}"
          />
        </div>

      </div>

      <Handle type="source" position={Position.Right} className="w-4 h-4 bg-white border-4 border-emerald-500 rounded-full shadow-sm right-[-8px]" />
    </div>
  );
}