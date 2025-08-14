// import React, { useState, useMemo, useRef, useEffect } from 'react';
// import { boliviaDivisions } from '@data/boliviaDivisions';
// import { XCircle, Loader2, Download, Search, ChevronLeft, ChevronRight } from 'lucide-react';
// import Select from 'react-select';
// import { useTranslation } from 'react-i18next';

// // Importar los servicios para datos en tiempo real
// import { useDepartments, useVoteBreakdown, useGlobalSummary } from '../services/useDataService';

// // Mock data de actas - Simulando 3000 actas
// type Acta = {
//   id: string;
//   imageUrl: string;
//   mesa: string;
//   recinto: string;
//   municipio: string;
//   provincia: string;
//   departamento: string;
//   totalVotos: number;
//   votosValidos: number;
//   votosNulos: number;
//   votosBlancos: number;
//   porcentajeValidos: number;
//   porcentajeNulos: number;
//   porcentajeBlancos: number;
// };

// // Generar 3000 actas de ejemplo
// const generateMockActas = (): Acta[] => {
//   const actas: Acta[] = [];
//   const departamentos = ['Chuquisaca', 'La Paz', 'Cochabamba', 'Oruro', 'Potosí', 'Tarija', 'Santa Cruz', 'Beni', 'Pando'];
//   const provincias = ['Oropeza', 'Ingavi', 'Quillacollo', 'Pantaleón Dalence', 'Antonio Quijarro', 'Aniceto Arce', 'Obispo Santistevan', 'Cercado', 'Nicolás Suárez'];
//   const municipios = ['Sucre', 'Viacha', 'Tiquipaya', 'Huanuni', 'Uyuni', 'Bermejo', 'Montero', 'Trinidad', 'Cobija'];
//   const recintos = [
//     'Colegio Nacional Junín', 'Unidad Educativa Germán Busch', 'Escuela República de Venezuela',
//     'Colegio Nacional San Luis', 'Unidad Educativa Técnica Oruro', 'Colegio Bolivia Mar',
//     'Unidad Educativa Pedro Domingo Murillo', 'Colegio 6 de Agosto', 'Unidad Educativa San Juan Bautista'
//   ];

//   // URLs de imágenes reales que funcionan
//   const realImageUrls = [
//     'https://stakwork-gte-project.s3.amazonaws.com/2015/final_runs/batch2015_9/140245.jpg',
//     'https://stakwork-gte-project.s3.amazonaws.com/2015/final_runs/batch2015_9/099553.jpg',
//     'https://stakwork-gte-project.s3.amazonaws.com/2015/final_runs/batch2015_9/104811.jpg',
//     'https://stakwork-gte-project.s3.amazonaws.com/2015/final_runs/batch2015_9/100325.jpg',
//     'https://stakwork-gte-project.s3.amazonaws.com/2015/final_runs/batch2015_9/139975.jpg',
//     'https://stakwork-gte-project.s3.amazonaws.com/2015/final_runs/batch2015_9/100305.jpg',
//     'https://stakwork-gte-project.s3.amazonaws.com/2015/final_runs/batch2015_9/119303.jpg',
//     'https://stakwork-gte-project.s3.amazonaws.com/2015/final_runs/batch2015_9/098702.jpg',
//     'https://stakwork-gte-project.s3.amazonaws.com/2015/final_runs/batch2015_9/099632.jpg',
//     'https://stakwork-gte-project.s3.amazonaws.com/2015/final_runs/batch2015_9/098593.jpg',
//     'https://stakwork-gte-project.s3.amazonaws.com/2015/final_runs/batch2015_9/097955.jpg',
//     'https://stakwork-gte-project.s3.amazonaws.com/2015/final_runs/batch2015_9/130664.jpg',
//     'https://stakwork-gte-project.s3.amazonaws.com/2015/final_runs/batch2015_9/099892.jpg',
//     'https://stakwork-gte-project.s3.amazonaws.com/2015/final_runs/batch2015_9/030022.jpg',
//     'https://stakwork-gte-project.s3.amazonaws.com/2015/final_runs/batch2015_9/031411.jpg',
//     'https://stakwork-gte-project.s3.amazonaws.com/2015/final_runs/batch2015_9/023711.jpg'
//   ];

//   for (let i = 1; i <= 3000; i++) {
//     const deptIndex = i % departamentos.length;
//     const provIndex = i % provincias.length;
//     const munIndex = i % municipios.length;
//     const recintoIndex = i % recintos.length;
//     const imageIndex = i % realImageUrls.length;
    
