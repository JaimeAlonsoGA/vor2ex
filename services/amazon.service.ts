"use server"

import { AmazonSearchApiResponse } from "@/lib/types/amazon/amazon-search";
import config from "@/orm.config";

export { fetchAmazonSearch }

async function fetchAmazonSearch(keyword: string, page: number): Promise<AmazonSearchApiResponse | undefined> {
    const auth = config.decodo.access_token;
    if (!keyword) return;
    const response = await fetch("https://scraper-api.decodo.com/v2/scrape", {
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

    if (response) {
        return await response.json() as AmazonSearchApiResponse;
    } else {
        console.error("No response received from fetching Amazon search.");
    }
}
