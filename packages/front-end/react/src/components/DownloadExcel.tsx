'use client';
import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useSocketData } from '@contexts/context';
import { useTranslation } from 'react-i18next';


const DownloadExcel: React.FC = () => {
  const {
    globalSummary,
    breakdownLocData,
    selectedLocationCode,
    breakdownData,
    timestamp,
  } = useSocketData();

  const { t } = useTranslation();
  

  const currentSummary =
    selectedLocationCode && breakdownLocData
      ? breakdownLocData
      : globalSummary;

  const handleDownload = () => {
    if (!currentSummary || !currentSummary.partyBreakdown.length) return;

    // Hoja 1: Resumen por partido
    const resumenPartidos = currentSummary.partyBreakdown.map(({ abbr, count, percentage }) => ({
      [t('excel.party')]: abbr,
      [t('excel.votes')]: count,
      [t('excel.percentage')]: `${percentage}%`,
    }));
    const sheet1 = XLSX.utils.json_to_sheet(resumenPartidos);

    // Hoja 2: Datos de votos generales
    const resumenExtra = breakdownData
      ? [
          { [t('excel.type')]: t('excel.total_votes'), Valor: breakdownData.totalVotes },
          { [t('excel.type')]: t('excel.valid_votes'), Valor: breakdownData.validVotes, Porcentaje: `${breakdownData.validPercent}%` },
          { [t('excel.type')]: t('excel.null_votes'), Valor: breakdownData.nullVotes, Porcentaje: `${breakdownData.nullPercent}%` },
          { [t('excel.type')]: t('excel.blank_votes'), Valor: breakdownData.blankVotes, Porcentaje: `${breakdownData.blankPercent}%` },
        ]
      : [];
    const sheet2 = XLSX.utils.json_to_sheet(resumenExtra);

    // Hoja 3: Metadata (timestamp)
    const fecha = timestamp ? new Date(timestamp).toLocaleString() : 'N/A';
    const location = selectedLocationCode && breakdownLocData?.locationName
      ? breakdownLocData.locationName
      : 'Global';

    const metadata = [
      { [t('excel.field')]: t('excel.location'), Valor: location },
      { [t('excel.field')]: t('excel.timestamp'), Valor: fecha },
    ];
    const sheet3 = XLSX.utils.json_to_sheet(metadata);

    // Crear el libro y añadir las hojas
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet1, 'Resumen');
    if (resumenExtra.length > 0) {
      XLSX.utils.book_append_sheet(workbook, sheet2, 'Resumen Detallado');
    }
    XLSX.utils.book_append_sheet(workbook, sheet3, 'Metadata');

    // Nombre del archivo con timestamp
    const safeTimestamp = timestamp
      ? new Date(timestamp).toISOString().slice(0, 19).replace(/[:T]/g, '-')
      : 'sin-fecha';
    const nombreArchivo = `Resumen_${location}_${safeTimestamp}.xlsx`;

    // Descargar
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, nombreArchivo);
  };

  return (
    <button
      onClick={handleDownload}
      className="mt-2 px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition"
    >
      <label>{t('votechart.download')}</label>
    </button>
  );
};

export default DownloadExcel;