//     // Generar datos de votos realistas
//     const totalVotos = Math.floor(Math.random() * 200) + 150;
//     const votosValidos = Math.floor(totalVotos * (0.85 + Math.random() * 0.10));
//     const votosNulos = Math.floor(totalVotos * (0.02 + Math.random() * 0.05));
//     const votosBlancos = totalVotos - votosValidos - votosNulos;
    
//     // Calcular porcentajes
//     const porcentajeValidos = Math.round((votosValidos / totalVotos) * 100);
//     const porcentajeNulos = Math.round((votosNulos / totalVotos) * 100);
//     const porcentajeBlancos = Math.round((votosBlancos / totalVotos) * 100);
    
//     actas.push({
//       id: i.toString().padStart(6, '0'),
//       imageUrl: realImageUrls[imageIndex],
//       mesa: `Mesa ${i}`,
//       recinto: recintos[recintoIndex],
//       municipio: municipios[munIndex],
//       provincia: provincias[provIndex],
//       departamento: departamentos[deptIndex],
//       totalVotos,
//       votosValidos,
//       votosNulos,
//       votosBlancos,
//       porcentajeValidos,
//       porcentajeNulos,
//       porcentajeBlancos,
//     });
//   }
//   return actas;
// };

// const actas = generateMockActas();

// // Utilidades para obtener listas únicas
// const getDepartamentos = (): string[] => boliviaDivisions.map(d => d.department);

// // Hook para detectar si es móvil
// function useIsMobile(breakpoint = 768) {
//   const [isMobile, setIsMobile] = useState(false);
//   useEffect(() => {
//     const check = () => setIsMobile(window.innerWidth < breakpoint);
//     check();
//     window.addEventListener('resize', check);
//     return () => window.removeEventListener('resize', check);
//   }, [breakpoint]);
//   return isMobile;
// }

