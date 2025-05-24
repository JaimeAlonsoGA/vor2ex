export function parseSalesVolume(salesVolumeRaw?: string, locale: string = "es"): number | undefined {
    if (!salesVolumeRaw) return undefined;
    const normalized = salesVolumeRaw.trim().toLowerCase();

    if (locale.startsWith("es")) {
        const match = normalized.match(/^([\d,.]+)\s*mil/i);
        if (match) {
            const num = parseFloat(match[1].replace(",", "."));
            return Math.round(num * 1000);
        }
        const matchSimple = normalized.match(/^([\d,.]+)/);
        if (matchSimple) {
            return parseInt(matchSimple[1].replace(/[.,]/g, ""), 10);
        }
    }

    if (locale.startsWith("en")) {
        const match = normalized.match(/^([\d,.]+)\s*(k|thousand)/i);
        if (match) {
            const num = parseFloat(match[1].replace(",", "."));
            return Math.round(num * 1000);
        }
        const matchSimple = normalized.match(/^([\d,.]+)/);
        if (matchSimple) {
            return parseInt(matchSimple[1].replace(/[.,]/g, ""), 10);
        }
    }

    const fallback = normalized.match(/([\d,.]+)/);
    if (fallback) {
        return parseInt(fallback[1].replace(/[.,]/g, ""), 10);
    }
    return undefined;
}


export function formatDate(dateStr?: string) {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export function estimateMonthlySales(rank?: number): number | undefined {
    if (!rank || rank <= 0) return undefined;

    // Parámetros ajustados para simular la curva realista de ventas vs BSR
    // Puedes ajustar estos valores según la categoría si tienes ese dato
    const a = 120000; // Escala máxima de ventas para BSR=1
    const b = 1.7;    // Exponente para ajustar la caída de ventas

    // Fórmula logarítmica ajustada: ventas = a / (rank ^ b)
    const estimated = a / Math.pow(rank, b);

    // Limita el rango para evitar valores extremos
    if (estimated > 5000) return 5000;
    if (estimated < 1) return 0;

    return Math.round(estimated);
}
