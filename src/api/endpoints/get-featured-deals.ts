import { AxiosInstance } from 'axios';

export type TFeaturedDeal = Array<{
    name: string;
    price: number;
    discount: number;
    active: boolean;
    is_subs: boolean;
    image: string | null;
    id: number;
    featured: boolean;
    is_unavailable: boolean;

    // Optional properties with clear types
    virtual_price?: number | null;
    is_virtual_currency_only?: boolean;
    quantityGlobalLimit?: number;
    quantityGlobalCurrentLimit?: number;
    quantityUserLimit?: number;
    quantityUserCurrentLimit?: number;
    original_price?: number;
    description?: string;
}>;

export const getFeaturedDeals = (fetcher: AxiosInstance) => async () => {
    const url = '/items/getFeaturedDeals';
    return (await fetcher.post<TFeaturedDeal>(url)).data;
};
