import React from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { Database } from 'lucide-react';

export default function ReadDbNode({ id, data }: any) {
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
        className="w-4 h-4 bg-white border-4 border-slate-500 rounded-full shadow-sm left-[-8px]"
      />

      {/* Header: Slate Gradient updated to match DBNode exactly */}
      <div className="bg-gradient-to-r from-slate-600 to-slate-800 px-4 py-3 flex items-center justify-between rounded-t-2xl">
        <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
          <Database className="w-4 h-4" />
          Read Record
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4 relative rounded-b-2xl">
        
        {/* Table/Collection Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
            Table / Collection
          </label>
          {/* Changed font-semibold to font-normal and added focus:border-slate-500 */}
          <input 
            type="text"
            className="nodrag nopan nowheel text-xs font-normal p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none text-gray-700 w-full"
            value={data.collection || ''}
            onChange={(e) => updateField('collection', e.target.value)}
            placeholder="e.g. 'users' or 'invoices'"
          />
        </div>

        {/* Search Query Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
            Search Query / ID
          </label>
          {/* Changed font-semibold to font-normal and added focus:border-slate-500 */}
          <input 
            type="text"
            className="nodrag nopan nowheel text-xs font-normal p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none text-gray-700 w-full"
            value={data.query || ''}
            onChange={(e) => updateField('query', e.target.value)}
            placeholder="e.g. 'id: 123' or 'email: test@test.com'"
          />
        </div>

        {/* Output Handle Zone */}
        <div className="mt-2 pt-2 border-t border-gray-50">
          <div className="relative min-h-[28px]">
            <span className="absolute right-[-10px] top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-500 whitespace-nowrap pointer-events-none z-10 uppercase">
              Record Data
            </span>
            <Handle
              type="source"
              position={Position.Right}
              id="record"
              style={{ top: '50%', right: '-24px', transform: 'translate(50%, -50%)' }}
              className="w-4 h-4 bg-white border-4 border-slate-500 rounded-full shadow-sm"
            />
          </div>
        </div>

      </div>
    </div>
  );
}