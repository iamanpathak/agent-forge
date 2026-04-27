import React from 'react';
import { 
  Zap, Clock, Globe, Search, Code, Database, Save, Mail, 
  Brain, GitBranch, Shuffle, Repeat, Hourglass, FileText, Send,
  FileSpreadsheet, ImageIcon, MessageSquare, ShieldAlert // <-- Security Icon
} from 'lucide-react';

export default function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/label', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Master List organized by flow usage
  const categories = [
    {
      title: "Triggers",
      color: "bg-blue-50 text-blue-600 border-blue-200",
      nodes: [
        { type: 'webhookNode', label: 'Webhook', icon: <Zap className="w-4 h-4" /> },
        { type: 'scheduleNode', label: 'Schedule', icon: <Clock className="w-4 h-4" /> },
      ]
    },
    {
      title: "Logic & Flow",
      color: "bg-orange-50 text-orange-600 border-orange-200",
      nodes: [
        { type: 'conditionNode', label: 'If / Else', icon: <GitBranch className="w-4 h-4" /> },
        { type: 'routerNode', label: 'Router / Switch', icon: <Shuffle className="w-4 h-4" /> },
        { type: 'loopNode', label: 'Loop / Iterator', icon: <Repeat className="w-4 h-4" /> },
        { type: 'delayNode', label: 'Delay / Sleep', icon: <Hourglass className="w-4 h-4" /> },
      ]
    },
    {
      title: "AI & Extraction",
      color: "bg-purple-50 text-purple-600 border-purple-200",
      nodes: [
        { type: 'aiSecurityNode', label: 'AI Security', icon: <ShieldAlert className="w-4 h-4" /> },
        { type: 'llmNode', label: 'AI Model (LLM)', icon: <Brain className="w-4 h-4" /> },
        { type: 'searchNode', label: 'Live Web Search', icon: <Search className="w-4 h-4" /> },
        { type: 'scraperNode', label: 'Web Scraper', icon: <Search className="w-4 h-4" /> },
        { type: 'parseNode', label: 'Document Parser', icon: <FileText className="w-4 h-4" /> },
        { type: 'imageGenNode', label: 'AI Image Gen', icon: <ImageIcon className="w-4 h-4" /> }, 
      ]
    },
    {
      title: "Actions",
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
      nodes: [
        { type: 'apiNode', label: 'API Request', icon: <Globe className="w-4 h-4" /> },
        { type: 'codeNode', label: 'Custom Code', icon: <Code className="w-4 h-4" /> },
        { type: 'emailNode', label: 'Send Email', icon: <Mail className="w-4 h-4" /> },
        { type: 'responseNode', label: 'HTTP Response', icon: <Send className="w-4 h-4" /> },
        { type: 'googleSheetsNode', label: 'Google Sheets', icon: <FileSpreadsheet className="w-4 h-4" /> }, 
        { type: 'discordNode', label: 'Discord / Slack', icon: <MessageSquare className="w-4 h-4" /> }, 
      ]
    },
    {
      title: "Database & Storage",
      color: "bg-slate-50 text-slate-600 border-slate-200",
      nodes: [
        { type: 'readDbNode', label: 'Read Record', icon: <Database className="w-4 h-4" /> },
        { type: 'dbNode', label: 'Insert Record', icon: <Save className="w-4 h-4" /> },
      ]
    }
  ];

  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col h-full shadow-lg z-10 overflow-y-auto custom-scrollbar">
      <div className="p-5 border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm sticky top-0 z-20">
        <h2 className="text-xs font-black text-gray-800 tracking-widest uppercase">Node Library</h2>
        <p className="text-[11px] text-gray-500 mt-1.5 font-medium">Drag to build your automation.</p>
      </div>
      
      <div className="p-4 flex flex-col gap-6">
        {categories.map((cat, i) => (
          <div key={i} className="flex flex-col gap-2.5">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">{cat.title}</h3>
            <div className="flex flex-col gap-2">
              {cat.nodes.map((node, j) => (
                <div
                  key={j}
                  className={`flex items-center gap-3 border rounded-xl p-2.5 cursor-grab transition-all hover:shadow-md hover:scale-[1.02] ${cat.color} bg-white`}
                  onDragStart={(event) => onDragStart(event, node.type, node.label)}
                  draggable
                >
                  <div className={`p-1.5 rounded-lg border bg-white shadow-sm ${cat.color.split(' ')[1]}`}>
                    {node.icon}
                  </div>
                  <span className="text-sm font-bold text-gray-700 tracking-wide">{node.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}