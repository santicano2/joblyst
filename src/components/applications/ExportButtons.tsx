"use client";

import { useState } from "react";
import { Application } from "@/types/applications";
import { exportToCSV, exportToPDF } from "@/utils/exportUtils";

interface ExportButtonsProps {
  applications: Application[];
}

export default function ExportButtons({ applications }: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      exportToCSV(applications);
    } catch (error) {
      console.error("Error al exportar CSV:", error);
      alert("Error al exportar CSV");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportToPDF(applications);
    } catch (error) {
      console.error("Error al exportar PDF:", error);
      alert("Error al exportar PDF");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <button
        onClick={handleExportCSV}
        disabled={isExporting || applications.length === 0}
        className="flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white text-sm sm:text-base rounded-lg transition cursor-pointer border-2 border-green-600 disabled:border-green-400 disabled:cursor-not-allowed"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 19l9 2-9-18-9 18 9-2m0 0v-8m0 8H3m6-6h6m0 0V5m0 6H9"
          />
        </svg>
        CSV
      </button>

      <button
        onClick={handleExportPDF}
        disabled={isExporting || applications.length === 0}
        className="flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white text-sm sm:text-base rounded-lg transition cursor-pointer border-2 border-red-600 disabled:border-red-400 disabled:cursor-not-allowed"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
        PDF
      </button>
    </div>
  );
}
