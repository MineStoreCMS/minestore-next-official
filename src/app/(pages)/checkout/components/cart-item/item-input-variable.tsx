import { useCartItemPreferences } from '@/app/(pages)/categories/utils/use-cart-item-preferences';
import { Input } from '@/components/ui/input';
import { TCart } from '@/types/cart';
import { Label } from '@/components/ui/label';
import { useDebounceCallback } from 'usehooks-ts';
import { DescriptionTooltip } from './item-description-tooltip';

export function InputItemVariable({ item }: { item: TCart['items'][number] }) {
    const { vars } = item;
    const { handleSetProductVariable } = useCartItemPreferences();

    const inputVariables = vars.filter((v) => v.type === 1 || v.type === 2);

    const debouncedHandleSetProductVariable = useDebounceCallback((id, var_id, var_value) => {
        if (var_value === '') return;

        handleSetProductVariable({ id, var_id, var_value });
    }, 500);

    if (inputVariables.length === 0) return null;

    return (
        <>
            {inputVariables.map((variable) => {
                const inputType =
                    variable.type === 1 ? 'text' : variable.type === 2 ? 'number' : 'text';

                return (
                    <div key={variable.id} className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor={variable.identifier}>{variable.name}</Label>
                            <DescriptionTooltip description={variable.description} />
                        </div>
                        <Input
                            type={inputType}
                            id={variable.identifier}
                            placeholder={variable.use.toString() || variable.name}
                            onChange={(e) =>
                                debouncedHandleSetProductVariable(
                                    item.id,
                                    variable.id,
                                    e.target.value
                                )
                            }
                        />
                    </div>
                );
            })}
        </>
    );
}
