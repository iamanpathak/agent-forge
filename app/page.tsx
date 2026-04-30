"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Bot, Calendar, ArrowRight, LayoutDashboard, Zap, Workflow, CheckCircle2, LineChart, Mail, Globe, Cpu, Database, MessageSquare, FileText, Hash, Search, ShieldCheck, Trash2, Edit2 } from 'lucide-react';
import { UserButton, SignInButton, useAuth } from "@clerk/nextjs";

export default function Dashboard() {
  const { isLoaded, isSignedIn } = useAuth();
  const [agents, setAgents] = useState([]);
  const [totalExecutions, setTotalExecutions] = useState(0); 
  const [loading, setLoading] = useState(true);
  
  // NEW STATE FOR SEARCHING
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setAgents([]); 
      setTotalExecutions(0);
      setLoading(false);
      return;
    }
    fetch('/api/agents')
      .then((res) => {
        if (!res.ok) throw new Error("API Route Blocked by Authentication");
        return res.json();
      })
      .then((data) => {
        if (data.success) {
            setAgents(data.agents);
            if (data.totalExecutions !== undefined) {
                setTotalExecutions(data.totalExecutions);
            }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [isLoaded, isSignedIn]); 

  const deleteAgent = async (e: React.MouseEvent, id: string) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    
    if (!window.confirm("Are you sure you want to delete this agent? This cannot be undone.")) return;

    setAgents(agents.filter((a: any) => a.id !== id));

    try {
      const res = await fetch(`/api/agents?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete agent. Please try again.");
      window.location.reload(); 
    }
  };

  const handleRenameAgent = async (e: React.MouseEvent, id: string, currentName: string) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    
    const newName = window.prompt("Enter new name for your Agent:", currentName);
    if (!newName || newName === currentName) return;

    // Optimistic UI update (feels instant to the user)
    setAgents(agents.map((a: any) => a.id === id ? { ...a, name: newName } : a));

    try {
      const res = await fetch('/api/agents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name: newName })
      });
      const data = await res.json();
      if (!data.success) throw new Error("Failed to rename");
    } catch (error) {
      console.error("Rename error:", error);
      alert("Failed to rename agent. Please try again.");
      window.location.reload(); 
    }
  };

  // NEW LOGIC: Ask for name before creating agent
  const handleCreateNewAgent = async () => {
    const agentName = window.prompt("Enter a name for your new Agent:", "My Super Agent");
    
    if (!agentName) return; // User clicked cancel or left it empty

    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: agentName, nodes: [], edges: [] })
      });
      const data = await res.json();
      if (data.success) {
        // Redirect to builder with the newly created ID
        window.location.href = `/builder?id=${data.agent.id}`;
      } else {
        alert("Failed to create agent.");
      }
    } catch (error) {
      console.error("Creation error:", error);
    }
  };

  // FILTERING LOGIC
  const filteredAgents = agents.filter((agent: any) => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    new Date(agent.createdAt).toLocaleDateString().includes(searchQuery)
  );

  const currentCopyrightYear = new Date().getFullYear();

  const appIntegrations = [
    { name: "Slack", url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/slack/slack-original.svg" },
    { name: "Google Drive", url: "https://www.vectorlogo.zone/logos/google_drive/google_drive-icon.svg" },
    { name: "Notion", url: "https://cdn.simpleicons.org/notion/000000" },
    { name: "Salesforce", url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/salesforce/salesforce-original.svg" },
    { name: "HubSpot", url: "https://cdn.simpleicons.org/hubspot/FF7A59" },
    { name: "Jira", url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jira/jira-original.svg" },
    { name: "GitHub", url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" },
    { name: "Discord", url: "https://cdn.simpleicons.org/discord/5865F2" },
  ];

  return (
    // Added id="top" for the Home link scrolling
    <div id="top" className="min-h-screen bg-[#fafafa] font-sans overflow-x-hidden selection:bg-purple-200 flex flex-col">
      
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-8 py-4 flex justify-between items-center fixed top-0 w-full z-50">
        {/* WRAPPED IN A LINK TO ACT AS A HOME BUTTON */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="bg-black p-1.5 rounded-xl shadow-md flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold text-gray-900 tracking-tight">AgentForge</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {!isLoaded ? (
            <div className="w-20 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          ) : isSignedIn ? (
            <>
              {/* CHANGED TO BUTTON */}
              <button onClick={handleCreateNewAgent} className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5">
                <Plus className="w-4 h-4" /> Create New Agent
              </button>
              <div className="h-6 w-px bg-gray-200 mx-2"></div>
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="text-gray-500 hover:text-black font-semibold text-sm px-4 py-2 transition-colors">Log In</button>
              </SignInButton>
              <SignInButton mode="modal">
                <button className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5">
                  Get Started
                </button>
              </SignInButton>
            </>
          )}
        </div>
      </nav>

      <div className="flex-grow pt-20">
        {!isLoaded ? (
          <div className="min-h-[80vh] flex flex-col items-center justify-center">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mb-4"></div>
          </div>
        ) : isSignedIn ? (
          <main className="max-w-6xl mx-auto mt-8 px-6 pb-20 animate-fade-in-up">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in-up">
              <div className="bg-white p-6 rounded-2xl border-2 border-purple-100 hover:border-purple-300 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4">
                <div className="bg-purple-50 p-3 rounded-xl text-purple-600"><LayoutDashboard className="w-6 h-6" /></div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Agents</p>
                  <p className="text-2xl font-black text-gray-900">{agents.length}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border-2 border-purple-100 hover:border-purple-300 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4">
                <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600"><Zap className="w-6 h-6" /></div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Executions</p>
                  <p className="text-2xl font-black text-gray-900">{totalExecutions.toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border-2 border-purple-100 hover:border-purple-300 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4">
                <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600 flex items-center justify-center relative">
                  <div className="absolute w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                  <div className="relative w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">System Status</p>
                  <p className="text-lg font-bold text-gray-900">Engine Online</p>
                </div>
              </div>
            </div>

            {/* HEADER & SEARCH BAR */}
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                  <LayoutDashboard className="w-8 h-8 text-purple-600" /> Your Agents
                </h1>
                <p className="text-gray-500 mt-2 text-lg">Manage, monitor, and deploy your automated workflows.</p>
              </div>
              
              {/* SEARCH INPUT */}
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search by name or date..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 shadow-sm text-sm text-gray-700"
                />
              </div>
            </header>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : agents.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center shadow-sm">
                <div className="bg-purple-50 p-4 rounded-full inline-block mb-4">
                  <Bot className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">No agents found</h3>
                <p className="text-gray-500 mt-2 mb-6">Start by building your first automated AI agent.</p>
                <button onClick={handleCreateNewAgent} className="inline-flex items-center gap-2 text-white bg-purple-600 px-6 py-3 rounded-full font-bold hover:bg-purple-700 transition-all shadow-md hover:scale-105">
                  Go to Builder <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : filteredAgents.length === 0 ? (
              <div className="text-center py-20">
                 <p className="text-gray-500 text-lg font-medium">No agents found matching "{searchQuery}"</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAgents.map((agent: any) => (
                  <Link
                    key={agent.id}
                    href={`/builder?id=${agent.id}`}
                    className={`group bg-white rounded-2xl p-6 transition-all duration-300 relative overflow-hidden hover:-translate-y-1 hover:shadow-xl ${
                      searchQuery.trim() !== ""
                        ? "border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] ring-4 ring-purple-500/20 scale-[1.02]"
                        : "border border-gray-200 shadow-sm hover:border-purple-300"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-purple-50 transition-colors duration-300">
                        <Bot className="w-6 h-6 text-gray-700 group-hover:text-purple-600" />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {(() => {
                          let isDraft = true;
                          try {
                            const parsedNodes = typeof agent.nodes === 'string' ? JSON.parse(agent.nodes) : agent.nodes;
                            if (parsedNodes && parsedNodes.length > 2) isDraft = false;
                          } catch (e) {}

                          return isDraft ? (
                            <span className="text-[10px] px-2.5 py-1 bg-yellow-50 text-yellow-700 font-bold rounded-full border border-yellow-200 uppercase tracking-widest">
                              DRAFT
                            </span>
                          ) : (
                            <span className="text-[10px] px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-full border border-emerald-200 uppercase tracking-widest">
                              ACTIVE
                            </span>
                          );
                        })()}

                        <button 
                            onClick={(e) => handleRenameAgent(e, agent.id, agent.name)}
                            className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-all ml-1 z-20"
                            title="Rename Agent"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>

                        <button 
                            onClick={(e) => deleteAgent(e, agent.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all ml-1 z-20"
                            title="Delete Agent"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{agent.name}</h3>
                    <div className="flex items-center gap-2 text-gray-400 text-xs mt-4">
                      <Calendar className="w-3 h-3" />
                      <span>Created on {new Date(agent.createdAt).toLocaleDateString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        ) : (
          /* ENTERPRISE SAAS LANDING PAGE HIDDEN FOR BREVITY (Kept identical internally) */
          <div className="flex flex-col items-center w-full bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none z-0">
               <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-400/10 blur-[100px] animate-[pulse_6s_ease-in-out_infinite]"></div>
               <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/10 blur-[100px] animate-[pulse_8s_ease-in-out_infinite_1s]"></div>
            </div>

            <section className="relative flex flex-col items-center justify-center pt-32 pb-16 px-6 text-center w-full z-10 max-w-5xl mx-auto">
              <h1 className="animate-fade-in-up delay-100 text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-8 leading-[1.1]">
                Build Intelligent AI Agents<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400">That Think, Decide & Act</span>
              </h1>
              <p className="animate-fade-in-up delay-200 text-lg md:text-xl text-gray-500 mb-12 max-w-2xl leading-relaxed">
                Connect APIs, automate workflows, and deploy intelligent systems - without writing code.
              </p>
              <div className="animate-fade-in-up delay-300 flex items-center justify-center gap-4">
                <SignInButton mode="modal">
                  <button className="bg-black text-white px-8 py-4 rounded-full text-base font-bold hover:bg-gray-800 hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2 group">
                    Start Building Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </SignInButton>
              </div>

              {/* Added ID and scroll margin here for Integrations */}
              <div id="features" className="mt-24 w-full animate-fade-in-up delay-500 pt-8 opacity-80 overflow-hidden relative scroll-mt-32">
                <div className="absolute left-0 top-0 w-24 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
                <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-white to-transparent z-10"></div>
                <p className="text-sm font-black text-slate-800 uppercase tracking-[0.25em] mb-10 drop-shadow-sm opacity-90">Connect anything. Automate everything.</p>
                <div className="flex w-full overflow-hidden">
                  <div className="animate-marquee flex whitespace-nowrap items-center">
                    {[...appIntegrations, ...appIntegrations].map((app, idx) => (
                      <div key={idx} className="group flex items-center gap-3 font-bold text-gray-800 mx-10 cursor-pointer">
                        <img src={app.url} alt={app.name} className="w-8 h-8 opacity-100 group-hover:scale-110 transition-all duration-300" />
                        <span className="text-lg opacity-90 group-hover:opacity-100 transition-opacity duration-300">{app.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="py-16 w-full max-w-6xl px-6 relative z-20 text-center animate-fade-in-up delay-700">
              <div className="animate-float bg-white p-3 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-200/50">
                <div className="bg-[#f8f9fa] rounded-[1.5rem] aspect-[21/7] md:aspect-[21/6] border border-gray-100 overflow-hidden relative flex items-center justify-center bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                  <div className="flex items-center gap-2 opacity-100 scale-[0.45] md:scale-[0.75]">
                    
                    <div className="bg-white text-gray-800 px-6 py-4 rounded-2xl shadow-lg border border-gray-200 flex items-center gap-3 z-10 w-48 justify-center hover:scale-105 hover:border-blue-400 transition-all cursor-pointer">
                       <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><Zap className="w-5 h-5"/></div>
                       <div className="text-left"><p className="text-[10px] font-bold text-gray-400">TRIGGER</p><p className="font-bold text-sm">Webhook</p></div>
                    </div>
                    <div className="h-1 w-12 bg-gray-200 relative overflow-hidden rounded-full"><div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-[shimmer_1.5s_infinite]"></div></div>

                    <div className="bg-white text-gray-800 px-6 py-4 rounded-2xl shadow-lg border border-gray-200 flex items-center gap-3 z-10 w-48 justify-center hover:scale-105 hover:border-blue-400 transition-all cursor-pointer">
                       <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><Search className="w-5 h-5"/></div>
                       <div className="text-left"><p className="text-[10px] font-bold text-gray-400">TAVILY</p><p className="font-bold text-sm">Live Search</p></div>
                    </div>
                    <div className="h-1 w-12 bg-gray-200 relative overflow-hidden rounded-full"><div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-[shimmer_1.5s_infinite_0.5s]"></div></div>

                    <div className="bg-white text-gray-800 px-6 py-4 rounded-2xl shadow-lg border border-purple-200 ring-4 ring-purple-50 flex items-center gap-3 z-10 w-52 justify-center hover:scale-105 hover:border-purple-500 transition-all cursor-pointer">
                       <div className="bg-purple-100 text-purple-600 p-2 rounded-lg"><Bot className="w-5 h-5"/></div>
                       <div className="text-left"><p className="text-[10px] font-bold text-purple-400">GROQ AI</p><p className="font-bold text-sm">Llama 3.1 (8B)</p></div>
                    </div>
                    <div className="h-1 w-12 bg-gray-200 relative overflow-hidden rounded-full"><div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-[shimmer_1.5s_infinite_1s]"></div></div>

                    <div className="bg-white text-gray-800 px-6 py-4 rounded-2xl shadow-lg border border-gray-200 flex items-center gap-3 z-10 w-48 justify-center hover:scale-105 hover:border-orange-400 transition-all cursor-pointer">
                       <div className="bg-orange-100 text-orange-600 p-2 rounded-lg"><FileText className="w-5 h-5"/></div>
                       <div className="text-left"><p className="text-[10px] font-bold text-gray-400">LOGIC</p><p className="font-bold text-sm">Data Parser</p></div>
                    </div>
                    <div className="h-1 w-12 bg-gray-200 relative overflow-hidden rounded-full"><div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-[shimmer_1.5s_infinite_1.5s]"></div></div>

                    <div className="bg-white text-gray-800 px-6 py-4 rounded-2xl shadow-lg border border-gray-200 flex items-center gap-3 z-10 w-48 justify-center hover:scale-105 hover:border-emerald-400 transition-all cursor-pointer">
                       <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg"><Database className="w-5 h-5"/></div>
                       <div className="text-left"><p className="text-[10px] font-bold text-gray-400">ACTION</p><p className="font-bold text-sm">Save to DB</p></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-24 bg-gray-50/50 border-y border-gray-100 w-full relative z-20">
              <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                   <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Built for limitless possibilities.</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { icon: LineChart, color: "text-blue-600", bg: "bg-blue-50", hoverBorder: "hover:border-blue-400", title: "Data Analysis", desc: "Automate extraction and summarization instantly." },
                    { icon: Mail, color: "text-emerald-600", bg: "bg-emerald-50", hoverBorder: "hover:border-emerald-400", title: "Email Workflows", desc: "Draft and dispatch personalized emails at scale." },
                    { icon: Globe, color: "text-purple-600", bg: "bg-purple-50", hoverBorder: "hover:border-purple-400", title: "Web Scraping", desc: "Browse the live internet dynamically for research." },
                    { icon: Cpu, color: "text-orange-600", bg: "bg-orange-50", hoverBorder: "hover:border-orange-400", title: "Custom APIs", desc: "Connect your intelligent agent to external tools." }
                  ].map((useCase, idx) => (
                    <div key={idx} className={`bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 text-left ${useCase.hoverBorder}`}>
                      <div className={`${useCase.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
                        <useCase.icon className={`w-7 h-7 ${useCase.color}`} />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{useCase.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{useCase.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-24 w-full max-w-6xl px-6 relative z-20 text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">How AgentForge Works</h2>
              <p className="text-lg text-gray-500 mb-16 max-w-2xl mx-auto">Our intuitive, 3-step visual workflow makes automating with AI simpler than ever.</p>
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
                <div className="hidden md:block absolute top-1/2 left-[25%] right-[25%] -translate-y-1/2 border-t border-dashed border-gray-400 z-0"></div>

                <div className="bg-white w-full md:w-1/3 p-10 rounded-[2rem] border-2 border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center hover:-translate-y-2 hover:shadow-xl hover:border-blue-500 transition-all duration-300 relative z-10 group">
                  <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Zap className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">1. Connect Trigger</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">Set up a webhook to receive data or configure a schedule for recurring automated tasks.</p>
                </div>
                
                <div className="bg-white w-full md:w-1/3 p-10 rounded-[2rem] border-2 border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center hover:-translate-y-2 hover:shadow-xl hover:border-purple-500 transition-all duration-300 relative z-10 group">
                  <div className="bg-purple-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Bot className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">2. Design Logic</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">Use our intuitive node builder to visually connect LLMs, scrapers, APIs, and decision trees.</p>
                </div>

                <div className="bg-white w-full md:w-1/3 p-10 rounded-[2rem] border-2 border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center hover:-translate-y-2 hover:shadow-xl hover:border-emerald-500 transition-all duration-300 relative z-10 group">
                  <div className="bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Zap className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">3. Deploy Agent</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">Save your visual workflow, deploy it live, and watch your automated intelligent agent go to work.</p>
                </div>
              </div>
            </section>

            <section id="pricing" className="pt-24 pb-32 w-full max-w-5xl px-6 relative z-20 text-center scroll-mt-20">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Scale without limits.</h2>
              <p className="text-lg text-gray-500 mb-16 max-w-xl mx-auto">Start building for free, upgrade when your workflow demands more power.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Changed border-[3px] border-purple-300/60 to border border-gray-200 */}
                <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-purple-400 transition-all duration-300 text-left">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Hobby</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-extrabold text-gray-900">$0</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">Perfect for exploring the builder.</p>
                  <ul className="space-y-4 mb-8">
                    {['100 Executions/mo', 'Basic LLM Models', 'Community Support', 'Standard Nodes'].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-gray-400" /> {feature}
                      </li>
                    ))}
                  </ul>
                  <SignInButton mode="modal">
                    <button className="w-full py-3 px-4 bg-gray-50 border border-gray-200 text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-colors text-sm">Start Free</button>
                  </SignInButton>
                </div>

                {/* Changed border-[3px] to border-2 for a sleeker glow */}
                <div className="bg-black p-8 rounded-[2rem] border-2 border-purple-500 shadow-2xl text-left transform md:scale-105 hover:scale-110 transition-transform duration-300 relative z-10">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                    Pro
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Builder</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-extrabold text-white">$29</span>
                    <span className="text-gray-400 text-sm">/month</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-6 pb-6 border-b border-gray-800">For production automations.</p>
                  <ul className="space-y-4 mb-8">
                    {['10,000 Executions/mo', 'Advanced Webhooks', 'Premium Groq Support', 'Email Nodes'].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-purple-400" /> {feature}
                      </li>
                    ))}
                  </ul>
                  <SignInButton mode="modal">
                    <button className="w-full py-3 px-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg text-sm">Upgrade</button>
                  </SignInButton>
                </div>

                {/* Changed border-[3px] border-purple-300/60 to border border-gray-200 */}
                <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-purple-400 transition-all duration-300 text-left">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-extrabold text-gray-900">Custom</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-6 pb-6 border-b border-gray-100">For high-volume teams.</p>
                  <ul className="space-y-4 mb-8">
                    {['Unlimited Executions', 'Dedicated Servers', 'Custom Integrations', '24/7 SLA Support'].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-gray-400" /> {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-3 px-4 bg-white border border-gray-200 text-gray-900 font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm">Contact Sales</button>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>

      {isLoaded && !isSignedIn && (
        <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8 px-6 mt-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
              <div className="col-span-1 md:col-span-2 pr-0 md:pr-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-black p-1.5 rounded-lg">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-extrabold text-gray-900 tracking-tight">AgentForge</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  The visual canvas for developers to build, connect, and deploy advanced LLM pipelines in minutes. No complex scripts, just pure logic.
                </p>
                <div className="flex items-center gap-4 text-gray-400 text-xs font-bold tracking-widest mt-8">
                  <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> SECURED BY CLERK (SOC 2)</div>
                  <div className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> GDPR COMPLIANT AUTH</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-gray-900 mb-4 text-sm tracking-wider uppercase">Product</h4>
                <ul className="space-y-3 text-sm text-gray-500">
                  <li><a href="#top" className="hover:text-purple-600 transition-colors cursor-pointer">Home</a></li>
                  <li><a href="#features" className="hover:text-purple-600 transition-colors cursor-pointer">Integrations</a></li>
                  <li><a href="#pricing" className="hover:text-purple-600 transition-colors cursor-pointer">Pricing</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-4 text-sm tracking-wider uppercase">Connect & Legal</h4>
                <ul className="space-y-3 text-sm text-gray-500">
                  <li><a href="https://github.com/iamanpathak" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors">GitHub</a></li>
                  <li><a href="https://www.linkedin.com/in/iamanpathak" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors">LinkedIn</a></li>
                  <li><Link href="/terms" className="hover:text-purple-600 transition-colors">Terms of Service</Link></li>
                  <li><Link href="/privacy" className="hover:text-purple-600 transition-colors">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-500 text-xs">
                © {currentCopyrightYear} AgentForge. All rights reserved.
              </p>
              <p className="text-gray-500 text-sm font-medium flex items-center gap-1.5">
                Built with ❤️ by 
                <a href="https://github.com/iamanpathak" target="_blank" rel="noopener noreferrer" className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 hover:opacity-80 transition-opacity">
                  Aman Pathak
                </a>
              </p>
            </div>
          </div>
        </footer>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 25s linear infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}