"use server"

import { AmazonSearchApiResponse } from "@/types/amazon/amazon-search";
import config from "@/orm.config";

export { fetchAmazonSearch }

async function fetchAmazonSearch(keyword: string, page: number): Promise<AmazonSearchApiResponse> {
    const auth = config.decodo.access_token;

    const response = await fetch(config.decodo.baseUrl, {
        method: "POST",
        body: JSON.stringify({
            "target": "amazon_search",
            "query": keyword,
            "page_from": page.toString(),
            "parse": true,
            "domain": "es",
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
