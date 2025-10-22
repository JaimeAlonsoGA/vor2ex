import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { useAuth } from '@/providers/auth-provider';
import { createAmazonApiService, ProductsParams, ProductOffersParams, FeesEstimateParams, PaginationParams } from '@/services/amazon.service';

// Query Keys Factory
export const amazonKeys = {
    all: ['amazon'] as const,
    products: () => [...amazonKeys.all, 'products'] as const,
    productsList: (params: ProductsParams) => [...amazonKeys.products(), 'list', params] as const,
    product: (asin: string) => [...amazonKeys.all, 'product', asin] as const,
    productDetail: (asin: string, endpoint: string, marketplace: string) =>
        [...amazonKeys.product(asin), 'detail', { endpoint, marketplace }] as const,
    productOffers: (asin: string, params: ProductOffersParams) =>
        [...amazonKeys.product(asin), 'offers', params] as const,
    productFees: (asin: string, params: FeesEstimateParams) =>
        [...amazonKeys.product(asin), 'fees', params] as const,
    credentials: () => [...amazonKeys.all, 'credentials'] as const,
};

// Products Hook
export const useAmazonProducts = (
    params: ProductsParams,
    options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) => {
    const { session, isAuthenticated } = useAuth();
    const api = createAmazonApiService(session);

    return useQuery({
        queryKey: amazonKeys.productsList(params),
        queryFn: () => api.getProducts(params),
        enabled: isAuthenticated && !!params.keywords,
        staleTime: 5 * 60 * 1000,
        retry: 2,
        ...options,
    });
};

// Single Product Hook
export const useAmazonProduct = (
    asin: string,
    endpoint: string,
    marketplace: string,
    options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) => {
    const { session, isAuthenticated } = useAuth();
    const api = createAmazonApiService(session);

    return useQuery({
        queryKey: amazonKeys.productDetail(asin, endpoint, marketplace),
        queryFn: () => api.getProduct(asin, endpoint, marketplace),
        enabled: isAuthenticated && !!asin,
        staleTime: 10 * 60 * 1000,
        retry: 2,
        ...options,
    });
};

// Product Offers Hook
export const useAmazonProductOffers = (
    asin: string,
    params: ProductOffersParams,
    options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) => {
    const { session, isAuthenticated } = useAuth();
    const api = createAmazonApiService(session);

    return useQuery({
        queryKey: amazonKeys.productOffers(asin, params),
        queryFn: () => api.getProductOffers(asin, params),
        enabled: isAuthenticated && !!asin,
        staleTime: 2 * 60 * 1000,
        retry: 1,
        ...options,
    });
};

// Fees Estimate Hook
export const useAmazonFeesEstimate = (
    asin: string,
    params: FeesEstimateParams,
    options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) => {
    const { session, isAuthenticated } = useAuth();
    const api = createAmazonApiService(session);

    return useQuery({
        queryKey: amazonKeys.productFees(asin, params),
        queryFn: () => api.getFeesEstimate(asin, params),
        enabled: isAuthenticated && !!asin,
        staleTime: 30 * 60 * 1000,
        retry: 2,
        ...options,
    });
};

// Pagination Hooks
export const useAmazonNextPage = () => {
    const { session } = useAuth();
    const queryClient = useQueryClient();
    const api = createAmazonApiService(session);

    return useMutation({
        mutationFn: (params: PaginationParams) => api.getNextPage(params),
        onSuccess: (data, variables) => {
            const productParams = {
                keywords: variables.keywords
            };
            queryClient.setQueryData(amazonKeys.productsList(productParams), data);
        },
    });
};

export const useAmazonPreviousPage = () => {
    const { session } = useAuth();
    const queryClient = useQueryClient();
    const api = createAmazonApiService(session);

    return useMutation({
        mutationFn: (params: PaginationParams) => api.getPreviousPage(params),
        onSuccess: (data, variables) => {
            const productParams = {
                keywords: variables.keywords
            };
            queryClient.setQueryData(amazonKeys.productsList(productParams), data);
        },
    });
};

// Credentials Validation Hook
export const useValidateAmazonCredentials = (
    options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) => {
    const { session, isAuthenticated } = useAuth();
    const api = createAmazonApiService(session);

    return useQuery({
        queryKey: amazonKeys.credentials(),
        queryFn: () => api.validateCredentials(),
        enabled: isAuthenticated,
        staleTime: 10 * 60 * 1000,
        retry: 1,
        ...options,
    });
};