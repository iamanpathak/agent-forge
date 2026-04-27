import React from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { Code2 } from 'lucide-react';

export default function CodeNode({ id, data }: any) {
  const { setNodes } = useReactFlow();

  const updateCode = (newCode: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, code: newCode } };
        }
        return node;
      })
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 overflow-hidden w-80 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      
      {/* Left Input Handle - Updated to border-emerald-500 */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-4 h-4 bg-white border-4 border-emerald-500 rounded-full shadow-sm left-[-8px]" 
      />
      
      {/* Action Category Gradient - Updated to from-emerald-500 to-teal-500 */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
          <Code2 className="w-4 h-4" /> 
          Custom Code (JS)
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
           <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">JavaScript</label>
           <span className="text-[9px] text-gray-400 font-medium">Input variable: data</span>
        </div>
        
        {/* Dark Mode Code Editor Area - Added focus:border-emerald-500 */}
        <textarea 
          className="nodrag nowheel nopan text-[11px] font-normal font-mono p-3 border border-gray-800 rounded-lg h-32 w-full resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-900 text-green-400 leading-relaxed"
          value={data.code !== undefined ? data.code : 'return data;'}
          onChange={(e) => updateCode(e.target.value)}
          // CRITICAL FIX: Stops React Flow from stealing keyboard shortcuts like Ctrl+A or Backspace
          onKeyDown={(e) => e.stopPropagation()}
          spellCheck="false"
        />
      </div>

      {/* Right Output Handle - Updated to border-emerald-500 */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-4 h-4 bg-white border-4 border-emerald-500 rounded-full shadow-sm right-[-8px]" 
      />
    </div>
  );
}