'use client';
import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useSocketData } from '@contexts/context';
import { useTranslation } from 'react-i18next';


const DownloadExcel: React.FC = () => {
  const { globalSummary, breakdownLocData, selectedLocationCode } = useSocketData();
  const { t } = useTranslation();

  const currentSummary = selectedLocationCode && breakdownLocData
    ? breakdownLocData.partyBreakdown
    : globalSummary?.politicalParties || [];

  const totalVotes = selectedLocationCode && breakdownLocData
    ? breakdownLocData.totalVotes
    : globalSummary?.validVotes || 0;

  const handleDownload = () => {
    if (!currentSummary.length) return;

    // Hoja 1: Resumen por partido
    const resumenPartidos = currentSummary.map(({ abbr, count, percentage }) => ({
      [t('excel.party')]: abbr,
      [t('excel.votes')]: count,
      [t('excel.percentage')]: typeof percentage === 'string' ? `${percentage}%` : `${percentage.toFixed(2)}%`,
    }));
    const sheet1 = XLSX.utils.json_to_sheet(resumenPartidos);

    // Hoja 2: Datos de votos generales
    const resumenExtra = selectedLocationCode && breakdownLocData
      ? [
          { [t('excel.type')]: t('excel.total_votes'), Valor: totalVotes },
        ]
      : globalSummary
      ? [
          { [t('excel.type')]: t('excel.total_votes'), Valor: globalSummary.validVotes },
          { [t('excel.type')]: t('excel.valid_votes'), Valor: globalSummary.validVotes },
          { [t('excel.type')]: t('excel.null_votes'), Valor: globalSummary.nullVotes },
          { [t('excel.type')]: t('excel.blank_votes'), Valor: globalSummary.blankVotes },
        ]
      : [];

    const sheet2 = XLSX.utils.json_to_sheet(resumenExtra);

    // Hoja 3: Metadata
    const locationName = selectedLocationCode && breakdownLocData?.locationName
      ? breakdownLocData.locationName
      : 'Global';
    const metadata = [
      { [t('excel.field')]: t('excel.location'), Valor: locationName },
      { [t('excel.field')]: t('excel.timestamp'), Valor: new Date().toLocaleString() },
    ];
    const sheet3 = XLSX.utils.json_to_sheet(metadata);

    // Crear libro
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet1, 'Resumen');
    if (resumenExtra.length) XLSX.utils.book_append_sheet(workbook, sheet2, 'Resumen Detallado');
    XLSX.utils.book_append_sheet(workbook, sheet3, 'Metadata');

    // Descargar
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `Resumen_${locationName}_${new Date().toISOString().slice(0,19).replace(/[:T]/g, '-')}.xlsx`);
  };

  return (
    <button onClick={handleDownload} className="mt-2 px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition">
      {t('votechart.download')}
    </button>
  );
};

export default DownloadExcel;
