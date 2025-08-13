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
import { useSocketData,PartyData, GlobalSummary } from '@/context/context';
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
  const { globalSummary, breakdownLocData, selectedLocationCode } = useSocketData();
  const { t } = useTranslation();

  // Elegir resumen actual: global o por locación
  const currentSummary = selectedLocationCode && breakdownLocData
    ? breakdownLocData.partyBreakdown
    : globalSummary?.politicalParties || [];

  const totalVotes = selectedLocationCode && breakdownLocData
    ? breakdownLocData.totalVotes
    : globalSummary?.validVotes || 0;

  // Convertir datos para Recharts
  const data: VoteData[] = currentSummary.map(party => ({
    name: party.name,
    abbr: party.abbr,
    votes: Number(party.count),
    totalVotes,
    percentage: Number(party.percentage),
  })).sort((a, b) => b.percentage - a.percentage);

  function generateTicks(max: number, step: number): number[] {
    const ticks = [];
    for (let i = 0; i <= max; i += step) ticks.push(i);
    if (ticks[ticks.length - 1] !== max) ticks.push(max);
    return ticks;
  }

  const tickValues = generateTicks(totalVotes, Math.ceil(totalVotes / 5));

  useEffect(() => {
    if (active) window.dispatchEvent(new Event('resize'));
  }, [active]);

  if (!currentSummary.length) {
    return (
      <div className="w-full h-96 flex items-center justify-center text-gray-500">
        Cargando datos de votación...
      </div>
    );
  }

  return (
    <div className="w-full h-96 min-w-[300px] min-h-[300px] rounded-md flex flex-col p-2">
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
          <ResponsiveContainer width="100%" height="100%" key={totalVotes}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 20, right: 80, left: 70, bottom: 5 }}
              barCategoryGap="10%"
            >
              <XAxis type="number" domain={[0, totalVotes]} ticks={tickValues} tick={{ fontSize: 11, fill: '#6B7280' }} />
              <YAxis
                type="category"
                dataKey="abbr"
                width={60}
                tick={{ fontSize: 11, fill: '#F5FBFD', textAnchor: 'end' }}
                interval={0}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                contentStyle={{ backgroundColor: '#1F2937', borderRadius: 8, border: '1px solid #374151' }}
                labelStyle={{ color: 'white', fontWeight: 'bold', marginBottom: 8 }}
                itemStyle={{ color: '#E5E7EB' }}
                formatter={(value, name, props) => {
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
              <Bar dataKey="votes" fill="#3B82F6" radius={[0, 4, 4, 0]}>
                <LabelList dataKey="votes" position="right" formatter={(value: number) => value.toLocaleString()} style={{ fontSize: 11, fill: '#6B7280', fontWeight: 'bold' }} />
                <LabelList dataKey="percentage" position="insideRight" formatter={(value: number) => `${value.toFixed(1)}%`} style={{ fontSize: 10, fill: 'white', fontWeight: 'bold' }} offset={30} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Excel download button */}
      <div className="mt-4 flex justify-center">
        <DownloadExcel />
      </div>
    </div>
  );
}