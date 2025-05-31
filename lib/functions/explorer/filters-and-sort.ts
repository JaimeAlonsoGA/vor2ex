export function getFiltersAndSort(searchParams: Record<string, string | string[] | undefined>, categories: string[]) {
    return {
        filters: {
            verifiedOnly: searchParams.verifiedOnly === 'true',
            guaranteedOnly: searchParams.guaranteedOnly === 'true',
            minRating: Number(searchParams.minRating) || 0,
            maxRating: Number(searchParams.maxRating) || 5,
            maxMOQ: searchParams.maxMOQ || '',
            amazonCategory: searchParams.amazonCategory || '',
            categories,
        },
        sortField: (searchParams.sortField as string) || 'price',
        sortOrder: (searchParams.sortOrder as string) || 'asc',
    };
}