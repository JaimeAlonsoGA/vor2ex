import sanitizeHtml from 'sanitize-html';
import * as cheerio from 'cheerio';
import { AlibabaSearchProduct } from '@/types/alibaba/alibaba-search';
import { parseAlibabaPrice, parseAlibabaTotalProducts } from './utils';

/**
 * Extrae todos los productos posibles del HTML de Alibaba, tanto SSR como JS embebido.
 * Analiza el DOM y los scripts, y detecta dinámicamente las secciones de productos.
 */
export function scrapeAlibabaHtml(html: string): { totalProducts: number | undefined, products: AlibabaSearchProduct[] } {
    const $ = cheerio.load(html);
    const products: AlibabaSearchProduct[] = [];

    const totalProducts = parseAlibabaTotalProducts(html);

    // --- 1. Productos embebidos en scripts JS ---
    const scripts: string[] = [];
    $('script').each((_, el) => {
        const content = $(el).html();
        if (content && content.includes('window.__page__data_sse10._wending')) {
            scripts.push(content);
        }
    });

    const modelNames = [
        'mainBoothModel',
        'offerListModel',
        'bottomBoothModel',
        'galleryBoothModel',
        'p4pBoothModel',
    ];

    for (const scriptContent of scripts) {
        for (const modelName of modelNames) {
            const regex = new RegExp(
                `window\\.__page__data_sse10\\._wending\\.${modelName}\\s*=\\s*({[\\s\\S]*?});`
            );
            const match = scriptContent.match(regex);
            if (!match) continue;

            let objStr = match[1]
                .replace(/\/\/.*$/gm, '')
                .replace(/,\s*}/g, '}')
                .replace(/,\s*]/g, ']');

            let modelObj: any;
            try {
                modelObj = JSON.parse(objStr);
            } catch {
                try {
                    // eslint-disable-next-line no-eval
                    modelObj = eval('(' + objStr + ')');
                } catch {
                    continue;
                }
            }

            if (Array.isArray(modelObj?.productList)) {
                for (const p of modelObj.productList) {
                    if (!products.some(prod => prod.url === p.detailUrl)) {
                        products.push({
                            title: sanitizeHtml(p.title, { allowedTags: [], allowedAttributes: {} }).trim(),
                            url: p.detailUrl,
                            imageUrl: p.imageUrl?.startsWith('//') ? 'https:' + p.imageUrl : p.imageUrl,
                            price: parseAlibabaPrice(p.localOriginalPriceRangeStr ?? ""),
                            minOrder: p.minOrderDesc ?? '',
                            supplier: p.seller_login_id ?? '',
                            years: undefined,
                            origin: undefined,
                            reviews: undefined,
                            rating: undefined,
                            verified: undefined,
                            guaranteed: undefined,
                            description: '',
                            section: modelName,
                        });
                    }
                }
            }
        }
    }

    // --- 2. Productos SSR en el feed principal ---
    $('[data-content="abox-ProductNormalList"] .fy23-search-card.m-gallery-product-item-v2').each((_, el) => {
        const $card = $(el);

        // Título y URL
        const $titleLink = $card.find('.search-card-e-title a').first();
        const title = $titleLink.text().trim();
        let url = $titleLink.attr('href') || '';
        if (url && !url.startsWith('http')) {
            url = url.startsWith('//') ? `https:${url}` : `https://www.alibaba.com${url}`;
        }

        // Imagen principal
        let imageUrl = $card.find('.search-card-e-slider__img').first().attr('src') || '';
        if (imageUrl && imageUrl.startsWith('//')) imageUrl = `https:${imageUrl}`;

        // Precio
        const price = $card.find('.search-card-e-price-main').first().text().trim();

        // Pedido mínimo
        const minOrder = $card.find('.search-card-m-sale-features__item')
            .filter((_, el) => $(el).text().toLowerCase().includes('orden mín'))
            .first().text().trim();

        // Proveedor
        const supplier = $card.find('.search-card-e-company').first().text().trim();

        // Badges y campos individuales
        let years: number | undefined = undefined;
        let origin: string | undefined = undefined;
        let reviews: number | undefined = undefined;
        let rating: number | undefined = undefined;
        let verified = false;
        let guaranteed = false;

        // Verificado
        if ($card.find('.verified-supplier-icon').length) verified = true;

        // Years y origin (ej: "14añosCN")
        const yearsOriginText = $card.find('.search-card-e-supplier__year').first().text().replace(/\s+/g, '').trim();
        if (yearsOriginText) {
            const match = yearsOriginText.match(/^(\d+)(?:años)?(.*)$/i);
            if (match) {
                years = parseInt(match[1], 10);
                origin = match[2] || undefined;
                origin = origin?.replace("Proveedor", "")
            }
        }

        // Rating y reviews (ej: "5.0/5.0 (6 Opiniones)")
        const reviewText = $card.find('.search-card-e-review').first().text().replace(/\s+/g, ' ').trim();
        if (reviewText) {
            const ratingMatch = reviewText.match(/([\d.]+)\/5\.0/);
            if (ratingMatch) rating = parseFloat(ratingMatch[1]);
            const reviewsMatch = reviewText.match(/\((\d+)/);
            if (reviewsMatch) reviews = parseInt(reviewsMatch[1], 10);
        }

        // Guaranteed (Alibaba Guaranteed)
        if ($card.find('.search-card-e-guaranteed').length) guaranteed = true;

        if (title && url && !products.some(p => p.url === url)) {
            products.push({
                title,
                url,
                imageUrl,
                price: parseAlibabaPrice(price) ?? undefined,
                minOrder,
                supplier,
                years,
                origin,
                reviews,
                rating,
                verified,
                guaranteed,
                description: '',
                section: 'mainBoothModel',
            });
        }
    });

    return { products, totalProducts };
}