// const styles: { [key: string]: React.CSSProperties } = {
//   container: {
//     maxWidth: '98vw',
//     margin: '2rem auto',
//     padding: '1.5rem',
//     background: 'transparent',
//     borderRadius: 0,
//     boxShadow: 'none',
//     color: '#fff',
//     fontFamily: 'inherit',
//     display: 'flex',
//     flexDirection: 'column' as const,
//     alignItems: 'center',
//   },
//   filterCard: {
//     maxWidth: 420,
//     width: '100%',
//     background: 'rgba(30,41,59,0.55)',
//     borderRadius: 24,
//     boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
//     padding: '2rem 2.5rem',
//     marginBottom: 40,
//     display: 'flex',
//     flexDirection: 'column' as const,
//     alignItems: 'center',
//     backdropFilter: 'blur(8px)',
//     border: '1.5px solid rgba(255,255,255,0.12)',
//   },
//   title: {
//     fontSize: '2rem',
//     fontWeight: 800,
//     marginBottom: '2rem',
//     textAlign: 'center' as const,
//     letterSpacing: 1.2,
//     background: 'linear-gradient(90deg, #7dd3fc 0%, #818cf8 100%)',
//     WebkitBackgroundClip: 'text',
//     WebkitTextFillColor: 'transparent',
//     textShadow: '0 2px 8px rgba(129, 140, 248, 0.10)',
//   },
//   filters: {
//     display: 'flex',
//     flexDirection: 'column' as const,
//     gap: 22,
//     marginBottom: 36,
//     maxWidth: 420,
//     width: '100%',
//     background: 'rgba(30,41,59,0.25)',
//     borderRadius: 18,
//     padding: '1.2rem 1.7rem',
//     boxShadow: '0 2px 12px rgba(30,41,59,0.10)',
//     alignItems: 'center',
//     border: '1px solid rgba(255,255,255,0.08)',
//     backdropFilter: 'blur(2px)',
//   },
//   selectGroup: {
//     display: 'flex',
//     flexDirection: 'column' as const,
//     gap: 8,
//     width: '100%',
//   },
//   label: {
//     fontWeight: 600,
//     marginBottom: 2,
//     fontSize: '1.08rem',
//     color: '#a5b4fc',
//     letterSpacing: 0.3,
//     textShadow: '0 1px 2px #1e293b',
//   },
//   input: {
//     padding: '10px 14px',
//     borderRadius: 10,
//     border: '1.5px solid #334155',
//     background: 'rgba(30,41,59,0.7)',
//     color: '#fff',
//     fontSize: '1.05rem',
//     outline: 'none',
//     marginBottom: 4,
//     boxShadow: '0 1px 4px rgba(30,41,59,0.10)',
//   },
//   clearBtn: {
//     marginTop: 12,
//     padding: '7px 18px',
//     borderRadius: 22,
//     borderWidth: 1.5,
//     borderStyle: 'solid',
//     borderColor: '#64748b',
//     background: 'rgba(51,65,85,0.7)',
//     color: '#cbd5e1',
//     fontWeight: 600,
//     fontSize: '1.01rem',
//     cursor: 'pointer',
//     alignSelf: 'center',
//     display: 'flex',
//     alignItems: 'center',
//     gap: 8,
//     boxShadow: '0 2px 8px rgba(30,41,59,0.10)',
//     transition: 'background 0.2s, color 0.2s, border 0.2s',
//   },
//   clearBtnHover: {
//     background: '#334155',
//     color: '#fff',
//     borderWidth: 1.5,
//     borderStyle: 'solid',
//     borderColor: '#475569',
//   },
//   tableContainer: {
//     width: '100%',
//     maxWidth: '100%',
//     background: 'rgba(30,41,59,0.85)',
//     borderRadius: 20,
//     boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
//     padding: '2.5rem 1.5rem',
//     border: '1.5px solid rgba(80, 180, 255, 0.06)',
//     backdropFilter: 'blur(4px)',
//     overflowX: 'auto',
//   },
//   table: {
//     width: '100%',
//     borderCollapse: 'collapse' as const,
//     fontSize: '0.95rem',
//   },
//   tableHeader: {
//     background: 'rgba(51,65,85,0.8)',
//     color: '#fff',
//     fontWeight: 600,
//     textAlign: 'left' as const,
//     padding: '12px 16px',
//     borderBottom: '2px solid rgba(255,255,255,0.1)',
//     position: 'sticky' as const,
//     top: 0,
//     zIndex: 10,
//   },
//   tableRow: {
//     background: 'rgba(30,41,59,0.6)',
//     transition: 'background 0.2s ease',
//     cursor: 'pointer',
//   },
//   tableRowHover: {
//     background: 'rgba(51,65,85,0.8)',
//   },
//   tableCell: {
//     padding: '12px 16px',
//     borderBottom: '1px solid rgba(255,255,255,0.05)',
//     color: '#e5e7eb',
//   },
//   tableCellNumber: {
//     textAlign: 'center' as const,
//     fontWeight: 600,
//   },
//   tableCellValid: {
//     color: '#22c55e',
//     fontWeight: 600,
//   },
//   tableCellNull: {
//     color: '#ef4444',
//     fontWeight: 600,
//   },
//   tableCellBlank: {
//     color: '#f59e0b',
//     fontWeight: 600,
//   },
//   paginationContainer: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 12,
//     marginTop: 24,
//     flexWrap: 'wrap' as const,
//   },
//   pageButton: {
//     padding: '8px 12px',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderStyle: 'solid',
//     borderColor: '#374151',
//     background: '#1E293B',
//     color: '#fff',
//     cursor: 'pointer',
//     transition: 'all 0.2s ease',
//     minWidth: 40,
//     textAlign: 'center' as const,
//   },
//   pageButtonActive: {
//     background: '#3B82F6',
//     borderColor: '#3B82F6',
//     color: '#fff',
//   },
//   pageButtonHover: {
//     background: '#334155',
//     borderColor: '#475569',
//   },
//   statsContainer: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '100%',
//     maxWidth: 600,
//     margin: '16px auto 0 auto',
//     padding: '12px 16px',
//     background: 'rgba(30,41,59,0.7)',
//     borderRadius: 12,
//     fontSize: '0.9rem',
//     color: '#cbd5e1',
//   },
//   modalOverlay: {
//     position: 'fixed',
//     top: 0, left: 0, right: 0, bottom: 0,
//     background: 'rgba(0,0,0,0.8)',
//     zIndex: 1000,
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 16,
//     backdropFilter: 'blur(4px)',
//   },
//   modal: {
//     background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
//     borderRadius: 16,
//     padding: 24,
//     maxWidth: 500,
//     width: '100%',
//     boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
//     color: '#fff',
//     position: 'relative',
//     textAlign: 'center' as const,
//     border: '1px solid rgba(148, 163, 184, 0.2)',
//   },
//   modalImg: {
//     width: '100%',
//     maxHeight: 400,
//     objectFit: 'contain' as const,
//     borderRadius: 10,
//     marginBottom: 16,
//     background: '#111827',
//     boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
//   },
//   modalActions: {
//     display: 'flex',
//     flexDirection: 'row' as const,
//     gap: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 10,
//     marginBottom: 2,
//   },
//   modalActionBtn: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: 6,
//     background: 'rgba(30,41,59,0.92)',
//     color: '#e5e7eb',
//     border: '1px solid #334155',
//     borderRadius: 7,
//     padding: '7px 14px',
//     fontWeight: 500,
//     fontSize: '0.97rem',
//     cursor: 'pointer',
//     textDecoration: 'none',
//     boxShadow: 'none',
//     transition: 'background 0.18s, border 0.18s, color 0.18s',
//   },
//   modalActionBtnHover: {
//     background: '#334155',
//     color: '#fff',
//     border: '1px solid #475569',
//   },
//   closeBtn: {
//     position: 'absolute',
//     top: 12,
//     right: 12,
//     background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
//     color: '#fff',
//     border: 'none',
//     borderRadius: 8,
//     padding: '8px 16px',
//     fontWeight: 700,
//     fontSize: '0.9rem',
//     cursor: 'pointer',
//     zIndex: 2,
//     transition: 'all 0.2s ease',
//   },
//   noResults: {
//     textAlign: 'center' as const,
//     color: '#F87171',
//     fontWeight: 500,
//     padding: '2rem',
//     fontSize: '1.1rem',
//   },
// };

