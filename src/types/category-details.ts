import { TItem } from './item';

export type TComparison = {
    id: number;
    name: string;
    type: number;
    sorting: number;
};

export type TCategory = {
    id: number;
    parent_id: number;
    name: string;
    img: string | null;
    url: string;
    description: string;
    sorting: number;
    is_enable: number | boolean;
    gui_item_id: number | null;
    is_cumulative: number | boolean;
    is_listing: number | boolean;
    is_comparison: number | boolean;
    created_at: string;
    updated_at: string;
    comparison: TComparison[];
    comparisons?: {
        comparison_id: number;
        value: string;
    }[];
};

export type TCategoryDetails = {
    category: TCategory;
    items: TItem[];
    itemsFeatured: TItem[];
    subcategories?: {
        category: TCategory;
        subcategories: TCategoryDetails[];
        items: TItem[];
    }[];
};

export type TSubCategory = {
    url?: string;
    category: TCategory;
    subcategories: TCategoryDetails[];
    items: TItem[];
};
