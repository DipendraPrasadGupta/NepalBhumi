import React, { useState } from 'react';
import { Info, Check, MapPin, Zap, TrendingUp, Smartphone, HelpCircle } from 'lucide-react';

function LandAreaConversion() {
  const [activeTab, setActiveTab] = useState('hill');
  const [hillInputs, setHillInputs] = useState({ ropaani: '', aana: '', paisa: '', dam: '' });
  const [teralInputs, setTeralInputs] = useState({ bigha: '', katha: '', dhur: '' });
  const [intlInputs, setIntlInputs] = useState({ sqft: '', sqm: '', acre: '', hectare: '' });
  const [results, setResults] = useState({});
  const [showResults, setShowResults] = useState(false);

  const conversionFactors = {
    ropaani: { aana: 8, paisa: 32, dam: 128, bigha: 0.4286, katha: 2.5, dhur: 5, sqft: 5440, sqm: 505.8, acre: 0.125, hectare: 0.0505 },
    aana: { ropaani: 0.125, paisa: 4, dam: 16, bigha: 0.0536, katha: 0.3125, dhur: 0.625, sqft: 680, sqm: 63.225, acre: 0.0156, hectare: 0.0063 },
    paisa: { ropaani: 0.03125, aana: 0.25, dam: 4, bigha: 0.0134, katha: 0.0781, dhur: 0.1563, sqft: 170, sqm: 15.8, acre: 0.0039, hectare: 0.0016 },
    dam: { ropaani: 0.0078, aana: 0.0625, paisa: 0.25, bigha: 0.00335, katha: 0.0195, dhur: 0.039, sqft: 42.5, sqm: 3.95, acre: 0.00098, hectare: 0.0004 },
    bigha: { katha: 5.86, dhur: 11.72, ropaani: 2.33, aana: 18.67, paisa: 74.67, dam: 298.67, sqft: 12710, sqm: 1180, acre: 0.292, hectare: 0.118 },
    katha: { bigha: 0.1707, dhur: 2, ropaani: 0.398, aana: 3.186, paisa: 12.744, dam: 50.976, sqft: 2170, sqm: 201.5, acre: 0.0499, hectare: 0.0202 },
    dhur: { bigha: 0.0854, katha: 0.5, ropaani: 0.199, aana: 1.593, paisa: 6.372, dam: 25.488, sqft: 1085, sqm: 100.8, acre: 0.0249, hectare: 0.0101 },
    sqft: { sqm: 0.092903, acre: 0.0000229568, hectare: 0.0000091411, ropaani: 0.0001838, aana: 0.00147, paisa: 0.00588, dam: 0.0235, bigha: 0.0000787, katha: 0.000461, dhur: 0.000921 },
    sqm: { sqft: 10.7639, acre: 0.000247105, hectare: 0.0001, ropaani: 0.00198, aana: 0.01584, paisa: 0.06336, dam: 0.253, bigha: 0.000848, katha: 0.00497, dhur: 0.00993 },
    acre: { sqft: 43560, sqm: 4046.86, hectare: 0.404686, ropaani: 8, aana: 64, paisa: 256, dam: 1024, bigha: 3.43, katha: 20, dhur: 40 },
    hectare: { sqft: 107639, sqm: 10000, acre: 2.47105, ropaani: 19.76, aana: 158.08, paisa: 632.32, dam: 2529.28, bigha: 8.47, katha: 49.6, dhur: 99.2 }
  };

  const handleHillInput = (field, value) => {
    
    const newInputs = { ...hillInputs, [field]: value };
    setHillInputs(newInputs);
    if (value) {
      const factor = conversionFactors[field];
      setResults({
        ropaani: (value * factor.ropaani).toFixed(3),
        aana: (value * factor.aana).toFixed(3),
        paisa: (value * factor.paisa).toFixed(3),
        dam: (value * factor.dam).toFixed(3),
        bigha: (value * factor.bigha).toFixed(3),
        katha: (value * factor.katha).toFixed(3),
        dhur: (value * factor.dhur).toFixed(3),
        sqft: (value * factor.sqft).toFixed(2),
        sqm: (value * factor.sqm).toFixed(2),
        acre: (value * factor.acre).toFixed(4),
        hectare: (value * factor.hectare).toFixed(4)
      });
      setShowResults(true);
    }
  };

  const handleTeralInput = (field, value) => {
    const newInputs = { ...teralInputs, [field]: value };
    setTeralInputs(newInputs);
    if (value) {
      const factor = conversionFactors[field];
      setResults({
        bigha: (value * factor.bigha).toFixed(3),
        katha: (value * factor.katha).toFixed(3),
        dhur: (value * factor.dhur).toFixed(3),
        ropaani: (value * factor.ropaani).toFixed(3),
        aana: (value * factor.aana).toFixed(3),
        paisa: (value * factor.paisa).toFixed(3),
        dam: (value * factor.dam).toFixed(3),
        sqft: (value * factor.sqft).toFixed(2),
        sqm: (value * factor.sqm).toFixed(2),
        acre: (value * factor.acre).toFixed(4),
        hectare: (value * factor.hectare).toFixed(4)
      });
      setShowResults(true);
    }
  };

  const handleIntlInput = (field, value) => {
    const newInputs = { ...intlInputs, [field]: value };
    setIntlInputs(newInputs);
    if (value) {
      const factor = conversionFactors[field];
      setResults({
        sqft: (value * factor.sqft).toFixed(2),
        sqm: (value * factor.sqm).toFixed(2),
        acre: (value * factor.acre).toFixed(4),
        hectare: (value * factor.hectare).toFixed(4),
        ropaani: (value * factor.ropaani).toFixed(3),
        aana: (value * factor.aana).toFixed(3),
        paisa: (value * factor.paisa).toFixed(3),
        dam: (value * factor.dam).toFixed(3),
        bigha: (value * factor.bigha).toFixed(3),
        katha: (value * factor.katha).toFixed(3),
        dhur: (value * factor.dhur).toFixed(3)
      });
      setShowResults(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
              <MapPin size={32} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">Land Unit Converter</h1>
          </div>
          <p className="text-slate-300 text-lg">Convert between Nepal's traditional land units and international standards</p>
        </div>

        {/* Tab System */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 bg-slate-800/30 p-4 rounded-xl backdrop-blur-xl border border-slate-700">
            <button
              onClick={() => { setActiveTab('hill'); setShowResults(false); setHillInputs({}); }}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${activeTab === 'hill' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
            >
              Hill System
            </button>
            <button
              onClick={() => { setActiveTab('teral'); setShowResults(false); setTeralInputs({}); }}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${activeTab === 'teral' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
            >
              Teral System
            </button>
            <button
              onClick={() => { setActiveTab('intl'); setShowResults(false); setIntlInputs({}); }}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${activeTab === 'intl' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
            >
              International System
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Info size={24} className="text-blue-400" />
                Enter Values ({activeTab === 'hill' ? 'Hill System' : activeTab === 'teral' ? 'Teral System' : 'International System'})
              </h2>

              {/* Hill System Inputs */}
              {activeTab === 'hill' && (
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-2">Ropaani</label>
                    <input
                      type="number"
                      value={hillInputs.ropaani || ''}
                      onChange={(e) => handleHillInput('ropaani', parseFloat(e.target.value) || '')}
                      placeholder="0"
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-2">Aana</label>
                    <input
                      type="number"
                      value={hillInputs.aana || ''}
                      onChange={(e) => handleHillInput('aana', parseFloat(e.target.value) || '')}
                      placeholder="0"
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-2">Paisa</label>
                    <input
                      type="number"
                      value={hillInputs.paisa || ''}
                      onChange={(e) => handleHillInput('paisa', parseFloat(e.target.value) || '')}
                      placeholder="0"
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-2">Dam</label>
                    <input
                      type="number"
                      value={hillInputs.dam || ''}
                      onChange={(e) => handleHillInput('dam', parseFloat(e.target.value) || '')}
                      placeholder="0"
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Teral System Inputs */}
              {activeTab === 'teral' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-2">Bigha</label>
                    <input
                      type="number"
                      value={teralInputs.bigha || ''}
                      onChange={(e) => handleTeralInput('bigha', parseFloat(e.target.value) || '')}
                      placeholder="0"
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-2">Katha</label>
                    <input
                      type="number"
                      value={teralInputs.katha || ''}
                      onChange={(e) => handleTeralInput('katha', parseFloat(e.target.value) || '')}
                      placeholder="0"
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-2">Dhur</label>
                    <input
                      type="number"
                      value={teralInputs.dhur || ''}
                      onChange={(e) => handleTeralInput('dhur', parseFloat(e.target.value) || '')}
                      placeholder="0"
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* International System Inputs */}
              {activeTab === 'intl' && (
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-2">Square Feet</label>
                    <input
                      type="number"
                      value={intlInputs.sqft || ''}
                      onChange={(e) => handleIntlInput('sqft', parseFloat(e.target.value) || '')}
                      placeholder="0"
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-2">Square Meters</label>
                    <input
                      type="number"
                      value={intlInputs.sqm || ''}
                      onChange={(e) => handleIntlInput('sqm', parseFloat(e.target.value) || '')}
                      placeholder="0"
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-2">Acres</label>
                    <input
                      type="number"
                      value={intlInputs.acre || ''}
                      onChange={(e) => handleIntlInput('acre', parseFloat(e.target.value) || '')}
                      placeholder="0"
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-2">Hectares</label>
                    <input
                      type="number"
                      value={intlInputs.hectare || ''}
                      onChange={(e) => handleIntlInput('hectare', parseFloat(e.target.value) || '')}
                      placeholder="0"
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Feature Cards */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-500/20 border border-blue-600/30 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Check size={20} className="text-blue-400" />
                <h3 className="font-semibold text-white">Instant Results</h3>
              </div>
              <p className="text-sm text-slate-300">Real-time conversion with detailed breakdown</p>
            </div>
            <div className="bg-gradient-to-br from-green-600/20 to-green-500/20 border border-green-600/30 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp size={20} className="text-green-400" />
                <h3 className="font-semibold text-white">Bidirectional</h3>
              </div>
              <p className="text-sm text-slate-300">Convert any way - Hill, Teral, International</p>
            </div>
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-500/20 border border-purple-600/30 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Smartphone size={20} className="text-purple-400" />
                <h3 className="font-semibold text-white">Mobile Friendly</h3>
              </div>
              <p className="text-sm text-slate-300">Works seamlessly on all devices</p>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {showResults && (
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Check size={24} className="text-green-400" />
              Convert To: All Systems
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {results.ropaani && (
                <>
                  <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <p className="text-slate-400 text-sm font-medium mb-1">Ropaani</p>
                    <p className="text-white font-bold text-lg">{results.ropaani}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <p className="text-slate-400 text-sm font-medium mb-1">Aana</p>
                    <p className="text-white font-bold text-lg">{results.aana}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <p className="text-slate-400 text-sm font-medium mb-1">Paisa</p>
                    <p className="text-white font-bold text-lg">{results.paisa}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <p className="text-slate-400 text-sm font-medium mb-1">Dam</p>
                    <p className="text-white font-bold text-lg">{results.dam}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <p className="text-slate-400 text-sm font-medium mb-1">Bigha</p>
                    <p className="text-white font-bold text-lg">{results.bigha}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <p className="text-slate-400 text-sm font-medium mb-1">Katha</p>
                    <p className="text-white font-bold text-lg">{results.katha}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <p className="text-slate-400 text-sm font-medium mb-1">Dhur</p>
                    <p className="text-white font-bold text-lg">{results.dhur}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <p className="text-slate-400 text-sm font-medium mb-1">Sq Feet</p>
                    <p className="text-white font-bold text-lg">{results.sqft}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <p className="text-slate-400 text-sm font-medium mb-1">Sq Meters</p>
                    <p className="text-white font-bold text-lg">{results.sqm}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <p className="text-slate-400 text-sm font-medium mb-1">Acres</p>
                    <p className="text-white font-bold text-lg">{results.acre}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <p className="text-slate-400 text-sm font-medium mb-1">Hectares</p>
                    <p className="text-white font-bold text-lg">{results.hectare}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Information Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* How to Use */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Zap size={24} className="text-yellow-400" />
              How to Use the Converter
            </h3>
            <ol className="space-y-3 text-slate-300">
              <li className="flex gap-3">
                <span className="text-blue-400 font-bold">1.</span>
                <span>Select your measurement system (Hill, Teral, or International)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-400 font-bold">2.</span>
                <span>Enter values in appropriate unit fields</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-400 font-bold">3.</span>
                <span>View instant conversions in all units</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-400 font-bold">4.</span>
                <span>Use for property deals and land transactions</span>
              </li>
            </ol>
          </div>

          {/* Reference Information */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <HelpCircle size={24} className="text-cyan-400" />
              Understanding Nepal's Systems
            </h3>
            <div className="space-y-4 text-sm text-slate-300">
              <div>
                <p className="font-semibold text-blue-400 mb-1">Hill System (Pahadi)</p>
                <p>1 Ropaani = 16 Aana = 64 Paisa = 256 Dam</p>
              </div>
              <div>
                <p className="font-semibold text-green-400 mb-1">Teral System (Tarai)</p>
                <p>1 Bigha = 20 Katha = 40 Dhur</p>
              </div>
              <div>
                <p className="font-semibold text-purple-400 mb-1">International</p>
                <p>1 Acre = 0.404686 hectares = 43,560 sq ft</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">What's the difference between Hill and Teral?</h4>
              <p className="text-sm text-slate-300">Hill system (Pahadi) is used in hilly regions, while Teral system (Tarai) is used in plains. They have different conversion ratios.</p>
            </div>
            <div>
              <h4 className="font-semibold text-green-400 mb-2">Which system should I use?</h4>
              <p className="text-sm text-slate-300">Use Hill system for hill regions, Teral for plains, and International for international property transactions.</p>
            </div>
            <div>
              <h4 className="font-semibold text-purple-400 mb-2">How accurate is this converter?</h4>
              <p className="text-sm text-slate-300">Conversions are precise for standard official measurements, though local variations may exist.</p>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-400 mb-2">Can I use this for legal transactions?</h4>
              <p className="text-sm text-slate-300">Use this as a reference. For legal property transactions, always consult official land surveyors.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandAreaConversion;
