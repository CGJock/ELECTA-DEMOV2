'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import socket from '@contexts/context';
import { useSocketData } from '@contexts/context';
import { useTranslation } from 'react-i18next'; 
import { mockIncidents } from '@data/mockIncidents';
import type { Incident } from '@/types/election';
import { IncidentsFlag } from '@components/IncidentsFlag';

interface PartyData {
  name: string;
  abbr: string;
  count: number;
  percentage: number;
} 

interface LocationSummary {
  locationCode: string;
  locationName: string;
  totalVotes: number;
  partyBreakdown: PartyData[];
}

interface MapProps {
  incidents: Incident[];
}

const Map: React.FC<MapProps> = ({ incidents }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.EChartsType | null>(null);
  const [mounted, setMounted] = useState(false);
  const geoIdMapRef = useRef<Map<string, string>>(new globalThis.Map());
  const { setSelectedLocationCode, selectedLocationCode, breakdownData, setbreakdownLocData} = useSocketData();
  const { t } = useTranslation();
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [incidentModalOpen, setIncidentModalOpen] = useState(false);
  const [focusedIncidentId, setFocusedIncidentId] = useState<string | null>(null);


  useEffect(() => {
  const handleSummary = (data: LocationSummary) => {
    console.log('Recieved data by Location:', data);
    setbreakdownLocData(data);
    setTimestamp(new Date().toISOString());
  };


  return () => {
    socket.off('location-breakdown-summary', handleSummary);
  };
}, []);

 

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let isMounted = true;

    async function loadMapAndInit() {
      const response = await fetch('/data/map/geoData.json');
      const geoJson = await response.json();

      const geoIdMap = new globalThis.Map();
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
 
 
        // if there is an instance, it destroys it
  const existingInstance = echarts.getInstanceByDom(chartRef.current);
  if (existingInstance) {
    echarts.dispose(chartRef.current);
  }

  chartInstance.current = echarts.init(chartRef.current);

  chartInstance.current.on('click', (params: any) => {
    // Click en puntos de incidente
    if (params.seriesType === 'scatter' && params.data.incidentId) {
      console.log('Click en punto de incidente:', params.data.incidentId);
      setIncidentModalOpen(true);
      setFocusedIncidentId(params.data.incidentId);
    } else {
      // Click en el mapa (departamento)
      const code = params?.data?.code ?? null; 
      if (code) {
        socket.emit('subscribe-to-location', code);
        setSelectedLocationCode(code);
      }
    }
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

         const handleResize = () => chartInstance.current?.resize();
            window.addEventListener('resize', handleResize);

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
    <div className="flex flex-col items-center mt-6">
      {/* IncidentsFlag modal controlado desde Map */}
      <IncidentsFlag
        key={focusedIncidentId}
        incidents={incidents}
        isOpen={incidentModalOpen}
        focusedIncidentId={focusedIncidentId || undefined}
        hideButton={incidentModalOpen}
        onIncidentsChange={() => {}}
        onClose={() => {
          setIncidentModalOpen(false);
          setFocusedIncidentId(null);
        }}
      />
         {selectedLocationCode !== null && (
          <div className="w-full text-center mt-3" style={{ minHeight: '30px' }}>
            <button
              onClick={() => {
                  if (selectedLocationCode) {
                    socket.emit('unsubscribe-location', selectedLocationCode);
                  }
                  setSelectedLocationCode(null);
                  setbreakdownLocData(null); 
                }}
              
              className={`text-xs text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded-full transition duration-200 ${
                selectedLocationCode !== null ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
    {t('map.return_global')}
    
  </button>
</div>
        )}
      <div
        ref={chartRef}
        style={{
          height: '440px',
          width: '300px',
          alignItems: 'center',
          marginTop: '1.5rem',
          border: '2px solid #374151',
          padding: '15px',
          borderRadius: '12px',
          background: 'none',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          position: 'relative',
        }}
      >
       
      </div>
    </div>
  );
};

export default Map;
