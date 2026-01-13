/**
 * API para extraer metadatos de URLs
 * POST /api/parse-link
 */

import { NextRequest, NextResponse } from "next/server";
import {
  extractMetadataFromUrl,
  extractJobTitle,
  extractCompanyFromTitle,
  extractLocationFromText,
} from "@/services/linkParser";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "URL es requerida" }, { status: 400 });
    }

    // Validar que sea URL válida
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "URL inválida" }, { status: 400 });
    }

    const metadata = await extractMetadataFromUrl(url);

    // Extraer job title, company, location del título y description
    const jobTitle = metadata.title
      ? extractJobTitle(metadata.title)
      : undefined;

    // Intentar extraer company de múltiples fuentes
    let company =
      extractCompanyFromTitle(metadata.title || "") || metadata.company;

    // Si aún no tiene company, intenta del description
    // Patrón LinkedIn: "Company hiring for Job Title in Location"
    if (!company && metadata.description) {
      const hiringMatch = metadata.description.match(
        /^([^|]+?)\s+hiring\s+for/i
      );
      if (hiringMatch) {
        company = hiringMatch[1].trim();
      }
    }

    // Si aún no tiene company, intenta otro patrón
    if (!company && metadata.description) {
      const descCompanyMatch = metadata.description.match(
        /(?:at|with)\s+([A-Z][a-zA-Z0-9\s&]+?)(?:\s+in|\.|,|$)/
      );
      if (descCompanyMatch) {
        company = descCompanyMatch[1].trim();
      }
    }

    const location =
      extractLocationFromText(metadata.title || "") ||
      extractLocationFromText(metadata.description || "") ||
      metadata.location;

    return NextResponse.json({
      success: true,
      data: {
        jobTitle,
        company,
        location,
        salary: metadata.salary,
        description: metadata.description,
        link: url,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    console.error("Error parsing link:", errorMessage);

    return NextResponse.json(
      { error: `No se pudo extraer datos: ${errorMessage}` },
      { status: 500 }
    );
  }
}
