import React, { useState } from 'react';
import { 
  Settings, Save, AlertCircle, TrendingUp, CheckCircle, 
  Globe, Palette, Lock, DollarSign, BellRing, Share2, 
  Code, Mail, Phone, MapPin, Laptop, Smartphone,
  ChevronRight, Shield, Image as ImageIcon
} from 'lucide-react';

const AdminSettings = ({ 
  settings, setSettings, handleSettingsSave, loading, settingsSaved 
}) => {
  const [activeSubTab, setActiveSubTab] = useState('general');

  const subTabs = [
    { id: 'general', label: 'General Info', icon: Globe, description: 'Platform branding and contact' },
    { id: 'branding', label: 'Aesthetics', icon: Palette, description: 'Visual identity and themes' },
    { id: 'security', label: 'Security', icon: Shield, description: 'Access control and protection' },
    { id: 'financial', label: 'Financial', icon: DollarSign, description: 'Commissions and payments' },
    { id: 'integrations', label: 'Integrations', icon: Code, description: 'Third-party API services' },
  ];

  const renderContent = () => {
    switch (activeSubTab) {
      case 'general':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Platform Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={settings.platformName}
                    onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                    className="w-full pl-5 pr-5 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-bold text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Support Email</label>
                <input 
                  type="email" 
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-bold text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Hotline Number</label>
                <input 
                  type="text" 
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-bold text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Official Address</label>
                <input 
                  type="text" 
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-bold text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Platform Vision / Description</label>
              <textarea 
                value={settings.description}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                rows="4"
                className="w-full px-5 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium text-white resize-none"
              ></textarea>
            </div>
          </div>
        );
      case 'branding':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-900/30 p-6 rounded-[2rem] border border-slate-800/50 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <ImageIcon size={18} className="text-blue-400" />
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">Logo & Icons</h4>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-slate-800 rounded-2xl border border-dashed border-slate-600 flex items-center justify-center text-slate-500">
                    <ImageIcon size={24} />
                  </div>
                  <button className="px-4 py-2 bg-blue-600/10 text-blue-400 rounded-xl text-xs font-bold border border-blue-500/20 hover:bg-blue-600 hover:text-white transition-all">
                    Upload Logo
                  </button>
                </div>
              </div>
              <div className="bg-slate-900/30 p-6 rounded-[2rem] border border-slate-800/50 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <Palette size={18} className="text-purple-400" />
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">Theme Colors</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Primary</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-600 border border-white/20"></div>
                      <span className="text-xs text-white font-mono">#2563EB</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Accent</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-600 border border-white/20"></div>
                      <span className="text-xs text-white font-mono">#9333EA</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="p-6 bg-slate-900/30 rounded-[2rem] border border-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 border border-orange-500/20 flex items-center justify-center">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">Maintenance Mode</h4>
                  <p className="text-xs text-slate-500">Redirect users to a maintenance page during updates.</p>
                </div>
              </div>
              <button 
                onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${settings.maintenanceMode ? 'bg-orange-500' : 'bg-slate-700'}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="p-6 bg-slate-900/30 rounded-[2rem] border border-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                  <Lock size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">Two-Factor Auth</h4>
                  <p className="text-xs text-slate-500">Enforce extra security for administrative accounts.</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-slate-800 text-slate-500 rounded-lg text-[10px] font-black uppercase">Admin Only</span>
            </div>
          </div>
        );
      case 'financial':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
                  <TrendingUp size={28} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-white uppercase tracking-tight leading-none">Listing Commission</h4>
                  <p className="text-xs text-slate-500 mt-1">Platform fee deducted from successful property deals.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input 
                    type="number" 
                    value={settings.commissionsPercentage}
                    onChange={(e) => setSettings({...settings, commissionsPercentage: e.target.value})}
                    className="w-24 pl-5 pr-10 py-3 bg-slate-900 border border-slate-700 rounded-xl text-center text-lg font-black text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-black">%</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-slate-900/30 rounded-[2rem] border border-slate-800/50 space-y-4">
                <div className="flex items-center gap-3">
                  <DollarSign size={18} className="text-blue-400" />
                  <p className="text-xs font-black text-white uppercase tracking-widest">Base Currency</p>
                </div>
                <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-bold outline-none">
                  <option>Nepalese Rupee (NPR)</option>
                  <option>US Dollar (USD)</option>
                </select>
              </div>
              <div className="p-6 bg-slate-900/30 rounded-[2rem] border border-slate-800/50 space-y-4 opacity-50">
                <div className="flex items-center gap-3">
                  <Share2 size={18} className="text-purple-400" />
                  <p className="text-xs font-black text-white uppercase tracking-widest">Payment Gateway</p>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>eSewa / Khalti</span>
                  <span className="px-2 py-0.5 bg-slate-800 rounded-md text-[8px]">Auto-Config</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'integrations':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="p-6 bg-slate-900/30 rounded-[2rem] border border-slate-800/50 flex items-center justify-between group hover:border-slate-700 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                  <Code size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">Google Maps API</h4>
                  <p className="text-xs text-slate-500">Required for property location intelligence.</p>
                </div>
              </div>
              <button className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-700 transition-all">Configure</button>
            </div>
            <div className="p-6 bg-slate-900/30 rounded-[2rem] border border-slate-800/50 flex items-center justify-between group hover:border-slate-700 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                  <Share2 size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">Social Connect</h4>
                  <p className="text-xs text-slate-500">Manage API keys for social media sharing.</p>
                </div>
              </div>
              <button className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-700 transition-all">Configure</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="animate-in fade-in duration-700 space-y-10 pb-20">
      {/* Page Header */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative flex items-center justify-between bg-[#0f172a]/80 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-800/50 shadow-2xl">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl shadow-xl shadow-blue-600/20">
              <Settings size={28} className="animate-hover" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight leading-none">System Architecture</h3>
              <p className="text-slate-500 text-sm font-medium mt-1.5">Fine-tune platform parameters and security protocols.</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-900/50 rounded-xl border border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            System Health: Optimal
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Submenu Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-slate-800/50 rounded-[2rem] p-4 shadow-xl">
            {subTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`w-full flex flex-col items-start gap-1 p-4 rounded-2xl transition-all duration-300 text-left group mb-2 last:mb-0 ${
                  activeSubTab === tab.id 
                    ? 'bg-blue-600/10 border border-blue-500/20 shadow-lg' 
                    : 'hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl transition-colors ${
                    activeSubTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800 text-slate-500 group-hover:text-slate-300'
                  }`}>
                    <tab.icon size={18} />
                  </div>
                  <span className={`text-[13px] font-black tracking-tight transition-colors ${
                    activeSubTab === tab.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`}>
                    {tab.label}
                  </span>
                </div>
                <p className={`text-[10px] font-medium leading-tight ml-11 transition-colors ${
                  activeSubTab === tab.id ? 'text-blue-400/80' : 'text-slate-600 group-hover:text-slate-500'
                }`}>
                  {tab.description}
                </p>
              </button>
            ))}
          </div>

          <div className="p-6 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 rounded-[2rem] border border-slate-800/50 space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Shield size={80} />
            </div>
            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Status</h5>
            <div className="space-y-3 relative z-10">
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-slate-500">API Latency</span>
                <span className="text-emerald-400">24ms</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[85%] h-full bg-emerald-500"></div>
              </div>
              <p className="text-[9px] text-slate-600 italic">Security patches updated 2h ago</p>
            </div>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="lg:col-span-9 space-y-10">
          <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-slate-800/50 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden min-h-[500px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-800/50">
                <div>
                  <h4 className="text-xl font-black text-white tracking-tight flex items-center gap-3 capitalize">
                    {activeSubTab.replace('-', ' ')} Parameters
                  </h4>
                  <p className="text-slate-500 text-xs font-medium mt-1">Configure your platform experience below.</p>
                </div>
              </div>
              
              {renderContent()}
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-end gap-5">
            <button className="px-8 py-4 bg-slate-900/50 hover:bg-slate-800 text-slate-500 hover:text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest border border-slate-800 transition-all">
              Revert Changes
            </button>
            <button 
              onClick={handleSettingsSave}
              disabled={loading}
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all active:scale-95 flex items-center gap-3 group"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Propagating...</span>
                </>
              ) : (
                <>
                  <Save size={18} className="group-hover:scale-110 transition-transform" />
                  <span>Commit System Updates</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {settingsSaved && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 px-8 py-4 bg-emerald-500 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(16,185,129,0.3)] flex items-center gap-4 animate-in fade-in slide-in-from-bottom-12 duration-500 z-[100]">
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
            <CheckCircle size={20} />
          </div>
          <div>
            <p className="font-black text-sm uppercase tracking-tight">Configuration Synchronized</p>
            <p className="text-[10px] text-white/80 font-bold">All system parameters have been successfully updated.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
