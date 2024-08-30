import { TCart } from '@/types/cart';
import { Input } from '@/components/ui/input';
import { useCartItemPreferences } from '@/app/(pages)/categories/utils/use-cart-item-preferences';
import { DescriptionTooltip } from './item-description-tooltip';
import { useDebounceCallback } from 'usehooks-ts';
import { notify } from '@/core/notifications';
import { Label } from '@/components/ui/label';
import { useSettingsStore } from "@/stores/settings";

export function InputItemCustomPrice({ item }: { item: TCart['items'][number] }) {
    const { handleSetCustomPrice } = useCartItemPreferences();
   const { settings } = useSettingsStore();
   const systemCurrencyName = settings?.system_currency.name || '';

    const debouncedHandleSetProductVariable = useDebounceCallback((id, price, min_price) => {
        if (price < min_price) {
            notify('The price must be higher than the minimum price!', 'red');
            return;
        }

        handleSetCustomPrice({ id, price });
    }, 500);

    if (!item.is_any_price) return null;

    return (
        <div className="grid gap-2">
            <div className="flex items-center justify-between">
                <Label htmlFor="custom-price">Custom Price</Label>
                <DescriptionTooltip
                    description={`${item.name} has a minimum price of ${item.min_price} ${systemCurrencyName}`}
                />
            </div>
            <Input
                type="number"
                id="custom-price"
                placeholder={item.price.toString()}
                min={item.min_price}
                onChange={(e) =>
                    debouncedHandleSetProductVariable(item.id, e.target.value, item.min_price)
                }
            />
        </div>
    );
}
