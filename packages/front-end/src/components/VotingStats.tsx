import React from 'react';

const VotingStats: React.FC = () => {
  // Hardcoded voting statistics data
  const stats = {
    totalVotes: 2847592,
    validVotes: {
      count: 2650234,
      percentage: 93.1
    },
    nullVotes: {
      count: 152847,
      percentage: 5.4
    },
    blankVotes: {
      count: 44511,
      percentage: 1.5
    }
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Estadísticas de Votación
      </h2>
      
      <div className="space-y-4">
        {/* Total Votes - More prominent */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300 font-medium">
              Total de Votos Emitidos
            </span>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatNumber(stats.totalVotes)}
            </span>
          </div>
        </div>

        {/* Valid Votes */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-300">
            Votos Válidos
          </span>
          <div className="text-right">
            <span className="text-lg font-semibold text-green-600 dark:text-green-400">
              {formatNumber(stats.validVotes.count)}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              ({stats.validVotes.percentage}%)
            </span>
          </div>
        </div>

        {/* Null Votes */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-300">
            Votos Nulos
          </span>
          <div className="text-right">
            <span className="text-lg font-semibold text-red-600 dark:text-red-400">
              {formatNumber(stats.nullVotes.count)}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              ({stats.nullVotes.percentage}%)
            </span>
          </div>
        </div>

        {/* Blank Votes */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-300">
            Votos en Blanco
          </span>
          <div className="text-right">
            <span className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
              {formatNumber(stats.blankVotes.count)}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              ({stats.blankVotes.percentage}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingStats; 