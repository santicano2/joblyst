import {
  Application,
  ApplicationStatus,
  JobType,
  JobSource,
} from "@/types/applications";

export function exportToCSV(applications: Application[]): void {
  if (applications.length === 0) {
    alert("No hay postulaciones para exportar");
    return;
  }

  // Headers - solo los campos relevantes
  const headers = [
    "Empresa",
    "Puesto",
    "Ubicación",
    "Tipo",
    "Estado",
    "Fecha de Postulación",
    "Fuente",
    "Salario (Rango)",
    "Respuesta Recibida",
    "Fecha Entrevista",
    "Notas",
  ];

  // Map applications to CSV rows
  const rows = applications.map((app) => [
    escapeCsvValue(app.company),
    escapeCsvValue(app.jobTitle),
    escapeCsvValue(app.location),
    formatJobType(app.jobType),
    formatStatus(app.status),
    formatDate(app.dateApplied),
    app.source,
    formatSalaryRange(app),
    app.responseReceived ? "Sí" : "No",
    app.interviewDate ? formatDate(app.interviewDate) : "-",
    escapeCsvValue(app.notes || ""),
  ]);

  // Build CSV content with proper formatting
  const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
    "\n"
  );

  // Download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `postulaciones_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function exportToPDF(applications: Application[]): Promise<void> {
  if (applications.length === 0) {
    alert("No hay postulaciones para exportar");
    return;
  }

  try {
    // Dynamic imports for client-side only
    const { jsPDF } = await import("jspdf");

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const cellHeight = 8;
    let yPosition = 35;

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Reporte de Postulaciones", pageWidth / 2, 15, {
      align: "center",
    });

    // Date
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(
      `Generado: ${new Date().toLocaleDateString("es-AR")}`,
      pageWidth / 2,
      22,
      { align: "center" }
    );

    // Summary stats
    const stats = getStatsForReport(applications);
    doc.setFontSize(9);
    doc.text(
      `Total: ${applications.length} | Postuladas: ${stats.applied} | Entrevistas: ${stats.interviews} | Ofertas: ${stats.offers} | Rechazadas: ${stats.rejected}`,
      pageWidth / 2,
      28,
      { align: "center" }
    );

    // Table headers
    const headers = [
      "Empresa",
      "Puesto",
      "Ubicación",
      "Tipo",
      "Estado",
      "Fecha",
      "Fuente",
      "Salario",
      "Respuesta",
    ];
    const columnWidths = [25, 25, 18, 15, 15, 18, 15, 20, 12];
    const totalWidth = columnWidths.reduce((a, b) => a + b, 0);
    const scale = (pageWidth - 2 * margin) / totalWidth;
    const scaledColWidths = columnWidths.map((w) => w * scale);

    // Draw header
    doc.setFillColor(59, 130, 246);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);

    let xPos = margin;
    headers.forEach((header, idx) => {
      doc.rect(xPos, yPosition, scaledColWidths[idx], cellHeight, "F");
      doc.text(header, xPos + 1, yPosition + cellHeight / 2 + 1.5, {
        maxWidth: scaledColWidths[idx] - 2,
      });
      xPos += scaledColWidths[idx];
    });

    yPosition += cellHeight;

    // Draw rows
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    applications.forEach((app, idx) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = margin;

        // Redraw header on new page
        doc.setFillColor(59, 130, 246);
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);

        xPos = margin;
        headers.forEach((header, headerIdx) => {
          doc.rect(
            xPos,
            yPosition,
            scaledColWidths[headerIdx],
            cellHeight,
            "F"
          );
          doc.text(header, xPos + 1, yPosition + cellHeight / 2 + 1.5, {
            maxWidth: scaledColWidths[headerIdx] - 2,
          });
          xPos += scaledColWidths[headerIdx];
        });

        yPosition += cellHeight;
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
      }

      // Alternate row colors
      if (idx % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(margin, yPosition, pageWidth - 2 * margin, cellHeight, "F");
      }

      const rowData = [
        app.company,
        app.jobTitle,
        app.location,
        formatJobType(app.jobType),
        formatStatus(app.status),
        formatDate(app.dateApplied),
        app.source,
        app.salaryMin && app.salaryMax
          ? `${app.salaryMin}-${app.salaryMax}`
          : app.salaryMin || app.salaryMax || "-",
        app.responseReceived ? "Sí" : "No",
      ];

      xPos = margin;
      rowData.forEach((cell, cellIdx) => {
        doc.text(String(cell), xPos + 1, yPosition + cellHeight / 2 + 1.5, {
          maxWidth: scaledColWidths[cellIdx] - 2,
        });
        xPos += scaledColWidths[cellIdx];
      });

      yPosition += cellHeight;
    });

    // Footer with page numbers
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, pageHeight - 5, {
        align: "center",
      });
    }

    // Download
    doc.save(`postulaciones_${new Date().toISOString().split("T")[0]}.pdf`);
  } catch (error) {
    console.error("Error al exportar PDF:", error);
    throw new Error("Error al generar el PDF");
  }
}

// Helper functions
function escapeCsvValue(value: string | undefined | null): string {
  if (!value) return "";
  const escaped = value.replace(/"/g, '""');
  return `"${escaped}"`;
}

function formatDate(date: string | Date): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("es-AR");
}

function formatStatus(status: ApplicationStatus): string {
  const statusMap: Record<ApplicationStatus, string> = {
    applied: "Postulada",
    interview: "Entrevista",
    offer: "Oferta",
    rejected: "Rechazada",
  };
  return statusMap[status] || status;
}

function formatJobType(jobType: JobType): string {
  const jobTypeMap: Record<JobType, string> = {
    "full-time": "Tiempo Completo",
    "part-time": "Tiempo Parcial",
    contract: "Contrato",
    freelance: "Freelance",
  };
  return jobTypeMap[jobType] || jobType;
}

function formatSalaryRange(app: Application): string {
  if (app.salaryMin && app.salaryMax) {
    return `${app.salaryMin}-${app.salaryMax} ${app.salaryCurrency || "USD"}`;
  } else if (app.salaryMin) {
    return `${app.salaryMin}+ ${app.salaryCurrency || "USD"}`;
  } else if (app.salaryMax) {
    return `Hasta ${app.salaryMax} ${app.salaryCurrency || "USD"}`;
  }
  return "-";
}

function getStatsForReport(applications: Application[]) {
  return {
    applied: applications.filter((a) => a.status === "applied").length,
    interviews: applications.filter((a) => a.status === "interview").length,
    offers: applications.filter((a) => a.status === "offer").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };
}
