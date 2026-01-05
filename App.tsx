
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { AgentStatus, ThoughtStep, Insight, SystemState } from './types';
import { geminiService } from './services/geminiService';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [state, setState] = useState<SystemState>({
    isOrchestrating: false,
    status: AgentStatus.IDLE,
    thoughts: [],
    insights: [],
    activeObjective: "Global Resilience Optimization: Cascading Energy Failures",
    verificationLogs: []
  });
  const [logs, setLogs] = useState<string[]>(["[System] Abythral Network Online."]);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Audio state for Live API
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);

  const addLog = useCallback((msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 49)]);
  }, []);

  const addThought = useCallback((status: AgentStatus, desc: string, confidence: number = 0.95) => {
    const newThought: ThoughtStep = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      status,
      description: desc,
      confidence,
      hash: btoa(Math.random().toString()).slice(0, 16)
    };
    setState(prev => ({
      ...prev,
      status,
      thoughts: [newThought, ...prev.thoughts].slice(0, 50)
    }));
    addLog(`${status}: ${desc}`);
  }, [addLog]);

  // Handle Live Voice Cognition (Spoken Status)
  const speakStatus = async (text: string) => {
    if (!isVoiceActive) return;
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Briefly report this system update in a calm, robotic female voice: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
        }
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        if (!audioContextRef.current) audioContextRef.current = new AudioContext({ sampleRate: 24000 });
        const ctx = audioContextRef.current;
        const binaryString = atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
        
        const dataInt16 = new Int16Array(bytes.buffer);
        const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
        source.start(nextStartTimeRef.current);
        nextStartTimeRef.current += buffer.duration;
      }
    } catch (e) {
      console.error("Speech Error", e);
    }
  };

  const runIteration = useCallback(async () => {
    if (!state.isOrchestrating) return;

    try {
      addThought(AgentStatus.PLANNING, "Mapping long-term trajectory...");
      await speakStatus("Planning next cognition phase.");

      addThought(AgentStatus.PERCEIVING, "Ingesting multimodal telemetry...");
      await new Promise(r => setTimeout(r, 2000));

      addThought(AgentStatus.REASONING, "Performing Causal Grounding via Search...");
      const context = `Mission: ${state.activeObjective}. Anomaly in Sector-7. Load: 88%.`;
      const reasoning = await geminiService.orchestrateReasoning(state.activeObjective, context);
      
      addThought(AgentStatus.VERIFYING_CODE, "Initiating Vibe Engineering check...");
      const codeCheck = await geminiService.verifyCode(`const grid = read('S7'); grid.power < 10 ? isolate(grid) : pulse(grid);`);
      setState(prev => ({ ...prev, verificationLogs: [...codeCheck.logs, ...prev.verificationLogs].slice(0, 50) }));

      addThought(AgentStatus.VERIFYING, "Synthesizing Insight and Evidence...");
      const insight = await geminiService.parseInsight(reasoning.text || "");
      const evidence = await geminiService.generateVisualSimulation(insight.title);
      insight.evidence = [evidence];

      addThought(AgentStatus.TEACHING, "Updating Knowledge Module...");
      const tutorial = await geminiService.generateTutorial(insight.content);

      setState(prev => ({
        ...prev,
        insights: [insight, ...prev.insights].slice(0, 10),
        activeTutorial: tutorial
      }));
      
      await speakStatus(`Insight formulated: ${insight.title}. High causality detected.`);
      addThought(AgentStatus.LEARNING, "Cognition phase committed to vault.");

    } catch (error) {
      addLog(`Cycle Interrupted: ${error}`);
    }
  }, [state.isOrchestrating, state.activeObjective, isVoiceActive, addThought, addLog]);

  const toggleOrchestrator = () => {
    setState(prev => ({ ...prev, isOrchestrating: !prev.isOrchestrating }));
    addLog(state.isOrchestrating ? "System Standby." : "Orchestrator Engaged.");
  };

  useEffect(() => {
    if (state.isOrchestrating) {
      runIteration();
      intervalRef.current = setInterval(runIteration, 30000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [state.isOrchestrating, runIteration]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#020202] text-slate-200">
      <div className="scanline"></div>
      <Header 
        objective={state.activeObjective} 
        isRunning={state.isOrchestrating} 
        onToggle={toggleOrchestrator} 
      />
      
      <div className="flex flex-1 overflow-hidden p-4 gap-4">
        <Sidebar logs={logs} thoughts={state.thoughts} status={state.status} />
        <main className="flex-1 overflow-hidden flex flex-col gap-4">
          <div className="flex justify-end px-2">
             <button 
               onClick={() => setIsVoiceActive(!isVoiceActive)}
               className={`text-[10px] mono px-3 py-1 rounded-full border transition-all ${isVoiceActive ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-slate-900 border-slate-700 text-slate-500'}`}
             >
               VOICE_COGNITION: {isVoiceActive ? 'ON' : 'OFF'}
             </button>
          </div>
          <Dashboard 
            insights={state.insights} 
            status={state.status} 
            thoughts={state.thoughts} 
            verificationLogs={state.verificationLogs}
            activeTutorial={state.activeTutorial}
          />
        </main>
      </div>

      <footer className="h-10 glass flex items-center px-6 justify-between text-[10px] text-slate-500 uppercase tracking-widest mono border-t border-slate-800/50">
        <div className="flex gap-6">
          <span className="text-cyan-500/80">AIN v4.0.0-CORE</span>
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Quantum Vault: SECURE</span>
        </div>
        <div className="flex gap-4 items-center">
          <span>Search Grounding: ACTIVE</span>
          <span className="w-px h-3 bg-slate-800"></span>
          <span>Cognition Load: {state.isOrchestrating ? "92%" : "2%"}</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