// export default function ElectionReportTable() {
//   const isMobile = useIsMobile();
//   const { t } = useTranslation();

//   // Hooks para datos en tiempo real
//   const { departments: realDepartments, loading: departmentsLoading, error: departmentsError } = useDepartments();
//   const { voteBreakdown, loading: breakdownLoading, error: breakdownError } = useVoteBreakdown();
//   const { globalSummary, loading: summaryLoading, error: summaryError } = useGlobalSummary();

//   // Filtros
//   const [textSearch, setTextSearch] = useState('');
//   const [modalActa, setModalActa] = useState<Acta | null>(null);
  
//   // Paginación
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 20;
  
//   // Estado para hover
//   const [isDownloading, setIsDownloading] = useState(false);
//   const [hoveredRow, setHoveredRow] = useState<number | null>(null);

//   // Función de descarga
//   const downloadImage = async (imageUrl: string, fileName: string) => {
//     setIsDownloading(true);
//     try {
//       const newWindow = window.open(imageUrl, '_blank');
//       if (newWindow) {
//         setTimeout(() => {
//           alert('Para descargar la imagen:\n\n1. En la nueva pestaña, haz clic derecho en la imagen\n2. Selecciona "Guardar imagen como..."\n3. Elige la ubicación y guarda con el nombre que prefieras');
//         }, 500);
//       } else {
//         alert('No se pudo abrir la imagen. Intenta hacer clic derecho en la imagen del modal y selecciona "Guardar imagen como..."');
//       }
//     } catch (error) {
//       console.error('Error al abrir la imagen:', error);
//       alert('Error al abrir la imagen. Intenta hacer clic derecho en la imagen del modal y selecciona "Guardar imagen como..."');
//     } finally {
//       setIsDownloading(false);
//     }
//   };

//   // Filtrado de actas
//   const filteredActas = useMemo(() =>
//     actas.filter(a => {
//       const searchLower = textSearch.toLowerCase();
//       const matchesText = !textSearch || 
//         a.mesa.toLowerCase().includes(searchLower) ||
//         a.departamento.toLowerCase().includes(searchLower) ||
//         a.municipio.toLowerCase().includes(searchLower) ||
//         a.provincia.toLowerCase().includes(searchLower);
      
//       return matchesText;
//     }),
//     [textSearch]
//   );

//   // Paginación
//   const totalPages = Math.ceil(filteredActas.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentActas = filteredActas.slice(startIndex, endIndex);

//   // Resetear paginación cuando cambian los filtros
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [filteredActas]);

//   // Limpiar filtros
//   const clearFilters = () => {
//     setTextSearch('');
//   };

//   // Navegación de páginas
//   const goToPage = (page: number) => {
//     setCurrentPage(page);
//   };

