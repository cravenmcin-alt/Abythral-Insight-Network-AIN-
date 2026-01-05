
import React, { useEffect, useRef } from 'react';
import { Insight, AgentStatus, ThoughtStep, TutorialModule } from '../types';
import * as d3 from 'd3';
import Terminal from './Terminal';
import TutorialDrawer from './TutorialDrawer';

interface DashboardProps {
  insights: Insight[];
  status: AgentStatus;
  thoughts: ThoughtStep[];
  verificationLogs: string[];
  activeTutorial?: TutorialModule;
}

const Dashboard: React.FC<DashboardProps> = ({ insights, status, thoughts, verificationLogs, activeTutorial }) => {
  const d3Container = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (d3Container.current && thoughts.length > 0) {
      const svg = d3.select(d3Container.current);
      svg.selectAll("*").remove();

      const width = d3Container.current.clientWidth;
      const height = d3Container.current.clientHeight;

      const nodes = thoughts.slice(0, 25).map(t => ({ id: t.id, status: t.status, timestamp: t.timestamp }));
      const links = nodes.slice(0, -1).map((n, i) => ({ source: n.id, target: nodes[i+1].id }));

      const simulation = d3.forceSimulation(nodes as any)
        .force("link", d3.forceLink(links).id((d: any) => d.id).distance(120))
        .force("charge", d3.forceManyBody().strength(-250))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(40));

      const g = svg.append("g");

      const link = g.append("g")
        .selectAll("path")
        .data(links)
        .enter().append("path")
        .attr("fill", "none")
        .attr("stroke", "rgba(34, 211, 238, 0.1)")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "10,5");

      const node = g.append("g")
        .selectAll("g")
        .data(nodes)
        .enter().append("g")
        .call(d3.drag<SVGGElement, any>()
          .on("start", (e, d) => { if (!e.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
          .on("drag", (e, d) => { d.fx = e.x; d.fy = e.y; })
          .on("end", (e, d) => { if (!e.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; }));

      node.append("circle")
        .attr("r", (d: any) => d.status === status ? 12 : 6)
        .attr("fill", (d: any) => d.status === status ? "#22d3ee" : "#0f172a")
        .attr("stroke", (d: any) => d.status === status ? "rgba(34, 211, 238, 0.8)" : "rgba(255,255,255,0.1)")
        .attr("stroke-width", 2)
        .style("filter", (d: any) => d.status === status ? "drop-shadow(0 0 8px rgba(34, 211, 238, 0.5))" : "none");

      node.append("text")
        .text((d: any) => d.status)
        .attr("dx", 18)
        .attr("dy", 4)
        .attr("fill", "rgba(255,255,255,0.4)")
        .attr("font-size", "9px")
        .attr("class", "mono uppercase tracking-tighter");

      simulation.on("tick", () => {
        link.attr("d", (d: any) => `M${d.source.x},${d.source.y} L${d.target.x},${d.target.y}`);
        node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
      });
    }
  }, [thoughts, status]);

  return (
    <div className="h-full grid grid-cols-12 gap-4 overflow-hidden">
      <div className="col-span-8 flex flex-col gap-4 overflow-hidden">
        <div className="flex-1 glass rounded-2xl border border-slate-800/60 relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
          <div className="p-4 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/10">
            <h2 className="text-[10px] uppercase font-bold text-slate-400 tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
              Causal Persistence Graph
            </h2>
            <div className="text-[9px] mono text-cyan-400/40 uppercase">Multimodal Reasoning Engine v4</div>
          </div>
          <div className="flex-1 relative">
             <svg ref={d3Container} className="w-full h-full"></svg>
             <div className="absolute bottom-6 right-6 max-w-sm">
                <TutorialDrawer tutorial={activeTutorial} />
             </div>
          </div>
        </div>

        <div className="h-44 glass rounded-2xl border border-slate-800/60 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-slate-800/40 flex justify-between items-center bg-slate-900/10">
            <h2 className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Autonomous Insights</h2>
          </div>
          <div className="flex-1 overflow-x-auto p-4 flex gap-4 scrollbar-hide">
            {insights.map(insight => (
              <div key={insight.id} className="min-w-[280px] glass rounded-xl border border-slate-800/40 p-4 flex flex-col hover:border-cyan-500/30 transition-all cursor-crosshair">
                <div className="flex justify-between items-center mb-3">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase mono ${insight.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                    {insight.riskLevel}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 mono">{(insight.causalityScore * 100).toFixed(0)}% CAUSAL</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">{insight.title}</h3>
                <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed italic">"{insight.recommendation}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-span-4 flex flex-col gap-4 overflow-hidden">
        <div className="h-2/5 glass rounded-2xl border border-slate-800/60 p-5 flex flex-col relative overflow-hidden">
          <h3 className="text-[10px] uppercase tracking-widest text-slate-500 mono mb-4">Neural Perception</h3>
          <div className="flex-1 bg-black/40 rounded-xl border border-slate-800 overflow-hidden relative group">
            <img 
              src={insights[0]?.evidence[0] || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"} 
              alt="Telemetry Viz" 
              className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity duration-1000" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-transparent"></div>
            <div className="absolute top-3 left-3 flex gap-1.5">
               <div className="px-2 py-0.5 bg-cyan-500/90 text-[8px] font-black text-black rounded uppercase mono">LIVE_PERCEPTION</div>
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-[9px] mono text-cyan-500/60">
               <span>FRAME: {Math.floor(Date.now()/1000 % 10000)}</span>
               <span>RES: 1080P_GROUNDED</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <Terminal logs={verificationLogs} />
        </div>

        <div className="h-28 glass rounded-2xl border border-slate-800/60 p-4 flex flex-col justify-center gap-3">
           <div className="flex justify-between items-center">
             <span className="text-[9px] uppercase tracking-widest text-slate-500 mono">Secure Cognition State</span>
             <span className="text-[9px] text-green-500 mono font-bold">ENCRYPTED</span>
           </div>
           <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/50">
             <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 animate-pulse" style={{ width: '85%' }}></div>
           </div>
           <div className="flex items-center gap-2 text-[10px] text-slate-500 mono truncate">
             <svg className="w-3 h-3 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0112 3m0 0a10.003 10.003 0 018.143 14.931l.054.09m-3.44 2.04A10.003 10.003 0 0112 21" /></svg>
             ADDR: 0x{Math.random().toString(16).slice(2, 10).toUpperCase()}...{Math.random().toString(16).slice(2, 6).toUpperCase()}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
