/**
 * Servicio para extraer metadatos de URLs
 * Lee OpenGraph tags y metadata
 */

export interface ExtractedMetadata {
  title?: string;
  description?: string;
  company?: string;
  location?: string;
  salary?: string;
  image?: string;
}

/**
 * Extrae metadatos de una URL usando OpenGraph tags
 */
export async function extractMetadataFromUrl(
  url: string
): Promise<ExtractedMetadata> {
  try {
    // Validar URL
    const urlObj = new URL(url);

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();

    // Extraer metadatos
    const metadata: ExtractedMetadata = {};

    // og:title
    const titleMatch = html.match(
      /<meta\s+property="og:title"\s+content="([^"]+)"/i
    );
    if (titleMatch) {
      metadata.title = titleMatch[1];
    }

    // og:description
    const descMatch = html.match(
      /<meta\s+property="og:description"\s+content="([^"]+)"/i
    );
    if (descMatch) {
      metadata.description = descMatch[1];
    }

    // og:image
    const imageMatch = html.match(
      /<meta\s+property="og:image"\s+content="([^"]+)"/i
    );
    if (imageMatch) {
      metadata.image = imageMatch[1];
    }

    // Extraer info del título (heurística simple)
    if (metadata.title) {
      const parts = metadata.title.split(" at ");
      if (parts.length === 2) {
        metadata.company = parts[1].split(" | ")[0].trim();
      }
    }

    // Extraer location y salary del description (heurística)
    if (metadata.description) {
      const locMatch = metadata.description.match(/([A-Z][a-z]+,?\s*[A-Z]{2})/);
      if (locMatch) {
        metadata.location = locMatch[0];
      }

      const salaryMatch = metadata.description.match(
        /\$[\d,]+(?:\s*-\s*\$[\d,]+)?/
      );
      if (salaryMatch) {
        metadata.salary = salaryMatch[0];
      }
    }

    return metadata;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    console.error("Error extracting metadata:", errorMessage);
    return {};
  }
}

/**
 * Limpia y normaliza el título para extraer job title, company, location
 */
export function extractJobTitle(title: string): string {
  if (!title) return "";

  // Primero elimina "| LinkedIn" o similares del final
  let cleaned = title.replace(
    /\s*\|\s*(LinkedIn|Indeed|Glassdoor|Job|Position|Role).*$/i,
    ""
  );

  // Patrón LinkedIn: "Company hiring Job Title in Location"
  // Extrae lo que está entre "hiring" e "in"
  let match = cleaned.match(/hiring\s+(.+?)\s+in\s+/i);
  if (match) {
    const jobTitle = match[1].trim();
    // Asegúrate de que no sea demasiado corto y no contenga "hiring"
    if (
      jobTitle &&
      jobTitle.length > 2 &&
      !jobTitle.toLowerCase().includes("hiring")
    ) {
      return jobTitle;
    }
  }

  // Patrón alternativo: "Company hiring for Job Title"
  match = cleaned.match(/hiring\s+for\s+([^,|–—\n]+)/i);
  if (match) {
    return match[1].trim();
  }

  // Formato típico: "Title at Company" o "Title - Company"
  // Extrae antes de "at" o "-"
  const parts = cleaned.split(/\s+(?:at|in|-)\s+/i);
  if (parts.length > 0) {
    return parts[0].trim();
  }

  return cleaned;
}

/**
 * Extrae la empresa del título
 */
export function extractCompanyFromTitle(title: string): string | undefined {
  if (!title) return undefined;

  // Primero elimina "| LinkedIn" o similares del final
  let cleaned = title.replace(
    /\s*\|\s*(LinkedIn|Indeed|Glassdoor|Job|Position|Role).*$/i,
    ""
  );

  // Patrón LinkedIn: "Company hiring Job Title in Location"
  // Extrae la Company (antes de "hiring")
  let match = cleaned.match(/^([^|]+?)\s+hiring\s+/i);
  if (match) {
    const company = match[1].trim();
    if (company && company.length > 1 && company.toLowerCase() !== "linkedin") {
      return company;
    }
  }

  // Patrón alternativo: "Company hiring for Job Title"
  match = cleaned.match(/^([^|]+?)\s+hiring\s+for/i);
  if (match) {
    const company = match[1].trim();
    if (company && company.length > 1) return company;
  }

  // Formato: "Title at Company"
  match = cleaned.match(/at\s+([^,|–—\n]+)/i);
  if (match) {
    const company = match[1].trim();
    if (company && company.length > 1 && company.toLowerCase() !== "linkedin") {
      return company;
    }
  }

  // Formato: "Title - Company"
  match = cleaned.match(/-\s+([^,|–—\n]+)/i);
  if (match) {
    const company = match[1].trim();
    if (company && company.length > 1 && company.toLowerCase() !== "linkedin") {
      return company;
    }
  }

  // Formato: "Title | Company"
  match = cleaned.match(/\|\s*([^,|–—\n]+)/i);
  if (match) {
    const company = match[1].trim();
    if (company && company.length > 1 && company.toLowerCase() !== "linkedin") {
      return company;
    }
  }

  // Formato LinkedIn: "Title in Company, Location"
  match = cleaned.match(/in\s+([^,|–—\n]+),/i);
  if (match) {
    const company = match[1].trim();
    // Evitar que "Location" sea detectado como company
    if (
      company &&
      company.length > 2 &&
      !company.match(/^[A-Z][a-z]+$/) &&
      company.toLowerCase() !== "linkedin"
    ) {
      return company;
    }
  }

  return undefined;
}

/**
 * Extrae la ubicación del título o description
 */
export function extractLocationFromText(text: string): string | undefined {
  // Busca patrones: "City, State" o "City, Country"
  const match = text.match(/in\s+([A-Z][a-z]+,?\s*[A-Z][a-z\s]*)/i);
  if (match) {
    return match[1].trim();
  }

  // Busca solo "City, StateCode"
  const cityStateMatch = text.match(/([A-Z][a-z]+,\s*[A-Z]{2})/);
  if (cityStateMatch) {
    return cityStateMatch[0];
  }

  return undefined;
}