//   const nextPage = () => {
//     if (currentPage < totalPages) {
//       goToPage(currentPage + 1);
//     }
//   };

//   const prevPage = () => {
//     if (currentPage > 1) {
//       goToPage(currentPage - 1);
//     }
//   };

//   // Generar botones de página
//   const getPageButtons = () => {
//     const buttons = [];
//     const maxVisiblePages = 5;
    
//     if (totalPages <= maxVisiblePages) {
//       for (let i = 1; i <= totalPages; i++) {
//         buttons.push(i);
//       }
//     } else {
//       if (currentPage <= 3) {
//         for (let i = 1; i <= 4; i++) {
//           buttons.push(i);
//         }
//         buttons.push('...');
//         buttons.push(totalPages);
//       } else if (currentPage >= totalPages - 2) {
//         buttons.push(1);
//         buttons.push('...');
//         for (let i = totalPages - 3; i <= totalPages; i++) {
//           buttons.push(i);
//         }
//       } else {
//         buttons.push(1);
//         buttons.push('...');
//         for (let i = currentPage - 1; i <= currentPage + 1; i++) {
//           buttons.push(i);
//         }
//         buttons.push('...');
//         buttons.push(totalPages);
//       }
//     }
    
//     return buttons;
//   };

//   return (
//     <div style={{ 
//       ...styles.container, 
//       maxWidth: isMobile ? '100vw' : '98vw', 
//       padding: isMobile ? '0.5rem' : '1.5rem',
//     }}>
//       <div style={{
//         ...styles.title,
//         fontSize: isMobile ? '1.2rem' : '2rem',
//         marginBottom: isMobile ? '1rem' : '2rem',
//       }}>Reporte de Elecciones - Vista Tabla</div>

//       {/* Indicador de estado de datos en tiempo real */}
//       <div style={{
//         background: 'rgba(16, 185, 129, 0.1)',
//         border: '1px solid rgba(16, 185, 129, 0.3)',
//         borderRadius: '8px',
//         padding: '8px 16px',
//         marginBottom: '16px',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         gap: '8px',
//         fontSize: '0.9rem',
//         color: '#10B981',
//         maxWidth: '500px',
//         margin: '0 auto 16px auto'
//       }}>
//         {departmentsLoading || breakdownLoading || summaryLoading ? (
//           <>
//             <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
//             <span>Cargando datos en tiempo real...</span>
//           </>
//         ) : departmentsError || breakdownError || summaryError ? (
//           <>
//             <XCircle size={16} />
//             <span>Usando datos de respaldo (error de conexión)</span>
//           </>
//         ) : (
//           <>
//             <div style={{
//               width: '8px',
//               height: '8px',
//               borderRadius: '50%',
//               background: '#10B981',
//               animation: 'pulse 2s infinite'
//             }} />
//             <span>Datos en tiempo real disponibles</span>
//           </>
//         )}
//       </div>

//       {/* Estadísticas en tiempo real */}
//       {(voteBreakdown || globalSummary) && (
//         <div style={{
//           background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
//           border: '1px solid #374151',
//           borderRadius: '12px',
//           padding: '20px',
//           marginBottom: '24px',
//           maxWidth: '800px',
//           margin: '0 auto 24px auto'
//         }}>
//           <h3 style={{
//             color: '#FFFFFF',
//             fontSize: '1.2rem',
//             fontWeight: 'bold',
//             marginBottom: '16px',
//             textAlign: 'center'
//           }}>
//             Estadísticas en Tiempo Real
//           </h3>
          
//           <div style={{
//             display: 'grid',
//             gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
//             gap: '16px'
//           }}>
//             {voteBreakdown && (
//               <>
//                 <div style={{
//                   background: 'rgba(255,255,255,0.05)',
//                   borderRadius: '8px',
//                   padding: '16px',
//                   textAlign: 'center'
//                 }}>
//                   <div style={{ color: '#10B981', fontSize: '1.5rem', fontWeight: 'bold' }}>
//                     {voteBreakdown.totalVotes.toLocaleString()}
//                   </div>
//                   <div style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>Total de Votos</div>
//                 </div>
                
