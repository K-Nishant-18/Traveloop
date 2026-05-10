import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  PieChart, 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  Calendar,
  Sparkles,
  Award,
  Wallet,
  AlertTriangle
} from 'lucide-react';
import api from '../services/api';

const Budget = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState({ name: 'Expedition Finance', startDate: '', endDate: '' });
  const [budgetData, setBudgetData] = useState({
    totalBudget: 0,
    totalSpent: 0,
    categories: []
  });
  const [overBudgetStops, setOverBudgetStops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tripId) {
      api.get(`/api/trips/${tripId}`)
        .then(res => {
          const tripDetails = res.data;
          setTrip(tripDetails);

          let totalB = 0;
          let totalS = 0;
          const overs = [];

          const catMap = {
            'SIGHTSEEING': { name: 'Sightseeing', spent: 0, color: '#6366f1', textClass: 'text-indigo-400' },
            'FOOD': { name: 'Food & Dining', spent: 0, color: '#f59e0b', textClass: 'text-amber-400' },
            'TRANSIT': { name: 'Transit / Flights', spent: 0, color: '#0ea5e9', textClass: 'text-sky-400' },
            'OTHER': { name: 'Other Services', spent: 0, color: '#a855f7', textClass: 'text-purple-400' }
          };

          if (tripDetails.stops) {
            tripDetails.stops.forEach(stop => {
              totalB += (stop.budgetAllocated || 0);
              let stopSpent = 0;

              if (stop.activities) {
                stop.activities.forEach(act => {
                  const cost = act.cost || 0;
                  totalS += cost;
                  stopSpent += cost;

                  const type = act.type || 'OTHER';
                  if (catMap[type]) {
                    catMap[type].spent += cost;
                  } else {
                    catMap['OTHER'].spent += cost;
                  }
                });
              }

              // Check if specific stop exceeded its specific budget allocated
              if (stopSpent > (stop.budgetAllocated || 0)) {
                overs.push({
                  cityName: stop.cityName,
                  allocated: stop.budgetAllocated,
                  spent: stopSpent,
                  overage: stopSpent - stop.budgetAllocated
                });
              }
            });
          }

          setBudgetData({
            totalBudget: totalB,
            totalSpent: totalS,
            categories: Object.values(catMap).filter(c => c.spent > 0)
          });
          setOverBudgetStops(overs);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [tripId]);

  const remaining = budgetData.totalBudget - budgetData.totalSpent;
  const percentageSpent = budgetData.totalBudget === 0 ? 0 : Math.round((budgetData.totalSpent / budgetData.totalBudget) * 100);

  // Calculate duration and average daily cost
  const getAverageDailyCost = () => {
    if (!trip.startDate || !trip.endDate) return 0;
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays === 0 ? 0 : Math.round(budgetData.totalSpent / diffDays);
  };

  // Generate SVG Donut parameters
  const getDonutSegments = () => {
    let currentAngle = 0;
    const total = budgetData.totalSpent || 1; // avoid divide by zero
    
    return budgetData.categories.map(cat => {
      const percentage = (cat.spent / total);
      const angle = percentage * 360;
      const segment = {
        ...cat,
        percentage: Math.round(percentage * 100),
        startAngle: currentAngle,
        endAngle: currentAngle + angle
      };
      currentAngle += angle;
      return segment;
    });
  };

  // Helper to draw SVG paths
  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };

  const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return [
      'M', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(' ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500 rounded-full opacity-10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500 rounded-full opacity-10 blur-[120px]" />
      </div>

      {/* Nav header */}
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <button 
              onClick={() => navigate(`/itinerary/${tripId}`)} 
              className="flex items-center text-slate-400 hover:text-white transition-colors gap-2 font-semibold text-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Itinerary
            </button>
            <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 items-center">
              <button onClick={() => navigate(`/itinerary/${tripId}`)} className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl transition-all">Itinerary</button>
              <button onClick={() => navigate(`/itinerary/${tripId}/budget`)} className="px-4 py-2 text-xs font-bold text-indigo-400 bg-white/5 rounded-xl transition-all">Budget</button>
              <button onClick={() => navigate(`/itinerary/${tripId}/checklist`)} className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl transition-all">Checklist</button>
              <button onClick={() => navigate(`/itinerary/${tripId}/notes`)} className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl transition-all">Notes</button>
              <button onClick={() => navigate(`/itinerary/${tripId}/invoice`)} className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl transition-all">Invoice</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Budget Dashboard */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative z-10 space-y-8">
        
        {/* Title details bar */}
        {loading ? (
          <div className="p-12 text-center bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400">Loading audit balances...</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-2 relative overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 text-emerald-400">
                <Wallet className="w-4 h-4" />
                <span className="text-xs font-bold tracking-widest uppercase">Budget & Financial Analytics</span>
              </div>
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200">
                {trip.name} Balance Audit
              </h1>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 font-semibold">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {trip.startDate} to {trip.endDate}
              </p>
            </div>

            {/* Total cards row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center justify-between shadow-xl">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Total Limit</span>
                  <span className="text-2xl font-black text-white">${budgetData.totalBudget}</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center justify-between shadow-xl">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Total Spent</span>
                  <span className="text-2xl font-black text-rose-400">${budgetData.totalSpent}</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center justify-between shadow-xl">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Remaining</span>
                  <span className={`text-2xl font-black ${remaining < 0 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                    ${remaining}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <Award className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center justify-between shadow-xl">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Daily Average</span>
                  <span className="text-2xl font-black text-indigo-300">${getAverageDailyCost()}<span className="text-[10px] text-slate-500">/day</span></span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Analytics Layout: Chart vs breakdown list */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Left Column: Custom SVG Donut Chart */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:col-span-5 flex flex-col items-center justify-center text-center space-y-6 shadow-2xl">
                <div className="w-full flex justify-between items-center border-b border-white/5 pb-3">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <PieChart className="w-4 h-4 text-indigo-400" />
                    Donut Breakdown
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                    percentageSpent > 80 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {percentageSpent}% Exhausted
                  </span>
                </div>

                {budgetData.totalSpent === 0 ? (
                  <div className="py-12 flex flex-col items-center gap-3">
                    <AlertCircle className="w-10 h-10 text-slate-600" />
                    <p className="text-xs text-slate-500 italic max-w-xs">No active expenses logged. Add stop itinerary activities with cost parameters to render financial charts.</p>
                  </div>
                ) : (
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    {/* SVG Vector Drawing */}
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="10" />
                      {getDonutSegments().map((seg, idx) => {
                        const strokeDash = seg.percentage * 2.512; // percentage relative to 2 * PI * R
                        let dashOffset = 0;
                        getDonutSegments().slice(0, idx).forEach(s => {
                          dashOffset += s.percentage * 2.512;
                        });
                        return (
                          <circle
                            key={idx}
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            stroke={seg.color}
                            strokeWidth="10"
                            strokeDasharray={`${strokeDash} 251.2`}
                            strokeDashoffset={-dashOffset}
                            className="transition-all duration-700 hover:stroke-[12] cursor-pointer"
                            title={`${seg.name}: ${seg.percentage}%`}
                          />
                        );
                      })}
                    </svg>
                    {/* Inner hole total spent text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-0.5">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Total Spent</span>
                      <span className="text-2xl font-black text-white">${budgetData.totalSpent}</span>
                    </div>
                  </div>
                )}
                
                {/* SVG Legends */}
                <div className="flex flex-wrap gap-4 justify-center">
                  {budgetData.categories.map((cat, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      {cat.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Breakdown bars & Warnings alert block */}
              <div className="md:col-span-7 space-y-6">
                
                {/* Visual Categorized breakdown bar list */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-white/5 pb-3">
                    Budget Distribution Metrics
                  </h3>

                  <div className="space-y-4">
                    {budgetData.categories.map((cat, idx) => {
                      const share = Math.round((cat.spent / (budgetData.totalSpent || 1)) * 100);
                      return (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                            <span className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                              {cat.name}
                            </span>
                            <span>${cat.spent} <span className="text-[10px] text-slate-500 font-normal">({share}%)</span></span>
                          </div>
                          <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                            <div 
                              className="h-2.5 rounded-full transition-all duration-700" 
                              style={{ width: `${share}%`, backgroundColor: cat.color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* LIMITS WARNINGS (Exceeded Stops alerts!) */}
                {overBudgetStops.length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-6 space-y-4 shadow-xl">
                    <div className="flex items-center gap-2 text-rose-400">
                      <AlertTriangle className="w-5 h-5 shrink-0" />
                      <h4 className="text-sm font-bold uppercase tracking-wider">Over Budget Destination Stops Detected!</h4>
                    </div>

                    <div className="space-y-3">
                      {overBudgetStops.map((obs, i) => (
                        <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/5">
                          <div>
                            <span className="font-bold text-sm text-white block">{obs.cityName}</span>
                            <span className="text-[10px] text-slate-400 font-semibold">Allocated limit: <span className="text-slate-300 font-bold">${obs.allocated}</span></span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-black text-rose-400 block">${obs.spent} Spent</span>
                            <span className="text-[10px] text-red-400 font-bold">Exceeded by ${obs.overage}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Overarching 80% Spent Warning limit */}
                {percentageSpent > 80 && overBudgetStops.length === 0 && (
                  <div className="p-5 bg-amber-500/15 border border-amber-500/20 rounded-3xl flex items-start gap-4">
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-amber-200">Exhaustion Threshold Alert</h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        You have expended over 80% of your global trip parameters. Plan wisely before scheduling further transits or gourmet dining.
                      </p>
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default Budget;
