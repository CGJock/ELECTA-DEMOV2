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


  const currentSummary =
    selectedLocationCode && breakdownLocData
      ? breakdownLocData
      : globalSummary;

  const totalVotes = currentSummary?.totalVotes || 0;

  const data: VoteData[] =
    currentSummary?.partyBreakdown.map((party) => ({
      name: party.name,
      abbr: party.abbr,
      votes: party.count,
      totalVotes,
      percentage: Number(party.percentage),
    })).sort((a, b) => b.percentage - a.percentage) || [];

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

  useEffect(() => {
    if (active) {
      window.dispatchEvent(new Event('resize'));
    }
  }, [active]);

  return (
    <div className="w-full h-96 min-w-[300px] min-h-[300px]  rounded-md flex flex-col p-2">
      <div className="text-center text-base font-semibold text-gray-700 mb-1 select-none">
        {selectedLocationCode && breakdownLocData?.locationName
          ? `${t('votechart.results')} - ${breakdownLocData.locationName}`
          : t('votechart.national_results')}
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
                margin={{ top: 20, right: 50, left: 10, bottom: 5 }}
              >
                <XAxis type="number" domain={[0, totalVotes]} ticks={tickValues} />
                <YAxis
                  type="category"
                  dataKey="abbr" 
                  width={60}
                  tick={{ fontSize: 12, fill: '#F5FBFD' }}
                  interval={0}
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{
                    backgroundColor: '#333',
                    borderRadius: 8,
                    borderColor: '#555',
                  }}
                  labelStyle={{ color: 'white', fontWeight: 'bold' }}
                  itemStyle={{ color: 'white' }}
                  formatter={(value: number, name: string) =>
                    name === 'votes' ? [`${value}`, t('votechart.votes')] : [`${value}%`, t('votechart.percentage')]
                  }
                />
                <Bar dataKey="votes" fill="#3B82F6">
                  <LabelList
                    dataKey="percentage"
                    position="right"
                    dx={-20}
                    dy={-1}
                    formatter={(val: number) => `${val}%`}
                    style={{ fill: '#10B981', fontWeight: 'bold', fontSize: '10px' }}
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
