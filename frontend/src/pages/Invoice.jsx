import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import api from '../services/api';

const Invoice = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = React.useState({ name: 'Loading...' });
  const [expenses, setExpenses] = React.useState([]);
  const [totals, setTotals] = React.useState({ spent: 0, budget: 0, remaining: 0 });
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Alex Traveler', email: 'alex@example.com' };

  React.useEffect(() => {
    if (tripId) {
      api.get(`/api/trips/${tripId}`)
        .then(res => {
          const t = res.data;
          setTrip(t);
          
          let exps = [];
          let totalB = 0;
          let totalS = 0;
          
          if (t.stops) {
            t.stops.forEach(stop => {
              totalB += (stop.budgetAllocated || 0);
              if (stop.activities) {
                stop.activities.forEach(act => {
                  totalS += (act.cost || 0);
                  exps.push({
                    id: act.id,
                    category: act.type || 'Activity',
                    description: act.title + ` (${stop.cityName})`,
                    qty: 1,
                    cost: act.cost,
                    amount: act.cost
                  });
                });
              }
            });
          }

          setExpenses(exps);
          setTotals({ spent: totalS, budget: totalB, remaining: totalB - totalS });
        })
        .catch(err => console.error(err));
    }
  }, [tripId]);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <button onClick={() => navigate(`/itinerary/${tripId}`)} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Itinerary
            </button>
            <button className="flex items-center px-4 py-2 bg-indigo-600 text-white font-medium text-sm rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Invoice Header */}
          <div className="p-8 md:p-12 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center">
                <FileText className="w-8 h-8 text-indigo-600 mr-3" /> INVOICE
              </h2>
              <p className="text-gray-500 mt-2">Trip: {trip.name} (ID: {tripId})</p>
            </div>
            <div className="mt-6 md:mt-0 text-left md:text-right">
              <p className="font-bold text-gray-900">Billed To:</p>
              <p className="text-gray-600">{user.name}</p>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-gray-600 mt-2 text-sm">Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Table */}
          <div className="p-8 md:p-12 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-3 px-4 font-bold text-gray-700">Category</th>
                  <th className="py-3 px-4 font-bold text-gray-700">Description</th>
                  <th className="py-3 px-4 font-bold text-gray-700 text-center">Qty</th>
                  <th className="py-3 px-4 font-bold text-gray-700 text-right">Unit Cost</th>
                  <th className="py-3 px-4 font-bold text-gray-700 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-gray-800 font-medium">{item.category}</td>
                    <td className="py-4 px-4 text-gray-600">{item.description}</td>
                    <td className="py-4 px-4 text-gray-600 text-center">{item.qty}</td>
                    <td className="py-4 px-4 text-gray-600 text-right">${item.cost}</td>
                    <td className="py-4 px-4 text-gray-900 font-bold text-right">${item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="p-8 md:p-12 bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center">
             <div className="mb-6 md:mb-0">
               <p className="text-sm text-gray-500 mb-1">Payment Status</p>
               <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-bold rounded-full">Pending</span>
             </div>
             
             <div className="w-full md:w-1/3 space-y-3">
               <div className="flex justify-between text-gray-600">
                 <span>Total Budget:</span>
                 <span className="font-medium">${totals.budget}</span>
               </div>
               <div className="flex justify-between text-gray-900 font-bold text-xl pb-3 border-b border-gray-300">
                 <span>Total Spent:</span>
                 <span>${totals.spent}</span>
               </div>
               <div className="flex justify-between text-green-600 font-bold pt-1">
                 <span>Remaining Amount:</span>
                 <span>${totals.remaining}</span>
               </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Invoice;