//                 <div style={{
//                   background: 'rgba(255,255,255,0.05)',
//                   borderRadius: '8px',
//                   padding: '16px',
//                   textAlign: 'center'
//                 }}>
//                   <div style={{ color: '#22C55E', fontSize: '1.5rem', fontWeight: 'bold' }}>
//                     {voteBreakdown.validVotes.toLocaleString()}
//                   </div>
//                   <div style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>Votos Válidos ({voteBreakdown.validPercentage.toFixed(1)}%)</div>
//                 </div>
                
//                 <div style={{
//                   background: 'rgba(255,255,255,0.05)',
//                   borderRadius: '8px',
//                   padding: '16px',
//                   textAlign: 'center'
//                 }}>
//                   <div style={{ color: '#EF4444', fontSize: '1.5rem', fontWeight: 'bold' }}>
//                     {voteBreakdown.nullVotes.toLocaleString()}
//                   </div>
//                   <div style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>Votos Nulos ({voteBreakdown.nullPercentage.toFixed(1)}%)</div>
//                 </div>
                
//                 <div style={{
//                   background: 'rgba(255,255,255,0.05)',
//                   borderRadius: '8px',
//                   padding: '16px',
//                   textAlign: 'center'
//                 }}>
//                   <div style={{ color: '#F59E0B', fontSize: '1.5rem', fontWeight: 'bold' }}>
//                     {voteBreakdown.blankVotes.toLocaleString()}
//                   </div>
//                   <div style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>Votos en Blanco ({voteBreakdown.blankPercentage.toFixed(1)}%)</div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Tabla */}
//       <div style={{
//         ...styles.tableContainer,
//         padding: isMobile ? '1rem 0.5rem' : '2.5rem 1.5rem',
//       }}>
//         {/* Barra de búsqueda horizontal integrada */}
//         <div style={{
//           display: 'flex',
//           alignItems: 'center',
//           gap: '12px',
//           marginBottom: '20px',
//           padding: '16px',
//           background: 'rgba(30,41,59,0.4)',
//           borderRadius: '12px',
//           border: '1px solid rgba(255,255,255,0.08)',
//           flexDirection: isMobile ? 'column' : 'row',
//         }}>
//           <div style={{
//             position: 'relative',
//             flex: 1,
//             display: 'flex',
//             alignItems: 'center',
//           }}>
//             <Search 
//               size={isMobile ? 16 : 18} 
//               style={{
//                 position: 'absolute',
//                 left: 12,
//                 color: '#64748b',
//                 zIndex: 1,
//               }}
//             />
//             <input
//               type="text"
//               value={textSearch}
//               onChange={(e) => setTextSearch(e.target.value)}
//               placeholder="Buscar por mesa, departamento, municipio o provincia..."
//               style={{
//                 width: '100%',
//                 padding: '10px 14px 10px 40px',
//                 borderRadius: '8px',
//                 border: '1.5px solid #334155',
//                 background: 'rgba(30,41,59,0.7)',
//                 color: '#fff',
//                 fontSize: isMobile ? '0.95rem' : '1rem',
//                 outline: 'none',
//                 boxShadow: '0 1px 4px rgba(30,41,59,0.10)',
//               }}
//             />
//           </div>
          
//           {textSearch && (
//             <button
//               onClick={clearFilters}
//               style={{
//                 padding: '8px 16px',
//                 borderRadius: '8px',
//                 border: '1.5px solid #64748b',
//                 background: 'rgba(51,65,85,0.7)',
//                 color: '#cbd5e1',
//                 fontWeight: 600,
//                 fontSize: isMobile ? '0.9rem' : '1rem',
//                 cursor: 'pointer',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '6px',
//                 boxShadow: '0 2px 8px rgba(30,41,59,0.10)',
//                 transition: 'background 0.2s, color 0.2s, border 0.2s',
//                 whiteSpace: 'nowrap',
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.background = '#334155';
//                 e.currentTarget.style.color = '#fff';
//                 e.currentTarget.style.borderColor = '#475569';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.background = 'rgba(51,65,85,0.7)';
//                 e.currentTarget.style.color = '#cbd5e1';
//                 e.currentTarget.style.borderColor = '#64748b';
//               }}
//             >
//               <XCircle size={isMobile ? 14 : 16} /> Limpiar
//             </button>
//           )}
//         </div>

