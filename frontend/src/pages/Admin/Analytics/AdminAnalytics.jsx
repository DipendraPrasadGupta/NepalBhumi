import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, Legend, LineChart, Line
} from 'recharts';
import { 
  TrendingUp, Users, Home, Activity, Map, 
  ArrowUpRight, ArrowDownRight, Calendar, Filter, Download 
} from 'lucide-react';

const AdminAnalytics = ({ analyticsData, users = [], allProperties = [] }) => {
  const [timeRange, setTimeRange] = React.useState('all'); // 'all' or '30d'
  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

  const getFilteredData = () => {
    if (timeRange === 'all') return { users, properties: allProperties };
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return {
      users: users.filter(u => new Date(u.createdAt) > thirtyDaysAgo),
      properties: allProperties.filter(p => new Date(p.createdAt) > thirtyDaysAgo)
    };
  };

  const filtered = getFilteredData();

  const handleExport = () => {
    const csvRows = [
      ['Metric', 'Value'],
      ['Total Users', users.length],
      ['Recent Users (30d)', users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length],
      ['Total Properties', allProperties.length],
      ['Active Properties', allProperties.filter(p => p.status === 'active').length],
      ['City Coverage', [...new Set(allProperties.map(p => p.location?.city))].filter(Boolean).length],
      ['Generated At', new Date().toLocaleString()]
    ];

    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `NepalBhumi_Intelligence_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-4 rounded-2xl shadow-2xl">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <p className="text-sm font-bold text-white">
                {entry.name}: <span className="text-slate-300">{entry.value}</span>
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10 pb-20">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Intelligence Hub</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Real-time platform performance and growth metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setTimeRange(timeRange === 'all' ? '30d' : 'all')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all text-sm font-bold border ${
              timeRange === '30d' 
              ? 'bg-blue-500/20 border-blue-500 text-blue-400' 
              : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <Calendar size={16} />
            <span>{timeRange === 'all' ? 'Last 30 Days' : 'All Time'}</span>
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 rounded-xl text-white hover:bg-blue-700 transition-all text-sm font-bold shadow-lg shadow-blue-600/20"
          >
            <Download size={16} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: filtered.users.length, trend: '+12.5%', up: true, icon: Users, color: 'blue' },
          { label: 'Market Listings', value: filtered.properties.length, trend: '+8.2%', up: true, icon: Home, color: 'emerald' },
          { label: 'Active Status', value: filtered.properties.filter(p => p.status === 'active').length, trend: 'Live', up: true, icon: Activity, color: 'purple' },
          { label: 'City Coverage', value: [...new Set(filtered.properties.map(p => p.location?.city))].filter(Boolean).length, trend: 'Global', up: true, icon: TrendingUp, color: 'amber' },
        ].map((kpi, i) => (
          <div key={i} className="bg-[#0f172a]/40 backdrop-blur-xl border border-slate-800/50 p-6 rounded-[2rem] group hover:border-slate-700 transition-all relative overflow-hidden">
            <div className={`absolute -top-10 -right-10 w-32 h-32 bg-${kpi.color}-500/5 blur-[50px] rounded-full`}></div>
            <div className="flex items-start justify-between relative z-10">
              <div className={`p-3 bg-${kpi.color}-500/10 rounded-2xl text-${kpi.color}-400`}>
                <kpi.icon size={20} />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black ${kpi.up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                {kpi.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {kpi.trend}
              </div>
            </div>
            <div className="mt-6 relative z-10">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{kpi.label}</p>
              <h4 className="text-3xl font-black text-white mt-1 tracking-tight">{kpi.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Growth Area Chart */}
        <div className="lg:col-span-8 bg-[#0f172a]/40 backdrop-blur-xl border border-slate-800/50 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div>
              <h3 className="text-xl font-black text-white tracking-tight">Platform Growth</h3>
              <p className="text-slate-500 text-xs font-medium mt-1">User acquisition over the last 6 months</p>
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">New Registrations</span>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData.userGrowth}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{fontWeight: 700}}
                />
                <YAxis 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{fontWeight: 700}}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  name="New Users"
                  stroke="#3b82f6" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorUsers)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Property Type Pie Chart */}
        <div className="lg:col-span-4 bg-[#0f172a]/40 backdrop-blur-xl border border-slate-800/50 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
          <h3 className="text-xl font-black text-white tracking-tight mb-2">Inventory Mix</h3>
          <p className="text-slate-500 text-xs font-medium mb-8">Property category distribution</p>
          
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.propertyTypes}
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={10}
                  dataKey="value"
                  animationBegin={500}
                >
                  {analyticsData.propertyTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-white">{analyticsData.propertyTypes.reduce((a, b) => a + b.value, 0)}</span>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Total Assets</span>
            </div>
          </div>

          <div className="mt-10 space-y-4">
            {analyticsData.propertyTypes.map((type, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-900/40 rounded-2xl border border-slate-800/50 hover:border-slate-700 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-xs font-black text-slate-300 uppercase tracking-tight">{type.name}</span>
                </div>
                <span className="text-xs font-black text-white">{type.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Engagement Bar Chart */}
        <div className="lg:col-span-7 bg-[#0f172a]/40 backdrop-blur-xl border border-slate-800/50 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-white tracking-tight">Market Activity</h3>
              <p className="text-slate-500 text-xs font-medium mt-1">Weekly listings vs interactions</p>
            </div>
            <Filter size={18} className="text-slate-500 cursor-pointer hover:text-white transition-colors" />
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.monthlyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tick={{fontWeight: 700}} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tick={{fontWeight: 700}} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }} />
                <Bar dataKey="listings" name="Listings" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="inquiries" name="Inquiries" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="bookings" name="Bookings" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Geographic / Status Side Panels */}
        <div className="lg:col-span-5 space-y-8">
          {/* Status Distribution */}
          <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-slate-800/50 rounded-[2.5rem] p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <Activity className="text-emerald-400" size={20} />
              <h3 className="text-lg font-black text-white tracking-tight">Sales Pipeline</h3>
            </div>
            <div className="space-y-6">
              {analyticsData.propertyStatus?.map((status, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{status.name} Properties</span>
                    <span className="text-xs font-black text-white">{status.value}</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000" 
                      style={{ 
                        width: `${(status.value / analyticsData.propertyStatus.reduce((a, b) => a + b.value, 0)) * 100}%`,
                        backgroundColor: status.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* City Distribution */}
          <div className="bg-gradient-to-br from-blue-600/10 to-indigo-600/5 backdrop-blur-xl border border-blue-500/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Map size={150} />
            </div>
            <div className="flex items-center gap-3 mb-8">
              <Map className="text-blue-400" size={20} />
              <h3 className="text-lg font-black text-white tracking-tight">Geographic Reach</h3>
            </div>
            <div className="space-y-4 relative z-10">
              {analyticsData.cityDistribution?.map((city, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-xs font-bold text-white">{city.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-blue-400">{city.value} units</span>
                    <ArrowUpRight size={14} className="text-slate-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
