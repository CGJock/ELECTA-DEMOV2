'use client';
import React, { useEffect } from 'react';
import DownloadExcel from './DownloadExcel';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { useSocketData } from '@/context/context';
import { useTranslation } from 'react-i18next';

type VoteData = {
  name: string;
  abbr: string;
  votes: number;
  totalVotes: number;
  percentage: number;
};

interface VoteChartProps {
  active: boolean;
}

export default function VoteChart({ active }: VoteChartProps) {
  const { globalSummary, breakdownLocData, selectedLocationCode, timestamp } = useSocketData();
  const { t } = useTranslation();

  const currentSummary = selectedLocationCode
    ? breakdownLocData
    : globalSummary;

  console.log(`data actual ${currentSummary?.partyBreakdown}`)
  console.log(`breadownlocdata ${breakdownLocData}`)

  const totalVotes = currentSummary?.totalVotes || 0;
  console.log(selectedLocationCode)

  const data: VoteData[] = Array.isArray(currentSummary?.partyBreakdown)
    ? currentSummary!.partyBreakdown.map((party) => ({
        name: party.name,
        abbr: party.abbr,
        votes: party.count,
        totalVotes,
        percentage: Number(party.percentage),
      })).sort((a, b) => b.percentage - a.percentage)
    : [];

  function generateTicks(max: number, step: number): number[] {
    const ticks = [];
    for (let i = 0; i <= max; i += step) {
      ticks.push(i);
    }
    if (ticks[ticks.length - 1] !== max) {
      ticks.push(max);
    }
    return ticks;
  }

  const tickValues = generateTicks(totalVotes, 50000);

  // Calcular altura dinámica basada en número de partidos
  const dynamicHeight = Math.max(300, data.length * 50 + 100);

  useEffect(() => {
    if (active) {
      window.dispatchEvent(new Event('resize'));
    }
  }, [active]);

  if (!currentSummary || !Array.isArray(currentSummary.partyBreakdown)) {
    return (
      <div className="w-full h-96 flex items-center justify-center text-gray-500">
        Cargando datos de votación...
      </div>
    );
  }

  return (
    <div className="w-full rounded-md flex flex-col p-2" style={{ height: `${dynamicHeight}px` }}>
      <div className="text-center text-base font-semibold text-gray-700 mb-1 select-none">
        {selectedLocationCode === null
          ? t('votechart.national_results')
          : `${t('votechart.department_results')} - ${breakdownLocData?.locationName ?? ''}`}
      </div>

      <div className="flex flex-1">
        <div
          className="flex items-center justify-center text-sm select-none whitespace-nowrap"
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            width: '1.5rem',
            userSelect: 'none',
          }}
        >
          <label>{t('votechart.political_parties')}</label>
        </div>

        <div className="flex-1">
          {data.length > 0 && (
            <ResponsiveContainer width="100%" height="100%" key={totalVotes}>
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 20, right: 80, left: 70, bottom: 5 }} // Más espacio a la derecha para los %
                barCategoryGap="10%" // Espacio entre barras
              >
                <XAxis 
                  type="number" 
                  domain={[0, totalVotes]} 
                  ticks={tickValues}
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                />
                <YAxis
                  type="category"
                  dataKey="abbr"
                  width={60} // Ajustado para el nuevo margen
                  tick={{ 
                    fontSize: 11, 
                    fill: '#F5FBFD',
                    textAnchor: 'end' // Alinear texto a la derecha
                  }}
                  interval={0} // Mostrar todas las etiquetas
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    borderRadius: 8,
                    borderColor: '#374151',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
                  }}
                  labelStyle={{ color: 'white', fontWeight: 'bold', marginBottom: '8px' }}
                  itemStyle={{ color: '#E5E7EB' }}
                  formatter={(value: number, name: string, props: any) => {
                    if (name === 'votes') {
                      return [
                        <>
                          <div style={{ fontWeight: 'bold' }}>{props.payload.name}</div>
                          <div>{value.toLocaleString()} {t('votechart.votes')}</div>
                          <div>{props.payload.percentage}%</div>
                        </>,
                        ''
                      ];
                    }
                    return [value, name];
                  }}
                  labelFormatter={(label) => ''}
                />
                <Bar 
                  dataKey="votes" 
                  fill="#3B82F6"
                  radius={[0, 4, 4, 0]} // Bordes redondeados
                >
                  <LabelList
                    dataKey="percentage"
                    position="right"
                    dx={5} // Cambié la posición
                    dy={0}
                    formatter={(val: number) => `${val}%`}
                    style={{ 
                      fill: '#10B981', 
                      fontWeight: 'bold', 
                      fontSize: '11px',
                      textAnchor: 'start'
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="text-center mt-2 text-sm text-gray-600 select-none">
        <label>{t('votechart.total_votes')}</label>
        {timestamp && (
          <div className="text-center mt-1 text-xs text-gray-500 select-none italic">
            {t('votechart.timestamp', {
              date: new Date(timestamp).toLocaleString()
            })}
          </div>
        )}
        <DownloadExcel />
      </div>
    </div>
  );
}