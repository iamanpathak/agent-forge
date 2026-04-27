import React from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { ShieldAlert } from 'lucide-react';

export default function AISecurityNode({ id, data }: any) {
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
      
      {/* Input Handle (Left) - Changed to Purple */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-4 h-4 bg-white border-4 border-purple-500 rounded-full shadow-sm left-[-8px]"
      />

      {/* Header - Changed to match AI & Extraction Category (Purple to Fuchsia) */}
      <div className="bg-gradient-to-r from-purple-500 to-fuchsia-500 px-4 py-3 flex items-center justify-between rounded-t-2xl">
        <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
          <ShieldAlert className="w-4 h-4" />
          AI Security Gateway
        </div>
        <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] text-white font-semibold uppercase tracking-wider border border-white/10">
          Guard
        </span>
      </div>

      <div className="p-5 flex flex-col gap-4 relative rounded-b-2xl">
        
        {/* Input Data Source */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
            Data to Inspect
          </label>
          <input 
            type="text"
            className="nodrag nopan nowheel text-xs font-normal p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none text-gray-700 w-full transition-colors"
            value={data.inputData || ''}
            onChange={(e) => updateField('inputData', e.target.value)}
            placeholder="e.g. {{trigger.message}}"
          />
        </div>

        {/* Security Policy Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
            Active Security Policy
          </label>
          <select 
            className="nodrag nopan nowheel text-xs font-normal p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none cursor-pointer text-gray-700 transition-colors"
            value={data.policy || 'detect_injection'}
            onChange={(e) => updateField('policy', e.target.value)}
          >
            <option value="detect_injection">Block Prompt Injection</option>
            <option value="redact_pii">Redact PII (Masking)</option>
            <option value="filter_toxicity">Filter Profanity & Toxicity</option>
          </select>
        </div>

        <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
          Sanitizes and validates data before it reaches your LLM models.
        </p>

        {/* Output Handles */}
        <div className="mt-2 pt-2 border-t border-gray-50 flex flex-col gap-2">
          
          {/* Safe/Clean Route - Changed to Emerald (Green means Go) */}
          <div className="relative min-h-[28px]">
            <span className="absolute right-[-10px] top-1/2 -translate-y-1/2 text-[9px] font-bold text-emerald-500 whitespace-nowrap pointer-events-none z-10 uppercase">
              Safe / Clean
            </span>
            <Handle
              type="source"
              position={Position.Right}
              id="safe"
              style={{ top: '50%', right: '-24px', transform: 'translate(50%, -50%)' }}
              className="w-4 h-4 bg-white border-4 border-emerald-500 rounded-full shadow-sm"
            />
          </div>

          {/* Flagged Route - Kept Rose/Red (Red means Blocked/Warning) */}
          <div className="relative min-h-[28px] mt-1">
            <span className="absolute right-[-10px] top-1/2 -translate-y-1/2 text-[9px] font-bold text-rose-500 whitespace-nowrap pointer-events-none z-10 uppercase">
              Flagged
            </span>
            <Handle
              type="source"
              position={Position.Right}
              id="flagged"
              style={{ top: '50%', right: '-24px', transform: 'translate(50%, -50%)' }}
              className="w-4 h-4 bg-white border-4 border-rose-500 rounded-full shadow-sm"
            />
          </div>

        </div>

      </div>
    </div>
  );
}