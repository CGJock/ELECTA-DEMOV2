// // Componente de prueba para verificar los servicios de datos
// 'use client';

// import { useState } from 'react';
// import { 
//   useDepartments, 
//   useGlobalSummary, 
//   useSocketStatus,
//   dataService 
// } from '@/services';

// export default function DataServiceTest() {
//   const [testResult, setTestResult] = useState<string>('');
//   const { departments, loading: deptLoading, error: deptError } = useDepartments();
//   const { globalSummary, loading: summaryLoading, error: summaryError } = useGlobalSummary();
//   const { isConnected, socketId } = useSocketStatus();

//   const testApiConnection = async () => {
//     try {
//       setTestResult('Probando conexión API...');
//       const depts = await dataService.getDepartments();
//       setTestResult(`✅ API conectada. Departamentos encontrados: ${depts.length}`);
//     } catch (error) {
//       setTestResult(`❌ Error API: ${error instanceof Error ? error.message : 'Error desconocido'}`);
//     }
//   };

//   const testSocketConnection = () => {
//     if (isConnected) {
//       setTestResult(`✅ WebSocket conectado. ID: ${socketId}`);
//     } else {
//       setTestResult('❌ WebSocket no conectado');
//     }
//   };

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4 text-gray-800">🧪 Prueba de Servicios de Datos</h2>
      
//       {/* Estado de conexiones */}
//       <div className="mb-6">
//         <h3 className="text-lg font-semibold mb-2">Estado de Conexiones</h3>
//         <div className="space-y-2">
//           <div className="flex items-center gap-2">
//             <span className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
//             <span>WebSocket: {isConnected ? 'Conectado' : 'Desconectado'}</span>
//             {socketId && <span className="text-sm text-gray-500">({socketId})</span>}
//           </div>
//         </div>
//       </div>

//       {/* Botones de prueba */}
//       <div className="mb-6 space-y-2">
//         <button 
//           onClick={testApiConnection}
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           Probar API REST
//         </button>
//         <button 
//           onClick={testSocketConnection}
//           className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-2"
//         >
//           Probar WebSocket
//         </button>
//       </div>

//       {/* Resultado de prueba */}
//       {testResult && (
//         <div className="mb-6 p-3 bg-gray-100 rounded">
//           <p className="text-sm">{testResult}</p>
//         </div>
//       )}

//       {/* Datos de departamentos */}
//       <div className="mb-6">
//         <h3 className="text-lg font-semibold mb-2">Departamentos</h3>
//         {deptLoading ? (
//           <p className="text-gray-500">Cargando departamentos...</p>
//         ) : deptError ? (
//           <p className="text-red-500">Error: {deptError}</p>
//         ) : (
//           <div className="grid grid-cols-2 gap-2">
//             {departments.slice(0, 6).map(dept => (
//               <div key={dept.code} className="p-2 bg-gray-50 rounded text-sm">
//                 <strong>{dept.code}</strong>: {dept.name}
//               </div>
//             ))}
//             {departments.length > 6 && (
//               <div className="col-span-2 text-sm text-gray-500">
//                 ... y {departments.length - 6} más
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Datos de resumen global */}
//       <div className="mb-6">
//         <h3 className="text-lg font-semibold mb-2">Resumen Global</h3>
//         {summaryLoading ? (
//           <p className="text-gray-500">Cargando resumen...</p>
//         ) : summaryError ? (
//           <p className="text-red-500">Error: {summaryError}</p>
//         ) : globalSummary ? (
//           <div className="space-y-2">
//             <div className="grid grid-cols-3 gap-4">
//               <div className="text-center p-2 bg-blue-50 rounded">
//                 <div className="text-lg font-bold text-blue-600">{globalSummary.totalVotes.toLocaleString()}</div>
//                 <div className="text-xs text-gray-500">Total Votos</div>
//               </div>
//               <div className="text-center p-2 bg-yellow-50 rounded">
//                 <div className="text-lg font-bold text-yellow-600">{globalSummary.blankVotes.toLocaleString()}</div>
//                 <div className="text-xs text-gray-500">Votos Blancos</div>
//               </div>
//               <div className="text-center p-2 bg-red-50 rounded">
//                 <div className="text-lg font-bold text-red-600">{globalSummary.nullVotes.toLocaleString()}</div>
//                 <div className="text-xs text-gray-500">Votos Nulos</div>
//               </div>
//             </div>
//             <div className="text-sm text-gray-500">
//               Partidos: {globalSummary.partyBreakdown.length}
//             </div>
//           </div>
//         ) : (
//           <p className="text-gray-500">No hay datos disponibles</p>
//         )}
//       </div>

//       {/* Instrucciones */}
//       <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded">
//         <p><strong>Instrucciones:</strong></p>
//         <ol className="list-decimal list-inside space-y-1 mt-2">
//           <li>Asegúrate de que el backend esté corriendo en puerto 5000</li>
//           <li>Verifica que las variables de entorno estén correctas</li>
//           <li>Usa los botones para probar las conexiones</li>
//           <li>Los datos se actualizan automáticamente via WebSocket</li>
//         </ol>
//       </div>
//     </div>
//   );
// } 