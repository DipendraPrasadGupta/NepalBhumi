import React, { useState } from 'react';
import { Zap, Home, Info } from 'lucide-react';

function ElectricityCalculator() {
  const [formData, setFormData] = useState({
    units: '',
    ratePerUnit: 12, // Default rate for Nepal (NPR per unit)
    appliances: []
  });

  const [appliances, setAppliances] = useState([
    { id: 1, name: 'Fan', wattage: 60, hours: 5, quantity: 1 },
    { id: 2, name: 'Light Bulb (LED)', wattage: 10, hours: 6, quantity: 3 },
    { id: 3, name: 'Refrigerator', wattage: 150, hours: 20, quantity: 1 },
  ]);

  const [showAppliances, setShowAppliances] = useState(false);
  const [newAppliance, setNewAppliance] = useState({ name: '', wattage: '', hours: 1, quantity: 1 });

  const calculateUnits = () => {
    let totalUnits = 0;
    appliances.forEach(app => {
      const kw = (app.wattage * app.quantity) / 1000;
      totalUnits += kw * app.hours;
    });
    return totalUnits.toFixed(2);
  };

  const calculateCost = () => {
    const units = parseFloat(calculateUnits());
    return (units * formData.ratePerUnit).toFixed(2);
  };

  const handleAddAppliance = () => {
    if (newAppliance.name && newAppliance.wattage) {
      setAppliances([
        ...appliances,
        {
          id: Date.now(),
          ...newAppliance,
          wattage: parseFloat(newAppliance.wattage),
          hours: parseFloat(newAppliance.hours),
          quantity: parseFloat(newAppliance.quantity)
        }
      ]);
      setNewAppliance({ name: '', wattage: '', hours: 1, quantity: 1 });
    }
  };

  const handleDeleteAppliance = (id) => {
    setAppliances(appliances.filter(app => app.id !== id));
  };

  const handleUpdateAppliance = (id, field, value) => {
    setAppliances(appliances.map(app =>
      app.id === id ? { ...app, [field]: isNaN(value) ? value : parseFloat(value) } : app
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
              <Zap size={32} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">Electricity Calculator</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl">Calculate your monthly electricity consumption and estimated bill based on appliances</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Calculator */}
          <div className="lg:col-span-2 space-y-6">
            {/* Settings Section */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Info size={24} className="text-blue-400" />
                Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Rate per Unit (NPR)</label>
                  <input
                    type="number"
                    value={formData.ratePerUnit}
                    onChange={(e) => setFormData({ ...formData, ratePerUnit: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter rate per unit"
                  />
                  <p className="text-xs text-slate-400 mt-1">Current rate: NPR {formData.ratePerUnit} per unit</p>
                </div>
              </div>
            </div>

            {/* Appliances Section */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Home size={24} className="text-green-400" />
                  Your Appliances
                </h2>
                <button
                  onClick={() => setShowAppliances(!showAppliances)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                >
                  {showAppliances ? 'Hide Form' : 'Add Appliance'}
                </button>
              </div>

              {/* Add Appliance Form */}
              {showAppliances && (
                <div className="mb-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                  <h3 className="text-lg font-semibold text-white mb-4">Add New Appliance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                    <input
                      type="text"
                      placeholder="Appliance name"
                      value={newAppliance.name}
                      onChange={(e) => setNewAppliance({ ...newAppliance, name: e.target.value })}
                      className="px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Wattage (W)"
                      value={newAppliance.wattage}
                      onChange={(e) => setNewAppliance({ ...newAppliance, wattage: e.target.value })}
                      className="px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Hours/day"
                      value={newAppliance.hours}
                      onChange={(e) => setNewAppliance({ ...newAppliance, hours: e.target.value })}
                      className="px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={newAppliance.quantity}
                      onChange={(e) => setNewAppliance({ ...newAppliance, quantity: e.target.value })}
                      className="px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleAddAppliance}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition text-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {/* Appliances List */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-slate-300">
                  <thead className="bg-slate-700/50 border-b border-slate-600">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Appliance</th>
                      <th className="px-4 py-3 text-center font-semibold">Wattage (W)</th>
                      <th className="px-4 py-3 text-center font-semibold">Hours/Day</th>
                      <th className="px-4 py-3 text-center font-semibold">Qty</th>
                      <th className="px-4 py-3 text-center font-semibold">Daily (kWh)</th>
                      <th className="px-4 py-3 text-center font-semibold">Monthly (kWh)</th>
                      <th className="px-4 py-3 text-center font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {appliances.map(app => {
                      const dailyKwh = ((app.wattage * app.quantity * app.hours) / 1000).toFixed(2);
                      const monthlyKwh = (dailyKwh * 30).toFixed(2);
                      return (
                        <tr key={app.id} className="hover:bg-slate-700/30">
                          <td className="px-4 py-3">{app.name}</td>
                          <td className="px-4 py-3 text-center">{app.wattage}</td>
                          <td className="px-4 py-3 text-center">{app.hours}</td>
                          <td className="px-4 py-3 text-center">{app.quantity}</td>
                          <td className="px-4 py-3 text-center">{dailyKwh}</td>
                          <td className="px-4 py-3 text-center font-semibold text-green-400">{monthlyKwh}</td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleDeleteAppliance(app.id)}
                              className="px-2 py-1 bg-red-600/20 text-red-400 hover:bg-red-600/40 rounded transition text-xs"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 border border-blue-500/30">
              <h3 className="text-lg font-semibold text-blue-100 mb-6">Monthly Summary</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-blue-200 text-sm font-medium mb-1">Total Consumption</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white">{calculateUnits()}</span>
                    <span className="text-blue-200 font-semibold">kWh</span>
                  </div>
                </div>
                <div className="border-t border-blue-500/30 pt-4">
                  <p className="text-blue-200 text-sm font-medium mb-1">Estimated Bill</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">NPR</span>
                    <span className="text-3xl font-bold text-yellow-300">{calculateCost()}</span>
                  </div>
                </div>
                <div className="border-t border-blue-500/30 pt-4">
                  <p className="text-blue-200 text-sm font-medium mb-1">Daily Average</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">{(calculateUnits() / 30).toFixed(2)}</span>
                    <span className="text-blue-200 font-semibold">kWh/day</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">💡 Energy Saving Tips</h3>
              <ul className="space-y-3 text-slate-300 text-sm">
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>Use LED bulbs instead of incandescent bulbs</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>Turn off appliances when not in use</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>Use fans instead of AC when possible</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>Keep refrigerator at optimal temperature</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>Use natural light during the day</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ElectricityCalculator;
