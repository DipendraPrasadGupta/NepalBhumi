import React from 'react';
import { Settings as SettingsIcon, Bell, Lock, Shield, CreditCard, Laptop } from 'lucide-react';

const Settings = () => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
    <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-slate-800/50 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-600/5 blur-[120px] rounded-full"></div>
      
      <div className="flex items-center gap-6 mb-12">
        <div className="p-4 bg-slate-800/50 rounded-3xl text-slate-400 border border-slate-700">
          <SettingsIcon size={32} />
        </div>
        <div>
          <h3 className="text-3xl font-black text-white tracking-tight">System Configuration</h3>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Operational Protocol & Security</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {[
          { label: 'Network Notifications', desc: 'Real-time asset movement alerts', icon: Bell },
          { label: 'Security & Encryption', desc: 'End-to-end operational privacy', icon: Lock },
          { label: 'Account Sovereignty', desc: 'Manage your platform identity', icon: Shield },
          { label: 'Financial Integration', desc: 'Subscription & Payout streams', icon: CreditCard },
          { label: 'Session Management', desc: 'Active terminal control', icon: Laptop }
        ].map((pref, i) => (
          <div key={i} className="group p-6 bg-slate-900/50 border border-slate-800 rounded-3xl hover:border-slate-700 hover:bg-slate-800/30 transition-all cursor-pointer">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-blue-400 transition-colors">
                <pref.icon size={24} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-black text-white">{pref.label}</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{pref.desc}</p>
              </div>
              <div className="w-12 h-6 bg-slate-800 rounded-full relative p-1">
                <div className="w-4 h-4 bg-slate-600 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Settings;
