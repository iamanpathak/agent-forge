import React from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { Shuffle } from 'lucide-react';

export default function RouterNode({ id, data }: any) {
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
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-4 h-4 bg-white border-4 border-orange-500 rounded-full shadow-sm left-[-8px]"
      />

      {/* Header - FIXED: Removed red, matched to the from-orange-500 to-amber-500 Logic theme */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 flex items-center justify-between rounded-t-2xl">
        <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
          <Shuffle className="w-4 h-4" />
          Router / Switch
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4 relative rounded-b-2xl">
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
          Route execution if text contains:
        </p>

        {/* Route A */}
        <div className="flex items-center gap-2 relative">
          <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1.5 rounded">
            A
          </span>
          {/* FIXED: Added focus:border-orange-500 to match rim color */}
          <input
            type="text"
            className="nodrag nopan nowheel text-xs font-normal p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 w-[70%] outline-none text-gray-700"
            value={data.routeA || ''}
            onChange={(e) => updateField('routeA', e.target.value)}
            placeholder="e.g. 'urgent'"
          />

          <span className="absolute right-[-10px] top-1/2 -translate-y-1/2 text-[9px] font-bold text-orange-500 whitespace-nowrap pointer-events-none z-10">
            Route A
          </span>

          <Handle
            type="source"
            position={Position.Right}
            id="routeA"
            style={{ top: '50%', right: '-24px', transform: 'translate(50%, -50%)' }}
            className="w-4 h-4 bg-white border-4 border-orange-500 rounded-full shadow-sm"
          />
        </div>

        {/* Route B */}
        <div className="flex items-center gap-2 relative mt-2">
          <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1.5 rounded">
            B
          </span>
          {/* FIXED: Added focus:border-orange-500 to match rim color */}
          <input
            type="text"
            className="nodrag nopan nowheel text-xs font-normal p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 w-[70%] outline-none text-gray-700"
            value={data.routeB || ''}
            onChange={(e) => updateField('routeB', e.target.value)}
            placeholder="e.g. 'invoice'"
          />

          <span className="absolute right-[-10px] top-1/2 -translate-y-1/2 text-[9px] font-bold text-orange-500 whitespace-nowrap pointer-events-none z-10">
            Route B
          </span>

          <Handle
            type="source"
            position={Position.Right}
            id="routeB"
            style={{ top: '50%', right: '-24px', transform: 'translate(50%, -50%)' }}
            className="w-4 h-4 bg-white border-4 border-orange-500 rounded-full shadow-sm"
          />
        </div>

        {/* Default / Fallback Route */}
        <div className="mt-4 pt-3 border-t border-gray-100 relative min-h-[28px]">
          <span className="text-[9px] font-bold text-gray-400 uppercase">
            Default (If no match)
          </span>

          <span className="absolute right-[-10px] top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-500 whitespace-nowrap pointer-events-none z-10">
            Fallback
          </span>

          <Handle
            type="source"
            position={Position.Right}
            id="default"
            style={{ top: '50%', right: '-24px', transform: 'translate(50%, -50%)' }}
            className="w-4 h-4 bg-white border-4 border-gray-400 rounded-full shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}