import { Product } from "@/types/product"

export const exportToCSV = (amazon: Product[], alibaba: Product[]) => {
    const headers = [
        "Source",
        "ID",
        "Name",
        "Brand/Supplier",
        "Price",
        "Rating",
        "Reviews",
        "ASIN",
        "Category",
        "Min. Order",
        "Years",
        "Origin",
        "Verified",
        "Guaranteed",
        "URL",
    ].join(",")

    const amazonRows = amazon.map((p) =>
        [
            p.source,
            p.id,
            `"${p.name}"`,
            `"${p.brand || ""}"`,
            p.price,
            p.rating,
            p.reviews,
            p.asin,
            `"${p.category || ""}"`,
            "",
            "",
            "",
            "",
            "",
            p.url,
        ].join(","),
    )

    const alibabaRows = alibaba.map((p) =>
        [
            p.source,
            p.id,
            `"${p.name}"`,
            `"${p.brand || ""}"`,
            p.price,
            p.rating,
            p.reviews,
            "",
            "",
            p.minOrder,
            p.years,
            `"${p.origin || ""}"`,
            p.verified ? "Yes" : "No",
            p.guaranteed ? "Yes" : "No",
            p.url,
        ].join(","),
    )

    const csv = [headers, ...amazonRows, ...alibabaRows].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "product_comparison.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}