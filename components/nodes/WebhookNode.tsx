import React from 'react';
import { Handle, Position } from 'reactflow';
import { Zap, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WebhookNode({ data }: any) {
  const webhookUrl = "https://hook.agentforge.com/catch/v1/xyz";

  // Handles copying the webhook URL to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast.success('Webhook URL Copied!');
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 overflow-hidden w-80 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      
      {/* Premium Gradient Header for Triggers */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
          <Zap className="w-4 h-4 fill-white/20" />
          Webhook Trigger
        </div>
        <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] text-white font-semibold uppercase tracking-wider border border-white/10">
          Start
        </span>
      </div>

      {/* Clean Body Area */}
      <div className="p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Your Unique URL</label>
          
          {/* CRITICAL FIX: Added focus-within:border-blue-500 to match Schedule Node perfectly */}
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
            <input 
              type="text" 
              readOnly 
              value={webhookUrl}
              className="nodrag nopan nowheel text-xs p-2.5 w-full bg-transparent text-gray-700 outline-none font-mono"
            />
            <button 
              onClick={copyToClipboard}
              className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors border-l border-gray-200"
              title="Copy URL"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-[11px] text-gray-400 leading-relaxed">
          Send a POST request to this URL to trigger your Agent automatically.
        </p>
      </div>

      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-4 h-4 bg-white border-4 border-blue-500 rounded-full shadow-sm right-[-8px]" 
      />
    </div>
  );
}