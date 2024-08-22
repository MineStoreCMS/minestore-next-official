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

export function SelectItemVariable({ item }: { item: TCart['items'][number] }) {
    const { vars } = item;
    const { handleSetProductVariable } = useCartItemPreferences();

    const dropdownVariables = vars.filter((v) => v.type === 0);
    if (dropdownVariables.length === 0) return null;

    return (
        <>
            {dropdownVariables.map((variable) => {
                const placeholderVariable = variable.variables.find(
                    (v) => v.value === variable.use
                );
                const placeholder = placeholderVariable
                    ? `${placeholderVariable.name} (${placeholderVariable.price} USD)`
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
                                                ({v.price} USD)
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
