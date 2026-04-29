import React from 'react';
import { MessageSquare, Users, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

const Inquiries = () => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
    <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-slate-800/50 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden text-center">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full"></div>
      <div className="relative z-10 py-20">
        <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center text-blue-400 mx-auto mb-8 border border-blue-500/20 shadow-2xl shadow-blue-500/10">
          <MessageSquare size={40} />
        </div>
        <h3 className="text-3xl font-black text-white tracking-tight mb-4">Client Communications Hub</h3>
        <p className="text-slate-500 font-bold max-w-md mx-auto mb-10">Your encrypted messaging terminal for handling client inquiries and negotiation streams is being initialized.</p>
        <div className="flex justify-center gap-4">
           {[
             { label: 'Unread', value: '0', icon: MessageSquare },
             { label: 'Active', value: '0', icon: Users },
             { label: 'SLA', value: '100%', icon: ShieldCheck }
           ].map((m, i) => (
             <div key={i} className="px-6 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{m.label}</p>
               <p className="text-xl font-black text-white">{m.value}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  </div>
);

export default Inquiries;
