export function parseAlibabaPrice(priceStr: string): number | undefined {
    if (!priceStr) return undefined;
    // El estándar de Alibaba es: "," = miles, "." = decimales
    // Ej: $1,273.50 => 1273.50
    let clean = priceStr.replace(/[^\d.,]/g, "").trim();

    // Elimina las comas de miles
    clean = clean.replace(/,/g, "");
    // Ahora solo puede quedar el punto decimal
    const num = parseFloat(clean);
    return isNaN(num) ? undefined : num;
}

export function parseAlibabaTotalProducts(html: string): number | undefined {
    // 1. Busca la línea de i18n para saber el patrón
    const i18nMatch = html.match(/"fy24_pc_search_layout\.number":\s*"([^"]+)"/);
    if (!i18nMatch) return undefined;
    const i18nPattern = i18nMatch[1]; // Ej: Mostrando {resultCount} productos de proveedores globales para "{queryWords}"

    // 2. Busca el texto renderizado en el HTML que sigue ese patrón, reemplazando {resultCount} por un número
    // Construye una expresión regular dinámica
    const patternRegexStr = i18nPattern
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escapa regex
        .replace("\\{resultCount\\}", "(?<resultCount>[\\d.,]+)") // Por si ya viene escapado
        .replace("{resultCount}", "(?<resultCount>[\\d.,]+)")
        .replace("{queryWords}", ".+?"); // Ignora el query

    const patternRegex = new RegExp(patternRegexStr, "i");

    // Busca la línea que contiene el texto
    const lineMatch = html.match(patternRegex);
    if (lineMatch && lineMatch.groups?.resultCount) {
        // Limpia el número (puede venir con puntos o comas)
        const numStr = lineMatch.groups.resultCount.replace(/[.,]/g, "");
        return parseInt(numStr, 10);
    }

    // Fallback: busca cualquier texto tipo "Mostrando 1,234 productos de proveedores globales"
    const fallback = html.match(/Mostrando\s+([\d.,]+)\s+productos de proveedores globales/i);
    if (fallback && fallback[1]) {
        const numStr = fallback[1].replace(/[.,]/g, "");
        return parseInt(numStr, 10);
    }

    return undefined;
}