//         {/* Estadísticas de la tabla */}
//         <div style={{ ...styles.statsContainer, margin: isMobile ? '0 0 8px 0' : '0 0 16px 0', maxWidth: '100%', fontSize: isMobile ? '0.85rem' : '0.9rem', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 4 : 0 }}>
//           <div>Total de registros: {filteredActas.length.toLocaleString()}</div>
//           <div>Página {currentPage} de {totalPages}</div>
//           <div>Mostrando {startIndex + 1}-{Math.min(endIndex, filteredActas.length)} de {filteredActas.length}</div>
//         </div>

//         {filteredActas.length === 0 ? (
//           <div style={{ ...styles.noResults, fontSize: isMobile ? '0.95rem' : '1.1rem', padding: isMobile ? '1rem' : '2rem' }}>
//             No se encontraron resultados
//           </div>
//         ) : (
//           <div style={{ overflowX: 'auto' }}>
//             <table style={styles.table}>
//               <thead>
//                 <tr>
//                   <th style={styles.tableHeader}>Mesa</th>
//                   <th style={styles.tableHeader}>Departamento</th>
//                   <th style={styles.tableHeader}>Total Votos</th>
//                   <th style={styles.tableHeader}>Votos Válidos</th>
//                   <th style={styles.tableHeader}>Votos Nulos</th>
//                   <th style={styles.tableHeader}>Votos Blancos</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentActas.map((acta, index) => (
//                   <tr
//                     key={acta.id}
//                     style={{
//                       ...styles.tableRow,
//                       ...(hoveredRow === index && styles.tableRowHover),
//                     }}
//                     onMouseEnter={() => setHoveredRow(index)}
//                     onMouseLeave={() => setHoveredRow(null)}
//                     onClick={() => setModalActa(acta)}
//                   >
//                     <td style={styles.tableCell}>{acta.mesa}</td>
//                     <td style={styles.tableCell}>{acta.departamento}</td>
//                     <td style={{ ...styles.tableCell, ...styles.tableCellNumber }}>
//                       {acta.totalVotos.toLocaleString()}
//                     </td>
//                     <td style={{ ...styles.tableCell, ...styles.tableCellValid }}>
//                       {acta.votosValidos.toLocaleString()} ({acta.porcentajeValidos}%)
//                     </td>
//                     <td style={{ ...styles.tableCell, ...styles.tableCellNull }}>
//                       {acta.votosNulos.toLocaleString()} ({acta.porcentajeNulos}%)
//                     </td>
//                     <td style={{ ...styles.tableCell, ...styles.tableCellBlank }}>
//                       {acta.votosBlancos.toLocaleString()} ({acta.porcentajeBlancos}%)
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Paginación */}
//       {totalPages > 1 && (
//         <div style={{ ...styles.paginationContainer, gap: isMobile ? 6 : 12, marginTop: isMobile ? 12 : 24 }}>
//           <button
//             style={{
//               ...styles.pageButton,
//               fontSize: isMobile ? '0.95rem' : undefined,
//               minWidth: isMobile ? 32 : 40,
//               padding: isMobile ? '6px 8px' : '8px 12px',
//             }}
//             onClick={prevPage}
//             disabled={currentPage === 1}
//           >
//             Anterior
//           </button>

//           {getPageButtons().map((page, index) => (
//             <button
//               key={index}
//               style={{
//                 ...styles.pageButton,
//                 ...(page === currentPage && styles.pageButtonActive),
//                 ...(page === '...'
//                   ? {
//                       cursor: 'default',
//                       background: 'transparent',
//                       borderWidth: 0,
//                       borderStyle: 'solid',
//                       borderColor: 'transparent',
//                     }
//                   : {}),
//                 fontSize: isMobile ? '0.95rem' : undefined,
//                 minWidth: isMobile ? 32 : 40,
//                 padding: isMobile ? '6px 8px' : '8px 12px',
//               }}
//               onClick={() => typeof page === 'number' && goToPage(page)}
//               disabled={page === '...'}
//             >
//               {page}
//             </button>
//           ))}

//           <button
//             style={{
//               ...styles.pageButton,
//               fontSize: isMobile ? '0.95rem' : undefined,
//               minWidth: isMobile ? 32 : 40,
//               padding: isMobile ? '6px 8px' : '8px 12px',
//             }}
//             onClick={nextPage}
//             disabled={currentPage === totalPages}
//           >
//             Siguiente
//           </button>
//         </div>
//       )}

