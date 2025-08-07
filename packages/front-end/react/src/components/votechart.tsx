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
import { useElectionPhase } from '@/hooks/useElectionPhase';

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
  const { isSecondRound } = useElectionPhase();

  const currentSummary = selectedLocationCode
    ? breakdownLocData
    : globalSummary;

  console.log(`current data ${currentSummary?.partyBreakdown}`)
  console.log(`breakdown location data ${breakdownLocData}`)

  const totalVotes = currentSummary?.totalVotes || 0;
  console.log(selectedLocationCode)

  // Filter data based on election phase
  let filteredData: VoteData[] = [];
  
  if (Array.isArray(currentSummary?.partyBreakdown)) {
    let partyData = currentSummary!.partyBreakdown.map((party) => ({
      name: party.name,
      abbr: party.abbr,
      votes: party.count,
      totalVotes,
      percentage: Number(party.percentage),
    }));

    if (isSecondRound) {
      // In second round, show only the two candidates with most votes
      // Sort by votes and take the first two
      filteredData = partyData
        .sort((a, b) => b.votes - a.votes)
        .slice(0, 2);
    } else {
      // In first round, show all sorted by percentage
      filteredData = partyData.sort((a, b) => b.percentage - a.percentage);
    }
  }

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

  // Calculate dynamic height based on number of parties
  const dynamicHeight = Math.max(300, filteredData.length * 50 + 100);

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

  // If we are in second round and don't have enough data, show message
  if (isSecondRound && filteredData.length < 2) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-700 mb-2">
            {t('secondRound.title')}
          </div>
          <div className="text-gray-500">
            Waiting for first round results to determine candidates advancing to second round.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-md flex flex-col p-2" style={{ height: `${dynamicHeight}px` }}>
      <div className="text-center text-base font-semibold text-gray-700 mb-1 select-none">
        {selectedLocationCode === null
          ? isSecondRound 
            ? t('secondRound.title') 
            : t('votechart.national_results')
          : `${isSecondRound ? t('secondRound.title') : t('votechart.department_results')} - ${breakdownLocData?.locationName ?? ''}`}
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
          <label>{isSecondRound ? t('secondRound.subtitle') : t('votechart.political_parties')}</label>
        </div>

        <div className="flex-1">
          {filteredData.length > 0 && (
            <ResponsiveContainer width="100%" height="100%" key={totalVotes}>
              <BarChart
                data={filteredData}
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
                    border: '1px solid #374151',
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
                        'votes'
                      ];
                    }
                    return [value, name];
                  }}
                />
                <Bar
                  dataKey="votes"
                  fill="#3B82F6"
                  radius={[0, 4, 4, 0]}
                  animationDuration={1000}
                  animationBegin={0}
                >
                  <LabelList
                    dataKey="votes"
                    position="right"
                    formatter={(value: number) => value.toLocaleString()}
                    style={{
                      fontSize: '11px',
                      fill: '#6B7280',
                      fontWeight: 'bold'
                    }}
                  />
                  <LabelList
                    dataKey="percentage"
                    position="insideRight"
                    formatter={(value: number) => `${value.toFixed(1)}%`}
                    style={{
                      fontSize: '10px',
                      fill: 'white',
                      fontWeight: 'bold'
                    }}
                    offset={30}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Excel download button */}
      <div className="mt-4 flex justify-center">
        <DownloadExcel />
      </div>
    </div>
  );
}