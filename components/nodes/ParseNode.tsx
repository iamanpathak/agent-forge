import React from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { FileText } from 'lucide-react';

export default function ParseNode({ id, data }: any) {
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
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 w-80 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative">
      
      {/* Input Handle (Left) */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-4 h-4 bg-white border-4 border-purple-500 rounded-full shadow-sm left-[-8px]"
      />

      {/* Header: Purple Gradient */}
      <div className="bg-gradient-to-r from-purple-500 to-fuchsia-500 px-4 py-3 flex items-center justify-between rounded-t-2xl">
        <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
          <FileText className="w-4 h-4" />
          Document Parser
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4 relative rounded-b-2xl">
        
        {/* Source Data Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
            Data to Parse
          </label>
          {/* Changed font-semibold to font-normal and added focus:border-purple-500 */}
          <input 
            type="text"
            className="nodrag nopan nowheel text-xs font-normal p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none text-gray-700 w-full"
            value={data.documentData || ''}
            onChange={(e) => updateField('documentData', e.target.value)}
            placeholder="e.g. {{scraper}} or {{trigger}}"
          />
        </div>

        {/* Extraction Goal Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
            Extraction Goal
          </label>
          {/* Changed font-semibold to font-normal and added focus:border-purple-500 */}
          <textarea 
            className="nodrag nopan nowheel text-xs font-normal p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none text-gray-700 w-full resize-none"
            rows={3}
            value={data.extractionGoal || ''}
            onChange={(e) => updateField('extractionGoal', e.target.value)}
            placeholder="e.g. 'Extract all names and email addresses as JSON'"
          />
        </div>

        {/* Output Handle Zone */}
        <div className="mt-2 pt-2 border-t border-gray-50">
          <div className="relative min-h-[28px]">
            <span className="absolute right-[-10px] top-1/2 -translate-y-1/2 text-[9px] font-bold text-purple-500 whitespace-nowrap pointer-events-none z-10 uppercase">
              Parsed Data
            </span>
            <Handle
              type="source"
              position={Position.Right}
              id="parsed"
              style={{ top: '50%', right: '-24px', transform: 'translate(50%, -50%)' }}
              className="w-4 h-4 bg-white border-4 border-purple-500 rounded-full shadow-sm"
            />
          </div>
        </div>

      </div>
    </div>
  );
}