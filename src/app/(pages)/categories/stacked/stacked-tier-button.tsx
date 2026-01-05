'use client';

import { TItemTier } from '@/types/item';
import { joinClasses } from '@helpers/join-classes';
import { VariablePrice } from '@/components/base/price/price';

type StackedTierButtonProps = {
    tier: TItemTier;
    isSelected: boolean;
    onClick: () => void;
    basePrice: number;
};

export function StackedTierButton({
    tier,
    isSelected,
    onClick,
    basePrice
}: StackedTierButtonProps) {
    const finalPrice = tier.discount > 0
        ? tier.price - (tier.price * (tier.discount / 100))
        : tier.price;

    const savings = ((basePrice - finalPrice) / basePrice) * 100;
    const hasSavings = savings > 0;

    return (
        <button
            onClick={onClick}
            className={joinClasses(
                'relative flex flex-col items-center justify-center rounded-lg border-2 p-4 transition-all hover:scale-105',
                {
                    'border-primary bg-primary/10': isSelected,
                    'border-border bg-card hover:border-primary/50': !isSelected
                }
            )}
        >
            <div className="text-xl font-bold text-foreground">x{tier.quantity}</div>

            <div className="mt-2 flex flex-col items-center">
                <div className="text-lg font-semibold text-primary">
                    <VariablePrice value={finalPrice} />
                </div>

                {tier.discount > 0 && (
                    <div className="text-xs text-muted-foreground line-through">
                        <VariablePrice value={tier.price} />
                    </div>
                )}
            </div>

            {hasSavings && (
                <div className="absolute -right-2 -top-2 rounded-full bg-green-500 px-2 py-1 text-xs font-bold text-white">
                    -{savings.toFixed(0)}%
                </div>
            )}
        </button>
    );
}
