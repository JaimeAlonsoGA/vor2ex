"use server"

export { fetchAlibabaSearch };

async function fetchAlibabaSearch(keyword: string, verified?: boolean, guaranteed?: boolean): Promise<any | undefined> {
    const verifiedParam = verified ? "&assessmentCompany=true" : "";
    const guaranteedParam = guaranteed ? "&halfTrust=true" : "";
    const keywordParam = keyword.split(" ").join("+");
    const query = `?spm=a2700.product_home_fy25.home_login_first_screen_fy23_pc_search_bar.keydown__Enter&tab=all&SearchText=${keywordParam}${verifiedParam}${guaranteedParam}`;
    const response = await fetch("https://scraper-api.decodo.com/v2/scrape", {
        method: "POST",
        body: JSON.stringify({
            "url": `https://www.alibaba.com/trade/search${query}`,
            "headless": "html",
            "geo": "United States",
            "locale": "es-es"
        }),
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic VTAwMDAyNzA3NzU6UFdfMTQ5NjE2MzE2MDkwOTMyMjNmNDE2OWJkMmEzYWQ2ZDZl"
        },
    }).catch(error => console.log(error));

    if (response) {
        return await response.json();
    } else {
        console.error("No response received from fetching Alibaba search.");
    }
}
