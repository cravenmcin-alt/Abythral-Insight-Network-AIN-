
import React, { useEffect, useState } from 'react';
import { QuantumSeal, QuantumLinkState } from '../types';
import { QuantumSecurityService } from '../services/quantumSecurityService';
import { QuantumInternetService } from '../services/quantumInternetService';

const SecurityMatrix: React.FC = () => {
  const [seal, setSeal] = useState<QuantumSeal | null>(null);
  const [link, setLink] = useState<QuantumLinkState | null>(null);
  const [entropySig, setEntropySig] = useState("");

  useEffect(() => {
    const update = async () => {
      const newSeal = await QuantumSecurityService.generateSeal("NEMESIS_ROOT");
      const newLink = await QuantumInternetService.establishEntanglement();
      setSeal(newSeal);
      setLink(newLink);
      setEntropySig(QuantumSecurityService.getEntropySignature());
    };
    update();
    const interval = setInterval(update, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!seal || !link) return null;

  return (
    <div className="glass rounded-xl border border-blue-500/30 bg-black/80 flex flex-col overflow-hidden h-full shadow-[0_0_40px_rgba(59,130,246,0.15)]">
      <div className="p-3 border-b border-blue-900/40 bg-blue-950/20 flex justify-between items-center shrink-0">
        <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]"></div>
          QUANTUM_SECURITY_MATRIX
        </h3>
        <span className="text-[8px] mono text-blue-600 font-bold">PQC_ACTIVE</span>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar font-mono">
        <div className="space-y-1">
          <div className="text-[8px] text-slate-500 uppercase tracking-widest font-black">Lattice_Stability</div>
          <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6] transition-all duration-1000" 
              style={{ width: `${seal.latticeStability * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[7px] text-blue-400/60 font-black">
            <span>STABLE</span>
            <span>{(seal.latticeStability * 100).toFixed(4)}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-white/[0.02] border border-white/5 rounded">
            <div className="text-[7px] text-slate-600 uppercase mb-1">Entangled_Pairs</div>
            <div className="text-sm text-white font-black">{link.eprPairCount}</div>
          </div>
          <div className="p-2 bg-white/[0.02] border border-white/5 rounded">
            <div className="text-[7px] text-slate-600 uppercase mb-1">Decoherence</div>
            <div className="text-sm text-blue-500 font-black">{(link.decoherenceRate * 100).toFixed(6)}%</div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="border-t border-white/5 pt-3">
            <div className="text-[8px] text-blue-500 font-black uppercase mb-2 tracking-tighter">Dilithium_Signature</div>
            <div className="text-[9px] text-slate-300 break-all leading-tight bg-black p-2 rounded border border-white/5">
              {seal.signatureDilithium}
            </div>
          </div>
          <div>
            <div className="text-[8px] text-blue-500 font-black uppercase mb-2 tracking-tighter">Entropy_Hash</div>
            <div className="text-[9px] text-slate-300 break-all leading-tight bg-black p-2 rounded border border-white/5">
              {entropySig}
            </div>
          </div>
        </div>
      </div>

      <div className="p-2 bg-blue-950/10 border-t border-blue-500/10 text-[7px] mono text-blue-800 uppercase font-black tracking-widest text-center">
        MANIFOLD: {link.manifoldDimension}
      </div>
    </div>
  );
};

export default SecurityMatrix;
