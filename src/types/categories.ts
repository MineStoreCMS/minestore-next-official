export type TSubCategories = Array<{
    idx: number;
    name: string;
    description: string;
    url: string;
    img: null | string;
}>;

export type TCategories = Array<{
    idx: number;
    name: string;
    description: string;
    url: string;
    img: null | string;
    subcategories: TSubCategories;
}>;
