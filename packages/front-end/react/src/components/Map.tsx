'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { useSocketData } from '@contexts/context';
import { useTranslation } from 'react-i18next';
import { mockIncidents } from '@data/mockIncidents';
import type { Incident } from '@/types/election';
import { IncidentsFlag } from '@components/IncidentsFlag';

interface MapProps {
  incidents?: Incident[];
}

const map: React.FC<MapProps> = ({ incidents = mockIncidents }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.EChartsType | null>(null);
  const [mounted, setMounted] = useState(false);
  const geoIdMapRef = useRef<Map<string, string>>(new Map());
  const { setSelectedLocationCode, selectedLocationCode } = useSocketData();
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Forzar resize del mapa cuando se monta
  useEffect(() => {
    if (mounted && chartInstance.current) {
      const timer = setTimeout(() => {
        chartInstance.current?.resize();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    let isMounted = true;

    async function loadMapAndInit() {
      const response = await fetch('/data/map/geoData.json');
      const geoJson = await response.json();

      const geoIdMap = new Map<string, string>();
      const departmentCentroids: Record<string, [number, number]> = {};
      geoJson.features.forEach((feature: any) => {
        const { name, code } = feature.properties;
        if (name && code !== undefined) {
          geoIdMap.set(name, code);
          
          // Calcular centroides para incidentes
          function extractCoords(coords: any): [number, number][] {
            if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
              return [[coords[0], coords[1]]];
            } else if (Array.isArray(coords)) {
              return coords.flatMap(extractCoords);
            } else {
              return [];
            }
          }
          const allCoords: [number, number][] = extractCoords(feature.geometry.coordinates);
          let sumLon = 0, sumLat = 0;
          allCoords.forEach(([lon, lat]) => {
            sumLon += lon;
            sumLat += lat;
          });
          const n = allCoords.length;
          departmentCentroids[name] = n > 0 ? [sumLon / n, sumLat / n] : [0, 0];
        }
      });
      geoIdMapRef.current = geoIdMap;

      echarts.registerMap('bolivia', geoJson);

      if (chartRef.current && isMounted) {
        chartInstance.current = echarts.init(chartRef.current);
        
        chartInstance.current.on('click', (params: any) => {
          // Click en el mapa (departamento)
          const code = params?.data?.code ?? null;
          setSelectedLocationCode(typeof code === 'string' ? code : null);
        });

        // --- INCIDENTES ---
        // Agrupar incidentes por departamento (usando la parte antes del guion en location)
        const incidentPoints: any[] = [];
        const departmentIncidentCount: Record<string, number> = {};
        incidents.forEach((incident) => {
          const dept = incident.location.es.split(' - ')[0];
          departmentIncidentCount[dept] = (departmentIncidentCount[dept] || 0) + 1;
        });
        // Para distribuir los puntos si hay varios en el mismo departamento
        const departmentIncidentOffsets: Record<string, number> = {};
        incidents.forEach((incident) => {
          const dept = incident.location.es.split(' - ')[0];
          const centroid = departmentCentroids[dept];
          if (!centroid) return;
          const count = departmentIncidentCount[dept];
          const idx = departmentIncidentOffsets[dept] || 0;
          // Distribuir en círculo si hay varios
          let offsetLon = 0, offsetLat = 0;
          if (count > 1) {
            const angle = (2 * Math.PI * idx) / count;
            const radius = 0.3; // grados, ajustar si necesario
            offsetLon = Math.cos(angle) * radius;
            offsetLat = Math.sin(angle) * radius;
          }
          departmentIncidentOffsets[dept] = idx + 1;
          incidentPoints.push({
            name: dept,
            value: [centroid[0] + offsetLon, centroid[1] + offsetLat],
            incidentId: incident.id,
            incident,
            symbolSize: 8,
            itemStyle: {
              color:
                incident.status === 'stuck'
                  ? '#ef4444'
                  : incident.status === 'new'
                  ? '#2563eb'
                  : '#22c55e',
              borderColor: '#fff',
              borderWidth: 2,
              shadowBlur: 8,
              shadowColor:
                incident.status === 'stuck'
                  ? '#ef4444'
                  : incident.status === 'new'
                  ? '#2563eb'
                  : '#22c55e',
            },
          });
        });

        chartInstance.current.setOption({
          title: {
            text: t('map.title', {
              name: getDepartmentName(selectedLocationCode),
            }),
            left: 'center',
            textStyle: {
              color: '#FFFFFF',
              fontSize: 16,
              fontWeight: 'bold',
            },
          },
          tooltip: {
            trigger: 'item',
            position: 'right',
            backgroundColor: '#0F172A',
            borderColor: '#10B981',
            borderWidth: 2,
            textStyle: {
              color: '#FFFFFF',
              fontSize: 10,
            },
            formatter: (params: any) => {
              const name = params?.name ?? '';
              const code = geoIdMapRef.current.get(name) ?? 'N/A';
              return `<b>Departamento</b>  <br/><b style="color: #10B981">${name} <br/> `;
            },
          },
          geo: {
            map: 'bolivia',
            roam: false,
            label: { show: false },
            itemStyle: {
              areaColor: '#1E293B',
              borderColor: '#10B981',
              borderWidth: 1,
            },
            emphasis: {
              itemStyle: {
                areaColor: '#10B981',
                borderColor: '#FFFFFF',
                borderWidth: 1,
              },
            },
          },
          series: [
            {
              name: 'Departments',
              type: 'map',
              map: 'bolivia',
              geoIndex: 0,
              selectedMode: 'single',
              data: Array.from(geoIdMapRef.current.entries()).map(([name, code]) => ({
                name,
                value: 0,
                code,
              })),
              itemStyle: {
                areaColor: '#1E293B',
                borderColor: '#10B981',
                borderWidth: 1,
              },
              label: {
                show: false,
              },
              emphasis: {
                itemStyle: {
                  areaColor: '#10B981',
                  borderColor: '#FFFFFF',
                  borderWidth: 1,
                },
                label: {
                  show: true,
                  color: '#0F172A',
                  fontSize: 12,
                  fontWeight: 'bold',
                },
              },
              select: {
                itemStyle: {
                  areaColor: '#10B981',
                  borderColor: '#FFFFFF',
                  borderWidth: 1,
                },
                label: {
                  show: true,
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  fontSize: 12,
                },
              },
            },
            // --- PUNTOS DE INCIDENTES ---
            {
              name: 'Incidents',
              type: 'scatter',
              coordinateSystem: 'geo',
              data: incidentPoints,
              symbol: 'circle',
              zlevel: 10,
              tooltip: {
                show: true,
                formatter: (params: any) => {
                  const incident = params.data.incident;
                  const color =
                    incident.status === 'stuck'
                      ? '#ef4444'
                      : incident.status === 'new'
                      ? '#2563eb'
                      : '#22c55e';
                  return `<b style='color:${color}'>${incident.title.es}</b><br/>${incident.location.es}`;
                },
              },
              emphasis: {
                itemStyle: {
                  borderColor: '#fff',
                  borderWidth: 3,
                  shadowBlur: 12,
                  shadowColor: (params: any) => {
                    const incident = params.data.incident;
                    return incident.status === 'stuck'
                      ? '#ef4444'
                      : incident.status === 'new'
                      ? '#2563eb'
                      : '#22c55e';
                  },
                },
              },
            },
          ],
        });

        // Click en puntos de incidente
        chartInstance.current.on('click', (params: any) => {
          if (params.seriesType === 'scatter' && params.data.incidentId) {
            console.log('Click en punto rojo:', params.data.incidentId);
            // TODO: Handle incident click - could open a modal or navigate to incident details
          } else {
            const code = params?.data?.code ?? null;
            setSelectedLocationCode(typeof code === 'string' ? code : null);
          }
        });

        const handleResize = () => chartInstance.current?.resize();
        window.addEventListener('resize', handleResize);
        
        // Forzar resize inicial después de un pequeño delay
        setTimeout(() => {
          chartInstance.current?.resize();
        }, 100);

        return () => {
          window.removeEventListener('resize', handleResize);
          chartInstance.current?.dispose();
        };
      }
    }

    loadMapAndInit();
    return () => {
      isMounted = false;
    };
  }, [mounted, t, selectedLocationCode, incidents]);

const getDepartmentName = (code: string | null): string => {
  if (code === null) return t('map.national');

  for (const [name, mapCode] of geoIdMapRef.current.entries()) {
    if (mapCode === code) {
      return name;
    }
  }

  return `ID: ${code}`;
};

  return (
    <div className="flex flex-col items-center w-full h-full">
      {/* IncidentsFlag */}
      <IncidentsFlag
        incidents={incidents}
        onIncidentsChange={() => {}}
      />
      {selectedLocationCode !== null && (
        <div className="w-full max-w-2xl text-center mb-4" style={{ minHeight: '40px' }}>
          <button
            onClick={() => setSelectedLocationCode(null)}
            className={`text-sm text-white bg-emerald-600 hover:bg-emerald-700 px-6 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 hover:scale-105 ${
              selectedLocationCode !== null ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
            }`}
          >
            {t('map.return_global')}
          </button>
        </div>
      )}
      
      {/* Contenedor principal del mapa con diseño mejorado */}
      <div className="relative w-full" style={{ height: '450px', minHeight: '450px' }}>
        {/* Fondo decorativo con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/20 via-slate-900/40 to-emerald-900/20 rounded-2xl blur-xl transform scale-105"></div>
        
        {/* Contenedor del mapa */}
        <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-slate-700/50" style={{ height: '100%' }}>
          {/* Decoración superior */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent rounded-full"></div>
          </div>
          
          {/* Indicadores de esquina */}
          <div className="absolute top-4 left-4 w-3 h-3 border-l-2 border-t-2 border-emerald-500/60 rounded-tl-lg"></div>
          <div className="absolute top-4 right-4 w-3 h-3 border-r-2 border-t-2 border-emerald-500/60 rounded-tr-lg"></div>
          <div className="absolute bottom-4 left-4 w-3 h-3 border-l-2 border-b-2 border-emerald-500/60 rounded-bl-lg"></div>
          <div className="absolute bottom-4 right-4 w-3 h-3 border-r-2 border-b-2 border-emerald-500/60 rounded-br-lg"></div>
          
          {/* El mapa */}
          <div
            ref={chartRef}
            className="w-full relative overflow-hidden rounded-xl"
            style={{
              height: 'calc(100% - 60px)',
              minHeight: '380px',
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.9) 100%)',
              boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.3), 0 4px 20px rgba(16, 185, 129, 0.1)',
            }}
          >
            {/* Efecto de brillo sutil */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-emerald-500/5 pointer-events-none"></div>
          </div>
          
          {/* Información adicional en la parte inferior */}
          <div className="mt-2 flex justify-between items-center text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span>Datos actualizados</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>Incidentes activos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default map;
