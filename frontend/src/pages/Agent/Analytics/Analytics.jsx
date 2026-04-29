import React from 'react';
import { BarChart3, TrendingUp, Activity, Globe, PieChart, Info } from 'lucide-react';

const Analytics = () => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
    <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-slate-800/50 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden text-center">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/5 blur-[120px] rounded-full"></div>
      <div className="relative z-10 py-20">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-400 mx-auto mb-8 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
          <BarChart3 size={40} />
        </div>
        <h3 className="text-3xl font-black text-white tracking-tight mb-4">Market Analytics Engine</h3>
        <p className="text-slate-500 font-bold max-w-md mx-auto mb-10">Advanced geographic data and trend forecasting is being synchronized with your portfolio.</p>
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900/50 border border-slate-800 rounded-2xl">
          <Activity size={14} className="text-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Intelligence Feed Active</span>
        </div>
      </div>
    </div>
  </div>
);

export default Analytics;
