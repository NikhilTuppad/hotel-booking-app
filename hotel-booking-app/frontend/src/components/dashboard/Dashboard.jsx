import { useEffect, useState, useMemo } from 'react';
import { getUserPlaces } from '../../api/placesApi.js';
import { getBookingsByPlace } from '../../api/bookingsApi.js';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import CountUp from 'react-countup';
import { format, subMonths, isSameMonth } from 'date-fns';
import { TrendingUp, Users, Home, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import TiltCard from '../ui/TiltCard.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function Dashboard({ user, logoutFn }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#94a3b8' : '#888';
  const gridColor = isDark ? '#334155' : '#f0f0f0';
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState([]);
  const [allBookings, setAllBookings] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: userPlaces } = await getUserPlaces();
        setPlaces(userPlaces);

        const bookingsPromises = userPlaces.map(place => getBookingsByPlace(place._id));
        const bookingsResponses = await Promise.all(bookingsPromises);
        
        let aggregatedBookings = [];
        bookingsResponses.forEach(res => {
           if (res.data && Array.isArray(res.data)) {
               aggregatedBookings = [...aggregatedBookings, ...res.data];
           }
        });

        // sort by date descending
        aggregatedBookings.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

        setAllBookings(aggregatedBookings);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const stats = useMemo(() => {
    let totalRevenue = 0;
    let totalBookings = allBookings.length;
    let cancelledBookings = 0;

    allBookings.forEach(b => {
      if (b.status === 'cancelled') {
        cancelledBookings++;
      } else {
        totalRevenue += (b.price || 0);
      }
    });

    const cancelRate = totalBookings > 0 ? ((cancelledBookings / totalBookings) * 100).toFixed(1) : 0;

    // Last 6 months chart data
    const chartData = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(new Date(), i);
      const monthStr = format(monthDate, 'MMM');
      
      let monthRevenue = 0;
      let monthBookings = 0;

      allBookings.forEach(b => {
        if (b.createdAt && isSameMonth(new Date(b.createdAt), monthDate)) {
           monthBookings++;
           if (b.status !== 'cancelled') {
             monthRevenue += (b.price || 0);
           }
        }
      });

      chartData.push({
        name: monthStr,
        revenue: monthRevenue,
        bookings: monthBookings
      });
    }

    return { totalRevenue, totalBookings, activePlaces: places.length, cancelRate, chartData };
  }, [allBookings, places]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 mt-8 animate-pulse">
        <div className="flex justify-between items-center mb-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded-full w-24"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-3xl"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-[350px] bg-gray-200 rounded-3xl"></div>
          <div className="h-[350px] bg-gray-200 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  return (
      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-2 mb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Welcome back, {user.name}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Here is what's happening with your properties today.</p>
          </div>
          <button onClick={logoutFn} className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 font-semibold rounded-full transition-colors active:scale-95 text-gray-700 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-gray-700">
            Log out
          </button>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
           <MetricCard 
             title="Total Revenue" 
             value={stats.totalRevenue} 
             prefix="₹" 
             icon={<TrendingUp className="text-brand w-6 h-6" />} 
             delay={0.1}
           />
           <MetricCard 
             title="Total Bookings" 
             value={stats.totalBookings} 
             icon={<Users className="text-blue-500 w-6 h-6" />} 
             delay={0.2}
           />
           <MetricCard 
             title="Active Properties" 
             value={stats.activePlaces} 
             icon={<Home className="text-green-500 w-6 h-6" />} 
             delay={0.3}
           />
           <MetricCard 
             title="Cancellation Rate" 
             value={stats.cancelRate} 
             suffix="%" 
             decimals={1}
             icon={<XCircle className="text-red-500 w-6 h-6" />} 
             delay={0.4}
           />
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-deep p-6 rounded-3xl shadow-premium border border-white/60 hover:shadow-glow transition-shadow duration-500">
              <h3 className="font-bold text-lg mb-6 text-gray-800 dark:text-gray-200">Revenue Analytics</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff385c" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ff385c" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: textColor, fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: textColor, fontSize: 12}} tickFormatter={(value) => `₹${value}`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)', backgroundColor: isDark ? '#1e293b' : '#fff', color: isDark ? '#fff' : '#000' }}
                      formatter={(value) => [`₹${value}`, "Revenue"]}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#ff385c" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </motion.div>

           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-deep p-6 rounded-3xl shadow-premium border border-white/60 hover:shadow-glow-blue transition-shadow duration-500">
              <h3 className="font-bold text-lg mb-6 text-gray-800 dark:text-gray-200">Booking Trends</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: textColor, fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: textColor, fontSize: 12}} allowDecimals={false} />
                    <Tooltip 
                       contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)', backgroundColor: isDark ? '#1e293b' : '#fff', color: isDark ? '#fff' : '#000' }}
                       cursor={{fill: isDark ? '#334155' : '#f9f9f9'}}
                    />
                    <Bar dataKey="bookings" fill="#0065FF" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </motion.div>
        </div>

        {/* RECENT BOOKINGS */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-deep rounded-3xl shadow-premium border border-white/60 overflow-hidden">
           <div className="p-6 border-b border-gray-100/50 dark:border-gray-800/50">
             <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">Recent Transactions</h3>
           </div>
           
           {allBookings.length === 0 ? (
             <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                <p>No bookings yet. Once guests start booking your places, they will appear here.</p>
             </div>
           ) : (
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                     <th className="p-4 font-semibold">Guest</th>
                     <th className="p-4 font-semibold">Place</th>
                     <th className="p-4 font-semibold">Dates</th>
                     <th className="p-4 font-semibold">Amount</th>
                     <th className="p-4 font-semibold">Status</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                   {allBookings.slice(0, 5).map(booking => (
                     <tr key={booking._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group cursor-default">
                       <td className="p-4">
                         <div className="font-semibold text-gray-900 dark:text-gray-100">{booking.name}</div>
                         <div className="text-xs text-gray-500 dark:text-gray-400">{booking.phone}</div>
                       </td>
                       <td className="p-4">
                         <div className="font-medium text-gray-800 dark:text-gray-300 line-clamp-1 max-w-[200px]">
                           {booking.place?.title || 'Unknown Place'}
                         </div>
                       </td>
                       <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                         {format(new Date(booking.checkIn), 'MMM d')} - {format(new Date(booking.checkOut), 'MMM d, yyyy')}
                       </td>
                       <td className="p-4 font-bold text-gray-900 dark:text-gray-100">
                         ₹{booking.price}
                       </td>
                       <td className="p-4">
                         {booking.status === 'cancelled' ? (
                           <motion.span initial={{scale:0.9}} animate={{scale:1}} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                             Cancelled
                           </motion.span>
                         ) : (
                           <motion.span initial={{scale:0.9}} animate={{scale:1}} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                             Booked
                           </motion.span>
                         )}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           )}
        </motion.div>
     </div>
  )
}

function MetricCard({ title, value, prefix = "", suffix = "", decimals = 0, icon, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className="h-full"
    >
      <TiltCard className="glass-deep p-6 rounded-3xl shadow-premium border border-white/60 relative overflow-hidden group cursor-default h-full hover:shadow-glow transition-shadow duration-300">
        <div className="flex justify-between items-start mb-4 relative z-10">
          <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm">{title}</h3>
          <div className="p-2 bg-white/80 dark:bg-gray-800/80 rounded-xl group-hover:scale-110 transition-transform shadow-sm">
            {icon}
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight relative z-10">
          {prefix}
          <CountUp end={value} duration={2.5} separator="," decimals={decimals} />
          {suffix}
        </div>
        {/* Decorative gradient blob */}
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gray-50 dark:bg-gray-800/50 rounded-full blur-2xl group-hover:bg-brand/10 dark:group-hover:bg-brand/20 transition-colors z-0"></div>
      </TiltCard>
    </motion.div>
  )
}