//       {/* Modal */}
//       {modalActa && (
//         <div style={{ ...styles.modalOverlay, padding: isMobile ? 2 : 16 }} onClick={() => setModalActa(null)}>
//           <div style={{
//             ...styles.modal,
//             maxWidth: isMobile ? '98vw' : 500,
//             padding: isMobile ? 8 : 20,
//           }} onClick={e => e.stopPropagation()}>
//             <button style={{ ...styles.closeBtn, padding: isMobile ? '6px 10px' : '8px 16px', fontSize: isMobile ? '0.8rem' : '0.9rem', top: isMobile ? 6 : 12, right: isMobile ? 6 : 12 }} onClick={() => setModalActa(null)}>×</button>
            
//             {/* Imagen y información básica */}
//             <img src={modalActa.imageUrl} alt={`Acta ${modalActa.mesa}`} style={{ ...styles.modalImg, maxHeight: isMobile ? 200 : 280, marginBottom: isMobile ? 8 : 12 }} />
            
//             {/* Información de la mesa */}
//             <div style={{ fontWeight: 700, fontSize: isMobile ? '1rem' : '1.2rem', marginBottom: isMobile ? 4 : 6, color: '#fff' }}>{modalActa.mesa}</div>
//             <div style={{ marginBottom: isMobile ? 2 : 3, fontSize: isMobile ? '0.95rem' : undefined, color: '#cbd5e1' }}>{modalActa.recinto}</div>
//             <div style={{ marginBottom: isMobile ? 2 : 3, fontSize: isMobile ? '0.95rem' : undefined, color: '#cbd5e1' }}>{modalActa.municipio}, {modalActa.provincia}</div>
//             <div style={{ marginBottom: isMobile ? 8 : 10, fontSize: isMobile ? '0.95rem' : undefined, color: '#cbd5e1' }}>{modalActa.departamento}</div>
            
//             {/* Estadísticas de votos simplificadas */}
//             <div style={{
//               background: 'rgba(30,41,59,0.6)',
//               borderRadius: '8px',
//               padding: isMobile ? '8px 12px' : '10px 16px',
//               marginBottom: isMobile ? 6 : 8,
//               border: '1px solid rgba(255,255,255,0.08)',
//             }}>
//               <div style={{
//                 fontSize: isMobile ? '0.9rem' : '1rem',
//                 fontWeight: 600,
//                 color: '#fff',
//                 marginBottom: isMobile ? 6 : 8,
//                 textAlign: 'center',
//               }}>
//                 📊 Votos: {modalActa.totalVotos.toLocaleString()} total
//               </div>
              
//               <div style={{
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 fontSize: isMobile ? '0.85rem' : '0.9rem',
//                 color: '#cbd5e1',
//                 gap: '8px',
//               }}>
//                 <span style={{ color: '#22c55e' }}>✅ {modalActa.votosValidos} válidos ({modalActa.porcentajeValidos}%)</span>
//                 <span style={{ color: '#ef4444' }}>❌ {modalActa.votosNulos} nulos ({modalActa.porcentajeNulos}%)</span>
//                 <span style={{ color: '#f59e0b' }}>⚪ {modalActa.votosBlancos} blancos ({modalActa.porcentajeBlancos}%)</span>
//               </div>
//             </div>
            
//             {/* Acciones de la imagen */}
//             <div style={{ ...styles.modalActions, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 6 : 12, marginTop: isMobile ? 4 : 8, marginBottom: isMobile ? 0 : 2 }}>
//               <a
//                 href={modalActa.imageUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 style={{ ...styles.modalActionBtn, fontSize: isMobile ? '0.93rem' : '0.97rem', padding: isMobile ? '6px 10px' : '7px 14px' }}
//               >
//                 Abrir imagen
//               </a>
//               <button
//                 onClick={() => downloadImage(modalActa.imageUrl, `Acta-${modalActa.mesa}.jpg`)}
//                 style={{ ...styles.modalActionBtn, fontSize: isMobile ? '0.93rem' : '0.97rem', padding: isMobile ? '6px 10px' : '7px 14px' }}
//                 disabled={isDownloading}
//               >
//                 {isDownloading ? (
//                   <>
//                     <Loader2 size={isMobile ? 13 : 16} style={{ marginRight: 4, marginBottom: -2, opacity: 0.85, animation: 'spin 1s linear infinite' }} /> 
//                     Descargando...
//                   </>
//                 ) : (
//                   <>
//                     <Download size={isMobile ? 13 : 16} style={{ marginRight: 4, marginBottom: -2, opacity: 0.85 }} /> 
//                     Descargar imagen
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// } 