import { AMAZON_DOMAINS } from "@/lib/endpoints";

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

export function getAmazonRegionFromDomain(domain: string): string | undefined {
    for (const [region, countries] of Object.entries(AMAZON_DOMAINS)) {
        if (Object.values(countries).includes(domain)) {
            return region;
        }
    }
    return undefined;
}
