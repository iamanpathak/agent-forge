import React from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { Hourglass } from 'lucide-react';

export default function DelayNode({ id, data }: any) {
  const { setNodes } = useReactFlow();

  const updateField = (field: string, value: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, [field]: value } };
        }
        return node;
      })
    );
  };

  // Handler to gracefully manage empty strings and prevent negative numbers or zero
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    if (val === '') {
      // Allow empty string so the user can clear the input
      updateField('amount', '');
    } else {
      const parsed = parseInt(val, 10);
      // If it's a valid number, force it to be at least 1 (No time travel allowed!)
      if (!isNaN(parsed)) {
        updateField('amount', Math.max(1, parsed));
      }
    }
  };

  return (
    // Reverted completely to your original container and styling
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 overflow-hidden w-72 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      
      {/* Original Left Handle - Untouched */}
      <Handle 
        type="target" position={Position.Left} 
        className="w-4 h-4 bg-white border-4 border-orange-500 rounded-full shadow-sm left-[-8px]" 
      />
      
      {/* Logic Category: Orange Gradient */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
          <Hourglass className="w-4 h-4" /> 
          Delay / Sleep
        </div>
      </div>

      <div className="p-5 flex flex-col gap-3">
        <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Pause Execution For</label>
        <div className="flex items-center gap-2">
          {/* Changed font-bold to font-normal */}
          <input 
            type="number"
            min="1"
            className="nodrag nopan text-sm font-normal p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-gray-50 w-20 outline-none text-gray-700 transition-colors text-center"
            value={data.amount !== undefined ? data.amount : 1}
            onChange={handleAmountChange}
          />
          {/* Changed font-semibold to font-normal */}
          <select 
            className="nodrag nopan nowheel text-sm font-normal p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-gray-50 w-full outline-none text-gray-700 transition-colors cursor-pointer"
            value={data.unit || 'Seconds'}
            onChange={(e) => updateField('unit', e.target.value)}
          >
            <option>Seconds</option>
            <option>Minutes</option>
            <option>Hours</option>
          </select>
        </div>
      </div>

      {/* Original Right Handle - Untouched */}
      <Handle 
        type="source" position={Position.Right} 
        className="w-4 h-4 bg-white border-4 border-orange-500 rounded-full shadow-sm right-[-8px]" 
      />
    </div>
  );
}