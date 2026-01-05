import { TItem } from '@/types/item';
import { StackedItemRow } from './stacked-item-row';

type StackedCategoryProps = {
    items: TItem[];
};

export function StackedCategory({ items }: StackedCategoryProps) {
    const stackedItems = items.filter(item => item.stacked_tiers?.tiers && item.stacked_tiers.tiers.length > 0);

    if (!stackedItems.length) {
        return (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
                No items available in this category
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 p-4">
            {stackedItems.map((item) => (
                <StackedItemRow key={item.id} item={item} />
            ))}
        </div>
    );
}
