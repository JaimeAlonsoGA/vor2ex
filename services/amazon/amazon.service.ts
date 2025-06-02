"use server"

import { AmazonSearchApiResponse } from "@/types/amazon/amazon-search";
import config from "@/orm.config";

export { fetchAmazonSearch }

async function fetchAmazonSearch(keyword: string, domain: string, page: number): Promise<AmazonSearchApiResponse> {
    const auth = config.decodo.access_token;

    const response = await fetch(config.decodo.baseUrl, {
        method: "POST",
        body: JSON.stringify({
            "target": "amazon_search",
            "query": keyword,
            "page_from": page.toString(),
            "device_type": "desktop_chrome",
            "parse": true,
            "domain": domain,
        }),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${auth}`
        },
    }).catch(error => {
        console.log(error);
        return undefined;
    });

    if (!response) throw new Error("Error fetching scraper API");

    return await response.json() as AmazonSearchApiResponse;
}
