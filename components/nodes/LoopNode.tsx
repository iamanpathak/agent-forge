import React from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { Repeat } from 'lucide-react';

export default function LoopNode({ id, data }: any) {
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
      
      {/* Input Handle (Left) - Now Orange */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-4 h-4 bg-white border-4 border-orange-500 rounded-full shadow-sm left-[-8px]"
      />

      {/* Header - Now Orange to Amber Gradient */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 flex items-center justify-between rounded-t-2xl">
        <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
          <Repeat className="w-4 h-4" />
          Loop / Iterator
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4 relative rounded-b-2xl">
        
        {/* Array Input Area */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
            Array to Loop Over
          </label>
          {/* Changed font-semibold to font-normal and added focus:border-orange-500 */}
          <input 
            type="text"
            className="nodrag nopan nowheel text-xs font-normal p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-gray-700 w-full"
            value={data.arraySource || ''}
            onChange={(e) => updateField('arraySource', e.target.value)}
            placeholder="e.g. {{api.users}}"
          />
        </div>

        {/* Loop Variable Assignment Area */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
            Assign item to variable:
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1.5 rounded">
              {"{{"}
            </span>
            {/* Changed font-semibold to font-normal AND fixed the deletion bug by checking undefined. Added focus:border-orange-500 */}
            <input 
              type="text"
              className="nodrag nopan nowheel text-xs font-normal p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-gray-700 w-[50%]"
              value={data.loopVariable || ''}
              onChange={(e) => updateField('loopVariable', e.target.value)}
              placeholder="item"
            />
            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1.5 rounded">
              {"}}"}
            </span>
          </div>
        </div>

        {/* Output Handles Zone (Using your perfected relative wrapper logic) */}
        <div className="mt-2 pt-2 border-t border-gray-50 flex flex-col gap-2">
          
          {/* Next Item Route - Now Orange */}
          <div className="relative min-h-[28px]">
            <span className="absolute right-[-10px] top-1/2 -translate-y-1/2 text-[9px] font-bold text-orange-500 whitespace-nowrap pointer-events-none z-10 uppercase">
              Next Item
            </span>
            <Handle
              type="source"
              position={Position.Right}
              id="nextItem"
              style={{ top: '50%', right: '-24px', transform: 'translate(50%, -50%)' }}
              className="w-4 h-4 bg-white border-4 border-orange-500 rounded-full shadow-sm"
            />
          </div>

          {/* Completed Route (Remains Gray) */}
          <div className="relative min-h-[28px] mt-1">
            <span className="absolute right-[-10px] top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-400 whitespace-nowrap pointer-events-none z-10 uppercase">
              Completed
            </span>
            <Handle
              type="source"
              position={Position.Right}
              id="completed"
              style={{ top: '50%', right: '-24px', transform: 'translate(50%, -50%)' }}
              className="w-4 h-4 bg-white border-4 border-gray-400 rounded-full shadow-sm"
            />
          </div>

        </div>

      </div>
    </div>
  );
}