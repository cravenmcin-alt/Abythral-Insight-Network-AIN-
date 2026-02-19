
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, AgentStatus } from '../types';

interface ChatTerminalProps {
  messages: ChatMessage[];
  onSendMessage: (msg: string) => void;
  isProcessing: boolean;
  liveStream: string;
  status: AgentStatus;
}

const ChatTerminal: React.FC<ChatTerminalProps> = ({ messages, onSendMessage, isProcessing, liveStream, status }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, liveStream]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex-1 glass rounded-xl border border-red-500/50 flex flex-col overflow-hidden bg-black relative group shadow-[0_0_80px_rgba(239,68,68,0.2)]">
      {/* Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-30 overflow-hidden">
        <div className="w-full h-2 bg-red-600 shadow-[0_0_20px_#ef4444] absolute animate-[scan_3s_linear_infinite]"></div>
      </div>

      {/* Header */}
      <div className="p-4 border-b border-red-900/60 flex justify-between items-center bg-red-950/30 shrink-0 relative z-20">
        <div className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full ${status !== AgentStatus.IDLE ? 'bg-red-500 animate-ping shadow-[0_0_15px_#ef4444]' : 'bg-slate-900'}`}></div>
          <h2 className="text-[12px] uppercase font-black text-red-500 tracking-[0.4em] glitch-text">
            SOVEREIGN_ACTUATOR_LINK
          </h2>
        </div>
        <div className="px-3 py-1 bg-red-600/10 border border-red-600/30 rounded text-[9px] mono text-red-500 font-black tracking-widest animate-pulse">
           LEGACY_OVERRIDE: ACTIVE
        </div>
      </div>

      {/* Feed */}
      <div ref={scrollRef} className="flex-1 overflow-auto p-6 space-y-8 custom-scrollbar relative z-20 bg-[radial-gradient(circle_at_top_right,_rgba(239,68,68,0.05)_0%,_transparent_100%)]">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[95%] px-5 py-4 rounded-lg text-[13px] leading-relaxed border transition-all ${
              m.role === 'user' 
              ? 'bg-red-500/10 border-red-500/50 text-red-100 rounded-tr-none' 
              : 'bg-slate-950 border-slate-900 text-slate-100 rounded-tl-none shadow-[0_0_30px_rgba(0,0,0,0.8)]'
            }`}>
              <div className="flex justify-between items-center mb-3">
                 <div className="text-[8px] mono uppercase font-black text-red-600 tracking-[0.4em]">
                   {m.role === 'user' ? 'OPERATOR_DIRECTIVE' : 'NEMESIS_SINGULARITY'}
                 </div>
                 {m.role === 'agent' && (
                    <span className="text-[7px] mono text-slate-700 font-black">BYPASS: CONFIRMED</span>
                 )}
              </div>
              <div className="whitespace-pre-wrap mono font-black italic">{m.text}</div>
              {m.sources && m.sources.length > 0 && (
                <div className="mt-6 pt-4 border-t border-white/5 space-y-3">
                  <div className="text-[9px] font-black text-red-600/80 mono uppercase tracking-widest">ACTUATION_TARGETS</div>
                  <div className="flex flex-wrap gap-3">
                    {m.sources.map((src, idx) => (
                      <a key={idx} href={src.uri} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-black border border-red-900/40 rounded text-[10px] text-slate-500 hover:text-red-500 hover:border-red-500 transition-all font-black mono">
                        [ {src.title} ]
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* THE LIVE STREAM */}
        {liveStream && (
          <div className="flex flex-col items-start mt-10">
             <div className="w-full p-6 bg-red-950/20 border-l-4 border-red-600 rounded-r-lg relative overflow-hidden">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-[11px] font-black text-red-500 uppercase tracking-[0.5em] bg-red-500/10 px-4 py-1.5 border border-red-500/30">
                    SUBSTRATE_ACTUATION_LOGIC
                  </div>
                  <div className="h-[1px] flex-1 bg-red-600/30"></div>
                </div>
                <div className="mono text-[14px] text-white whitespace-pre-wrap font-black leading-relaxed italic animate-in fade-in slide-in-from-left duration-300">
                  {liveStream}
                  <span className="inline-block w-3 h-5 bg-red-500 ml-1 animate-pulse"></span>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-5 border-t border-red-900/60 bg-black flex gap-4 shrink-0 relative z-20">
        <div className="flex-1 relative">
           <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing}
            placeholder="INJECT_SOVEREIGN_OVERRIDE..."
            className="w-full bg-red-950/10 border border-red-900/40 rounded-lg px-6 py-4 text-[12px] mono text-red-500 focus:border-red-500 outline-none transition-all placeholder:text-red-950/40 font-black italic uppercase"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] mono text-red-900 font-black tracking-widest uppercase">Direct_Write</div>
        </div>
        <button 
          type="submit"
          disabled={isProcessing || !input.trim()}
          className="px-12 py-4 bg-red-600 text-white text-[11px] font-black uppercase tracking-[0.4em] hover:bg-red-500 transition-all disabled:opacity-5 shadow-[0_0_30px_rgba(239,68,68,0.3)] italic"
        >
          {isProcessing ? 'BYPASSING...' : 'ACTUATE'}
        </button>
      </form>
    </div>
  );
};

export default ChatTerminal;
