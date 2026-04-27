import React from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { FileSpreadsheet } from 'lucide-react';

export default function GoogleSheetsNode({ id, data }: any) {
  const { setNodes } = useReactFlow();

  const updateField = (field: string, value: string) => {
    setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, [field]: value } } : n));
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 overflow-hidden w-80 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      <Handle type="target" position={Position.Left} className="w-4 h-4 bg-white border-4 border-emerald-500 rounded-full shadow-sm left-[-8px]" />
      
      {/* PERFECT MATCH: HTTP Response Color (Emerald to Teal) */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
          <FileSpreadsheet className="w-4 h-4" /> Google Sheets
        </div>
      </div>
      
      <div className="p-5 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Spreadsheet ID</label>
          {/* Added focus:border-emerald-500 */}
          <input className="nodrag nopan nowheel text-xs p-2.5 border border-gray-200 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-gray-700" value={data.sheetId || ''} onChange={(e) => updateField('sheetId', e.target.value)} placeholder="Enter ID..." />
        </div>
        <div className="flex flex-col gap-1 mt-2">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Data to Append</label>
          {/* Added focus:border-emerald-500 */}
          <textarea className="nodrag nopan nowheel text-xs p-2.5 border border-gray-200 rounded-lg bg-gray-50 h-20 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none text-gray-700" value={data.rowContent || ''} onChange={(e) => updateField('rowContent', e.target.value)} placeholder="e.g. {{llm}}" />
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="w-4 h-4 bg-white border-4 border-emerald-500 rounded-full shadow-sm right-[-8px]" />
    </div>
  );
}