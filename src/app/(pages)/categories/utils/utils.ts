import { TCategory, TSubCategory } from '@/types/category-details';
import { TItem } from '@/types/item';

type TComparisonResult = {
    id: number;
    name: string;
    type: number;
    sorting: number;
    description: string | null;
    comparisons: [
        {
            comparison_id: number;
            value: string;
        }
    ];
}[];

export function extractSubCategoryComparisons(subCategory: TSubCategory | undefined) {
    if (!subCategory || !subCategory.category || !subCategory.items) return [];

    const category = subCategory?.category;

    const categoryComparisons = category?.comparison;
    const items = subCategory?.items;

    const comparisons = categoryComparisons.map((comparison) => {
        const comparisons = items.map((item) => {
            const comparisonValue = item.comparison?.find((x) => x.comparison_id === comparison.id);

            return {
                comparison_id: comparison.id,
                value: comparisonValue?.value || ''
            };
        });

        return {
            ...comparison,
            comparisons
        };
    }) as TComparisonResult;

    return comparisons;
}

export function extractCategoryComparisons(category: TCategory, items: TItem[]) {
    const categoryComparisons = category?.comparison;

    const comparisons = categoryComparisons.map((comparison) => {
        const comparisons = items.map((item) => {
            const comparisonValue = item.comparison?.find((x) => x.comparison_id === comparison.id);

            return {
                comparison_id: comparison.id,
                value: comparisonValue?.value || ''
            };
        });

        return {
            ...comparison,
            comparisons
        };
    }) as TComparisonResult;

    return comparisons;
}
