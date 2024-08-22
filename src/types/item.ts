export type TItem = {
    // Required properties
    name: string;
    price: number;
    discount: number;
    active: boolean;
    is_subs: boolean;
    custom_price: number;
    min_price: number;
    image: string | null;
    id: number;
    featured: boolean;
    is_unavailable: boolean;

    // Optional properties with clear types
    allow_select_server?: boolean;
    allowed_servers?: string[];
    virtual_price?: number | null;
    is_virtual_currency_only?: boolean;
    quantityGlobalLimit?: number;
    quantityGlobalCurrentLimit?: number;
    quantityUserLimit?: number;
    quantityUserCurrentLimit?: number;
    original_price?: number;
    description?: string;

    // Optional nested array with more explicit types
    comparison?: {
        comparison_id: number;
        value: string;
    }[];
};
