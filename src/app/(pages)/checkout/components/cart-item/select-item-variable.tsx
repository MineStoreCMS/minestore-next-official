import { TCart } from '@/types/cart';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { useCartItemPreferences } from '@/app/(pages)/categories/utils/use-cart-item-preferences';
import { DescriptionTooltip } from './item-description-tooltip';
import { VariablePrice } from '@/components/base/price/price';
import { useSettingsStore } from '@/stores/settings';

export function SelectItemVariable({ item }: { item: TCart['items'][number] }) {
    const { vars } = item;
    const { handleSetProductVariable } = useCartItemPreferences();
    const { settings } = useSettingsStore();
    const systemCurrencyName = settings?.system_currency.name || '';

    const dropdownVariables = vars.filter((v) => v.type === 0);
    if (dropdownVariables.length === 0) return null;

    return (
        <>
            {dropdownVariables.map((variable) => {
                const placeholderVariable = variable.variables.find(
                    (v) => v.value === variable.use
                );
                const placeholder = placeholderVariable
                    ? `${placeholderVariable.name} (${placeholderVariable.price} ${systemCurrencyName})`
                    : variable.name;

                return (
                    <div key={variable.id} className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {variable.name}
                            </p>
                            <DescriptionTooltip description={variable.description} />
                        </div>
                        <Select
                            onValueChange={(value) =>
                                handleSetProductVariable({
                                    id: item.id,
                                    var_id: variable.id,
                                    var_value: value
                                })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>{variable.name}</SelectLabel>
                                    {variable.variables.map((v) => (
                                        <SelectItem key={v.value} value={v.value}>
                                            {v.name}{' '}
                                            <span className="text-muted-foreground">
                                                <VariablePrice value={+v.price} />
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                );
            })}
        </>
    );
}
