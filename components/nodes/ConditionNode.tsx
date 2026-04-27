import React from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { Split } from 'lucide-react';

export default function ConditionNode({ id, data }: any) {
  const { setNodes } = useReactFlow();

  // Updates the condition field in the node data
  const updateCondition = (value: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, condition: value } };
        }
        return node;
      })
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 w-72 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative">
      
      {/* Input Handle (LEFT) */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-4 h-4 bg-white border-4 border-emerald-500 rounded-full shadow-sm left-[-8px]" 
      />
      
      {/* Node Header - FIXED: Swapped gradient to from-orange-500 to-amber-500 to match the Logic category */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 flex items-center justify-between rounded-t-2xl">
        <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
          <Split className="w-4 h-4" /> 
          If / Else Condition
        </div>
      </div>

      <div className="p-5 flex flex-col gap-3 relative rounded-b-2xl">
        <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
          If text contains:
        </label>

        {/* FIXED: Changed focus rings from amber to orange-500 to perfectly match Delay and Loop nodes */}
        <input 
          type="text"
          className="nodrag nopan nowheel text-sm font-normal p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-gray-50 w-[75%] outline-none text-gray-700 transition-colors"
          value={data.condition || ''}
          onChange={(e) => updateCondition(e.target.value)}
          placeholder="e.g. error, success"
        />

        <p className="text-[10px] text-gray-400 mt-1">
          Routes execution based on match.
        </p>

        {/* TRUE Output */}
        <span className="absolute right-3 top-[35%] -translate-y-1/2 text-[9px] font-bold text-green-500 uppercase whitespace-nowrap pointer-events-none z-10">
          True
        </span>
        <Handle 
          type="source" 
          position={Position.Right} 
          id="true"
          style={{ top: '35%' }}
          className="w-4 h-4 bg-white border-4 border-emerald-500 rounded-full shadow-sm right-[-8px]" 
        />

        {/* FALSE Output */}
        <span className="absolute right-3 top-[75%] -translate-y-1/2 text-[9px] font-bold text-red-500 uppercase whitespace-nowrap pointer-events-none z-10">
          False
        </span>
        <Handle 
          type="source" 
          position={Position.Right} 
          id="false"
          style={{ top: '75%' }}
          className="w-4 h-4 bg-white border-4 border-emerald-500 rounded-full shadow-sm right-[-8px]" 
        />
      </div>
    </div>
  );
}