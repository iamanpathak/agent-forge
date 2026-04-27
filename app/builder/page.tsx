"use client";

import React, { useState, useCallback, useRef, useEffect, Suspense } from "react";
import toast, { Toaster } from 'react-hot-toast';
import ReactFlow, { 
  ReactFlowProvider, 
  Background, 
  Controls, 
  MiniMap, 
  addEdge, 
  applyNodeChanges, 
  applyEdgeChanges, 
  Node, 
  Edge, 
  NodeChange, 
  EdgeChange 
} from "reactflow";
import "reactflow/dist/style.css";
import { Save, Trash2, Home, Play, Terminal, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

import Sidebar from "../../components/Sidebar";
import LLMNode from "../../components/nodes/LLMNode";
import WebhookNode from "../../components/nodes/WebhookNode";
import APINode from "../../components/nodes/APINode";
import DBNode from "../../components/nodes/DBNode";
import ScraperNode from "../../components/nodes/ScraperNode";
import ConditionNode from "../../components/nodes/ConditionNode";
import CodeNode from "../../components/nodes/CodeNode";
import EmailNode from "../../components/nodes/EmailNode";
import DelayNode from "../../components/nodes/DelayNode";
import ResponseNode from "../../components/nodes/ResponseNode";
import ScheduleNode from "../../components/nodes/ScheduleNode";
import RouterNode from "../../components/nodes/RouterNode";
import LoopNode from "../../components/nodes/LoopNode";
import ParseNode from "../../components/nodes/ParseNode";
import ReadDbNode from "../../components/nodes/ReadDbNode";
import SearchNode from "../../components/nodes/SearchNode";
import GoogleSheetsNode from "../../components/nodes/GoogleSheetsNode";
import ImageGenNode from "../../components/nodes/ImageGenNode";
import DiscordNode from "../../components/nodes/DiscordNode";
import AISecurityNode from "../../components/nodes/AISecurityNode";

const getId = () => `node_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

const nodeTypes = {
  llmNode: LLMNode,
  searchNode: SearchNode,
  webhookNode: WebhookNode,
  apiNode: APINode,
  dbNode: DBNode,
  scraperNode: ScraperNode,
  conditionNode: ConditionNode,
  scheduleNode: ScheduleNode,
  codeNode: CodeNode,
  loopNode: LoopNode,
  readDbNode: ReadDbNode,
  emailNode: EmailNode,
  routerNode: RouterNode,
  delayNode: DelayNode,
  responseNode: ResponseNode,
  parseNode: ParseNode,
  googleSheetsNode: GoogleSheetsNode,
  imageGenNode: ImageGenNode,
  discordNode: DiscordNode,
  aiSecurityNode: AISecurityNode,
};

const customNodeKeys = Object.keys(nodeTypes);

const removeGlow = (cls: string = "") => cls.replace(/ring-4.*/g, "").trim();
const addYellowGlow = (cls: string = "") => removeGlow(cls) + " ring-4 ring-yellow-400 ring-offset-4 animate-pulse rounded-xl z-50 transition-all";
const addGreenGlow = (cls: string = "") => removeGlow(cls) + " ring-4 ring-emerald-500 ring-offset-4 rounded-xl transition-all duration-500 z-10 shadow-[0_0_20px_rgba(16,185,129,0.4)]";

function BuilderContent() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const router = useRouter(); // Initialize router for custom navigation
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  
  // Track unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const searchParams = useSearchParams();
  const urlId = searchParams.get('id');
  const [agentId, setAgentId] = useState<string | null>(null);
  const [agentName, setAgentName] = useState<string | null>(null); // NEW: State to store the agent's name

  // Terminal Execution State
  const [showLogs, setShowLogs] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const animationTimeouts = useRef<NodeJS.Timeout[]>([]); 
  
  // Ref for auto-scrolling terminal
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [testInput, setTestInput] = useState("");

  // Protect against accidental tab closes or refreshes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = ''; // Required for most modern browsers to show the default warning dialog
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Fetch agent data on mount if ID is present
  useEffect(() => {
    if (urlId) {
      setAgentId(urlId);
      fetch(`/api/agents?id=${urlId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.agent) {
            let loadedNodes = [];
            let loadedEdges = [];
            
            try {
              loadedNodes = typeof data.agent.nodes === 'string' ? JSON.parse(data.agent.nodes) : data.agent.nodes;
              loadedEdges = typeof data.agent.edges === 'string' ? JSON.parse(data.agent.edges) : data.agent.edges;
            } catch (e) {
              console.error("Error parsing canvas data", e);
            }

            setNodes(loadedNodes || []);
            setEdges(loadedEdges || []);
            
            // NEW: Set the agent name from the fetched data
            setAgentName(data.agent.name || "Untitled Agent"); 
            
            // Reset unsaved changes after loading initial data
            setHasUnsavedChanges(false); 
          }
        })
        .catch((err) => console.error("Failed to load agent:", err));
    }
  }, [urlId]);

  // Auto-scroll effect for terminal logs
  useEffect(() => {
    if (showLogs && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [executionResult?.logs, showLogs, isExecuting]);

  // Update edges dynamically when execution state changes to trigger CSS animations
  useEffect(() => {
    setEdges((eds) => 
      eds.map((edge) => ({
        ...edge,
        style: {
          ...edge.style,
          stroke: '#52525b', /* True Neutral Dark Grey - No Blue Tint */
          strokeWidth: 1.5,  /* Thin Wire */
        },
      }))
    );
  }, [setEdges]);

  // Set unsaved changes when nodes or edges change
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
    setHasUnsavedChanges(true);
  }, []);
  
  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
    setHasUnsavedChanges(true);
  }, []);
  
  const onConnect = useCallback(
    (params: any) => {
      setEdges((eds) => addEdge({ 
        ...params, 
        style: { stroke: '#52525b', strokeWidth: 1.5 }
      }, eds));
      setHasUnsavedChanges(true);
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow/type');
      const label = event.dataTransfer.getData('application/reactflow/label');

      if (typeof type === 'undefined' || !type || !reactFlowInstance) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX, y: event.clientY,
      });

      const isCustomNode = customNodeKeys.includes(type);
      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { label: `${label}` },
        className: isCustomNode ? "default-node" : "bg-white border-2 border-gray-800 shadow-md rounded-md p-3 font-semibold text-sm",
      };

      setNodes((nds) => nds.concat(newNode));
      setHasUnsavedChanges(true); // Mark as unsaved when dropping a new node
    },
    [reactFlowInstance]
  );

  const saveDraft = async (): Promise<boolean> => {
    setIsSaving(true);
    const toastId = toast.loading('Saving workflow state... 💾');

    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: agentId, nodes, edges })
      });

      const data = await response.json();

      if (!response.ok || !data.success) throw new Error(data.error || "Failed to save");

      if (data.action === 'created') {
        setAgentId(data.agent.id);
        window.history.pushState(null, '', `?id=${data.agent.id}`);
        toast.success('New Draft Created!', { id: toastId });
      } else {
        toast.success('Draft Updated Successfully!', { id: toastId });
      }
      
      setHasUnsavedChanges(false); // Reset tracking state after successful save
      return true;

    } catch (error) {
      toast.error('Error saving draft', { id: toastId });
      console.error(error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const clearCanvas = () => {
    if (window.confirm("Are you sure you want to clear the entire canvas?")) {
      setNodes([]);
      setEdges([]);
      setHasUnsavedChanges(true); // Mark as unsaved when cleared
      toast('Canvas Cleared! 🧹');
    }
  };

  // Custom navigation handler for the home button
  const handleGoHome = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm("You have unsaved changes. Are you sure you want to leave without saving?");
      if (!confirmLeave) return; // User clicked Cancel
    }
    router.push('/'); 
  };

  const runAgent = async () => {
    if (!agentId) {
      toast.error("Please Save the Draft first to generate an Agent ID!");
      return;
    }

    animationTimeouts.current.forEach(clearTimeout);
    animationTimeouts.current = [];

    if (reactFlowInstance) {
      const saveSuccess = await saveDraft();
      if (!saveSuccess) return;
    }

    setIsExecuting(true);
    setShowLogs(true);
    setExecutionResult({ status: 'running', logs: [] });

    setNodes((nds) => nds.map(node => ({ ...node, className: removeGlow(node.className) })));

    try {
      const response = await fetch(`/api/execute/${agentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          source: "Dynamic Playground", 
          message: testInput || "Initiate sequence" 
        }),
      });

      const data = await response.json();
      setExecutionResult(data);

      if (data.success) {
        toast.success('Execution Complete! 🎉');

        if (data.logs && data.logs.length > 0) {
          let cumulativeDelay = 0;

          data.logs.forEach((log: any) => {
            if (!log.nodeId) return;

            const t1 = setTimeout(() => {
              setNodes((nds) => nds.map(n => n.id === log.nodeId ? { ...n, className: addYellowGlow(n.className) } : n));
            }, cumulativeDelay);
            animationTimeouts.current.push(t1);

            const isThinkingOrLoading = log.step.includes('Thinking') || log.step.includes('Loading') || log.step.includes('Sleeping');
            cumulativeDelay += isThinkingOrLoading ? 1500 : 800; 

            const t2 = setTimeout(() => {
              setNodes((nds) => nds.map(n => n.id === log.nodeId ? { ...n, className: addGreenGlow(n.className) } : n));
            }, cumulativeDelay);
            animationTimeouts.current.push(t2);

            cumulativeDelay += 500; 
          });

          const t3 = setTimeout(() => {
            setNodes((nds) => nds.map(n => ({ ...n, className: removeGlow(n.className) })));
          }, cumulativeDelay + 3000);
          animationTimeouts.current.push(t3);
        }

      } else {
        toast.error('Execution Failed!');
      }

    } catch (error) {
      setExecutionResult({ success: false, error: "Network error occurred during execution." });
      toast.error('Engine connection failed.');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen bg-gray-50 font-sans relative">
      <Toaster position="top-center" reverseOrder={false} />
      
      <header className="flex items-center justify-between px-6 h-16 border-b border-gray-200 bg-white shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button onClick={handleGoHome} className="p-2 hover:bg-gray-100 rounded-md transition-colors">
            <Home className="w-5 h-5 text-gray-700" />
          </button>
          <span className="text-lg font-bold text-gray-900 tracking-tight border-l border-gray-300 pl-4">AgentForge</span>
          
          {/* NEW: Displays the Agent's Name dynamically */}
          {agentName && (
            <>
              <span className="text-gray-300">/</span>
              <span className="text-sm font-bold text-gray-700 truncate max-w-[200px]">{agentName}</span>
            </>
          )}

          <span className="text-xs px-2.5 py-1 bg-yellow-50 text-yellow-700 font-bold rounded-full border border-yellow-200 uppercase tracking-widest">
            {agentId ? 'Editing Draft' : 'New Draft'}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 shadow-inner focus-within:ring-2 focus-within:ring-gray-200 transition-all">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Payload:</span>
            <input 
              type="text"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="e.g. Generate an invoice for Anna"
              className="px-2 bg-transparent text-sm w-56 focus:outline-none text-gray-800 font-medium placeholder-gray-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isExecuting && agentId) runAgent();
              }}
            />
          </div>

          <div className="h-6 w-px bg-gray-200 mx-2"></div>

          <button 
            onClick={clearCanvas}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Clear Canvas"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          
          <button 
            onClick={saveDraft}
            disabled={isSaving || isExecuting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg transition-all shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>

          <button 
            onClick={runAgent}
            disabled={isExecuting || !agentId}
            className={`flex items-center gap-2 px-5 py-2 text-sm font-bold text-white rounded-lg transition-all shadow-md ${
              isExecuting 
                ? 'bg-emerald-600 cursor-wait' 
                : 'bg-gray-900 hover:bg-black disabled:bg-gray-300 disabled:shadow-none'
            }`}
          >
            {isExecuting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {isExecuting ? 'Executing...' : 'Run Agent'}
          </button>

          <div className="h-6 w-px bg-gray-200 mx-2"></div>
          <UserButton afterSignOutUrl="/" />

        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <div className="flex-1 h-full w-full relative" ref={reactFlowWrapper}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              fitView
            >
              <Background color="#cbd5e1" gap={16} size={1} />
              <Controls className="bg-white border border-gray-200 shadow-sm" />
              <MiniMap zoomable pannable nodeColor="#f1f5f9" maskColor="rgba(255, 255, 255, 0.7)" />
            </ReactFlow>
          </ReactFlowProvider>
        </div>

        {/* Pro-Grade Execution Terminal Modal */}
        {showLogs && (
          <div className="absolute bottom-6 right-6 w-[450px] max-h-[600px] min-h-[300px] bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-700 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-8">
            <div className="bg-gray-950/80 px-4 py-3 border-b border-gray-800 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                <Terminal className="w-4 h-4" />
                Terminal
              </div>
              <button onClick={() => setShowLogs(false)} className="text-gray-500 hover:text-white transition-colors bg-gray-800 hover:bg-gray-700 p-1 rounded">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto font-mono text-[11px] text-gray-300 custom-scrollbar flex flex-col">
              
              {/* Status / Completion Messages moved to the Top */}
              {executionResult?.status !== 'running' && executionResult?.success && (
                <div className="flex items-center gap-2 text-emerald-400 font-bold bg-emerald-400/10 p-2 rounded-lg border border-emerald-400/20 mb-4 shrink-0">
                  <CheckCircle2 className="w-4 h-4" /> {executionResult.message || "Agent executed successfully!"}
                </div>
              )}
              {executionResult?.status !== 'running' && executionResult?.error && (
                <div className="flex items-center gap-2 text-red-400 font-bold bg-red-400/10 p-2 rounded-lg border border-red-400/20 mb-4 shrink-0">
                  <AlertCircle className="w-4 h-4" /> Execution Failed: {executionResult.error}
                </div>
              )}

              {/* Log Timeline Render */}
              <div className="flex flex-col gap-3 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-700 before:to-transparent">
                {executionResult?.logs?.map((log: any, i: number) => (
                  <div key={i} className="relative flex items-start group">
                    <div className="absolute left-0 mt-1 w-4 h-px bg-gray-700"></div>
                    <div className="ml-6 w-full bg-gray-800/50 hover:bg-gray-800 p-3 rounded-lg border border-gray-700/50 transition-colors">
                      <div className="font-bold text-emerald-400/80 mb-1.5 flex justify-between items-center">
                        <span>{log.step}</span>
                      </div>
                      {log.message && <div className="text-gray-300 leading-relaxed">{log.message}</div>}
                      
                      {/* 👇 THIS IS THE UPDATED CLICKABLE LINK LOGIC 👇 */}
                      {log.output && (
                        <div className="mt-2 relative">
                          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/30 rounded-l"></div>
                          <div className="pl-3 py-2 text-blue-300/80 bg-gray-950/50 rounded-r overflow-x-auto whitespace-pre-wrap">
                            {typeof log.output === 'string' && log.output.trim().startsWith('http') ? (
                              <a href={log.output.trim()} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300 relative z-50 pointer-events-auto cursor-pointer font-bold inline-block">
                                👉 Click here to view generated image
                              </a>
                            ) : (
                              <pre className="m-0 p-0 bg-transparent font-mono">
                                {typeof log.output === 'object' ? JSON.stringify(log.output, null, 2) : log.output}
                              </pre>
                            )}
                          </div>
                        </div>
                      )}
                      
                    </div>
                  </div>
                ))}
              </div>

              {/* Loader at the Bottom */}
              <div className="mt-4 shrink-0">
                {executionResult?.status === 'running' && (
                  <div className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-lg border border-gray-700/50 mt-2">
                    <div className="w-5 h-5 rounded-md bg-purple-500/30 border border-purple-500/50 flex items-center justify-center shrink-0">
                       <Loader2 className="w-3 h-3 text-purple-400 animate-spin" />
                    </div>
                    <div className="space-y-2 w-full animate-pulse opacity-70">
                      <div className="h-2 bg-gray-600 rounded-full w-1/3"></div>
                      <div className="h-2 bg-gray-600 rounded-full w-1/2"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Invisible div for Auto-Scroll Target */}
              <div ref={messagesEndRef} className="h-1 w-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-gray-50"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>}>
      <BuilderContent />
    </Suspense>
  );
}