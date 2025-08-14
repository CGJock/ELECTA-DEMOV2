// import React from 'react';
// // Import custom hook for real-time data
// // import { useVoteBreakdown } from '../services/useDataService';

// const VotingStats: React.FC = () => {
//   // Use hook to get real-time data
//   const { voteBreakdown, loading, error } = useVoteBreakdown();

//   // Original commented code - hardcoded data
//   /*
//   const stats = {
//     totalVotes: 2847592,
//     validVotes: {
//       count: 2650234,
//       percentage: 93.1
//     },
//     nullVotes: {
//       count: 152847,
//       percentage: 5.4
//     },
//     blankVotes: {
//       count: 44511,
//       percentage: 1.5
//     }
//   };
//   */

//   const formatNumber = (num: number): string => {
//     return num.toLocaleString();
//   };

//   // Show loading while data is being loaded
//   if (loading) {
//     return (
//       <div className="relative backdrop-blur-xl bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 rounded-2xl border border-slate-600/30 shadow-2xl overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-indigo-600/5 pointer-events-none" />
//         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/80 via-indigo-500/80 to-purple-500/80" />
//         <div className="relative z-10 p-8">
//           <div className="text-center mb-8">
//             <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-slate-700/50 to-slate-600/50 border border-slate-500/30 backdrop-blur-sm">
//               <div className="w-3 h-3 rounded-full bg-emerald-400 mr-3 animate-pulse" />
//               <h2 className="text-xl font-bold text-white tracking-wide">
//                 Estadísticas de Votación
//               </h2>
//             </div>
//           </div>
//           <div className="text-center text-slate-300 font-medium">
//             Loading real-time data...
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Show error if there's a problem
//   if (error) {
//     return (
//       <div className="relative backdrop-blur-xl bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 rounded-2xl border border-slate-600/30 shadow-2xl overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-indigo-600/5 pointer-events-none" />
//         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/80 via-pink-500/80 to-red-500/80" />
//         <div className="relative z-10 p-8">
//           <div className="text-center mb-8">
//             <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-red-700/50 to-red-600/50 border border-red-500/30 backdrop-blur-sm">
//               <div className="w-3 h-3 rounded-full bg-red-400 mr-3 animate-pulse" />
//               <h2 className="text-xl font-bold text-white tracking-wide">
//                 Estadísticas de Votación
//               </h2>
//             </div>
//           </div>
//           <div className="text-center text-red-300 font-medium">
//             Error loading data: {error}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Use real data if available, otherwise show message
//   if (!voteBreakdown) {
//     return (
//       <div className="relative backdrop-blur-xl bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 rounded-2xl border border-slate-600/30 shadow-2xl overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-indigo-600/5 pointer-events-none" />
//         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/80 via-indigo-500/80 to-purple-500/80" />
//         <div className="relative z-10 p-8">
//           <div className="text-center mb-8">
//             <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-slate-700/50 to-slate-600/50 border border-slate-500/30 backdrop-blur-sm">
//               <div className="w-3 h-3 rounded-full bg-slate-400 mr-3 animate-pulse" />
//               <h2 className="text-xl font-bold text-white tracking-wide">
//                 Estadísticas de Votación
//               </h2>
//             </div>
//           </div>
//           <div className="text-center text-slate-300 font-medium">
//             No data available at this time
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="relative backdrop-blur-xl bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 rounded-2xl border border-slate-600/30 shadow-2xl overflow-hidden w-full max-w-2xl mx-auto">
//       {/* Decorative background effects */}
//       <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-indigo-600/5 pointer-events-none" />
//       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/80 via-indigo-500/80 to-purple-500/80" />
      
//       {/* Main content */}
//       <div className="relative z-10 p-10">
//         {/* Title with icon */}
//         <div className="text-center mb-10">
//           <div className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-slate-700/50 to-slate-600/50 border border-slate-500/30 backdrop-blur-sm">
//             <div className="w-4 h-4 rounded-full bg-emerald-400 mr-4 animate-pulse" />
//             <h2 className="text-2xl font-bold text-white tracking-wide">
//               Estadísticas de Votación
//             </h2>
//           </div>
//         </div>
        
//         <div className="space-y-8">
//           {/* Total Votes - Highlighted */}
//           <div className="relative overflow-hidden rounded-xl border border-slate-600/30 p-8 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-sm">
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
//             <div className="relative z-10">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <span className="text-slate-200 font-semibold text-xl block mb-1">
//                     Total de Votos Emitidos
//                   </span>
//                   <span className="text-slate-400 text-sm font-medium">
//                     TOTAL
//                   </span>
//                 </div>
//                 <span className="text-4xl font-bold text-blue-300 drop-shadow-sm">
//                   {formatNumber(voteBreakdown.totalVotes)}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Valid Votes */}
//           <div className="relative overflow-hidden rounded-xl border border-slate-600/30 p-7 bg-gradient-to-r from-emerald-600/20 to-green-600/20 backdrop-blur-sm">
//             <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-green-600/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
//             <div className="relative z-10">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <span className="text-slate-200 font-semibold text-lg block mb-1">
//                     Votos Válidos
//                   </span>
//                   <span className="text-slate-400 text-sm font-medium">
//                     VÁLIDOS
//                   </span>
//                 </div>
//                 <div className="text-right">
//                   <span className="text-2xl font-bold text-emerald-300 drop-shadow-sm block">
//                     {formatNumber(voteBreakdown.validVotes)}
//                   </span>
//                   <span className="text-sm text-emerald-200/80 font-medium">
//                     ({voteBreakdown.validPercentage.toFixed(1)}%)
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Null Votes */}
//           <div className="relative overflow-hidden rounded-xl border border-slate-600/30 p-7 bg-gradient-to-r from-red-600/20 to-pink-600/20 backdrop-blur-sm">
//             <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-pink-600/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
//             <div className="relative z-10">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <span className="text-slate-200 font-semibold text-lg block mb-1">
//                     Votos Nulos
//                   </span>
//                   <span className="text-slate-400 text-sm font-medium">
//                     NULOS
//                   </span>
//                 </div>
//                 <div className="text-right">
//                   <span className="text-2xl font-bold text-red-300 drop-shadow-sm block">
//                     {formatNumber(voteBreakdown.nullVotes)}
//                   </span>
//                   <span className="text-sm text-red-200/80 font-medium">
//                     ({voteBreakdown.nullPercentage.toFixed(1)}%)
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Blank Votes */}
//           <div className="relative overflow-hidden rounded-xl border border-slate-600/30 p-7 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm">
//             <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/10 to-orange-600/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
//             <div className="relative z-10">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <span className="text-slate-200 font-semibold text-lg block mb-1">
//                     Votos en Blanco
//                   </span>
//                   <span className="text-slate-400 text-sm font-medium">
//                     BLANCOS
//                   </span>
//                 </div>
//                 <div className="text-right">
//                   <span className="text-2xl font-bold text-yellow-300 drop-shadow-sm block">
//                     {formatNumber(voteBreakdown.blankVotes)}
//                   </span>
//                   <span className="text-sm text-yellow-200/80 font-medium">
//                     ({voteBreakdown.blankPercentage.toFixed(1)}%)
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VotingStats; 