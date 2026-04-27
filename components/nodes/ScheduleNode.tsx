import React from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { Clock } from 'lucide-react';

export default function ScheduleNode({ id, data }: any) {
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
      
      {/* Trigger Category: Blue Gradient (Matching Webhook) */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
          <Clock className="w-4 h-4 fill-white/20" />
          Schedule Trigger
        </div>
        <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] text-white font-semibold uppercase tracking-wider border border-white/10">
          Start
        </span>
      </div>

      <div className="p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Run Frequency</label>
          {/* Changed font-bold to font-normal for a cleaner look */}
          <select 
            className="nodrag nopan nowheel text-sm font-normal p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 w-full outline-none text-gray-700 transition-colors cursor-pointer"
            value={data.frequency || 'every_hour'}
            onChange={(e) => updateField('frequency', e.target.value)}
          >
            <option value="every_minute">Every Minute</option>
            <option value="every_hour">Every Hour</option>
            <option value="every_day">Every Day at Midnight</option>
            <option value="every_week">Every Monday</option>
          </select>
        </div>
        
        <p className="text-[11px] text-gray-400 leading-relaxed">
          The Agent will automatically execute on this recurring schedule.
        </p>
      </div>

      {/* Only a Right Handle because this is a Trigger (Start) node */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-4 h-4 bg-white border-4 border-blue-500 rounded-full shadow-sm right-[-8px]" 
      />
    </div>
  );
}