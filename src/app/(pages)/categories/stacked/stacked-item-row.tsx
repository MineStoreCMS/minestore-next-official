'use client';

import { TItem } from '@/types/item';
import { imagePath } from '@helpers/image-path';
import { joinClasses } from '@helpers/join-classes';
import { useCartActions } from '../utils/use-cart-actions';
import Image from 'next/image';
import { getModifiedCacheBuster } from '@helpers/cache-buster';
import { useTranslations } from 'next-intl';
import { useCurrencyStore } from '@/stores/currency';
import { convertToLocalCurrency } from '@helpers/convert-to-local-currency';
import { useCartStore } from '@/stores/cart';
import { useState } from 'react';
import { ItemDetails } from '@layout/item-details/item-details';
import { Loader2 } from 'lucide-react';

type StackedItemRowProps = {
    item: TItem;
};

type TierCardProps = {
    item: TItem;
    tier: { quantity: number; price: number; discount: number };
    isUnavailable: boolean;
};

type TierPriceProps = {
    price: number;
    originalPrice?: number;
};

function TierPrice({ price, originalPrice }: TierPriceProps) {
    const { currency } = useCurrencyStore();
    const currencyName = currency?.name || '';
    const localPrice = convertToLocalCurrency(price);
    const localOriginalPrice = originalPrice ? convertToLocalCurrency(originalPrice) : undefined;

    return (
        <div className="flex flex-col items-center">
            <div className="text-lg font-semibold text-primary">
                {localPrice.toFixed(2)} {currencyName}
            </div>
            {localOriginalPrice && localOriginalPrice !== localPrice ? (
                <div className="text-sm text-muted-foreground line-through">
                    {localOriginalPrice.toFixed(2)} {currencyName}
                </div>
            ) : (
                <div className="h-5"></div>
            )}
        </div>
    );
}

function TierCard({ item, tier, isUnavailable }: TierCardProps) {
    const { handleAddItem, handleRemoveItem } = useCartActions();
    const { items } = useCartStore();
    const t = useTranslations('card');
    const [loading, setLoading] = useState(false);

    // Find the cart item for this specific tier
    const cartItemForThisTier = items.find(
        (cartItem) => {
            // Convert to numbers for comparison to handle string/number mismatch
            const cartTierQty = cartItem.tier_quantity ? Number(cartItem.tier_quantity) : null;
            const tierQty = Number(tier.quantity);
            return cartItem.id === item.id && cartTierQty === tierQty;
        }
    );
    const isThisTierInCart = !!cartItemForThisTier;

    const handleAddToCart = async () => {
        try {
            setLoading(true);
            await handleAddItem({
                id: item.id,
                calledFromCheckout: false,
                payment_type: 'regular',
                itemType: 'regular',
                tier_quantity: tier.quantity
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async () => {
        try {
            setLoading(true);
            if (cartItemForThisTier) {
                await handleRemoveItem(cartItemForThisTier.cid);
            } else {
                console.error('No cart item found to remove');
            }
        } finally {
            setLoading(false);
        }
    };

    const finalPrice = tier.discount > 0
        ? tier.price * (1 - tier.discount / 100)
        : tier.price;

    const originalPrice = tier.discount > 0 ? tier.price : undefined;

    return (
        <div className="flex w-36 flex-col items-center rounded-lg border border-border bg-card/80 p-3 transition-all hover:border-primary/50 sm:w-40 md:w-44 md:p-4">
            <div className="mb-2 text-3xl font-bold text-foreground sm:text-4xl md:mb-3 md:text-5xl">
                x{tier.quantity}
            </div>
            <div className="mb-3 flex h-12 flex-col items-center justify-center md:mb-4">
                <TierPrice price={finalPrice} originalPrice={originalPrice} />
            </div>
            {isThisTierInCart ? (
                <button
                    onClick={handleRemove}
                    disabled={loading}
                    className={joinClasses(
                        'flex w-full items-center justify-center gap-2 rounded bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground transition-all hover:bg-destructive/90 sm:px-4 sm:py-2 sm:text-sm',
                        {
                            'cursor-not-allowed opacity-50': loading
                        }
                    )}
                >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {t('remove')}
                </button>
            ) : (
                <button
                    onClick={handleAddToCart}
                    disabled={isUnavailable || loading}
                    className={joinClasses(
                        'flex w-full items-center justify-center gap-2 rounded px-3 py-1.5 text-xs font-medium transition-all sm:px-4 sm:py-2 sm:text-sm',
                        {
                            'bg-primary text-primary-foreground hover:bg-primary/90': !isUnavailable && !loading,
                            'cursor-not-allowed bg-muted text-muted-foreground': isUnavailable || loading
                        }
                    )}
                >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isUnavailable ? t('unavailable') : t('buy')}
                </button>
            )}
        </div>
    );
}

export function StackedItemRow({ item }: StackedItemRowProps) {
    const tiers = item.stacked_tiers?.tiers || [];
    const [showModal, setShowModal] = useState(false);

    if (!tiers.length) return null;

    const isUnavailable = item.is_unavailable;
    const itemImage = imagePath(item.image);

    return (
        <>
            <div className="flex w-full flex-col gap-4 rounded-lg border border-border bg-accent/30 p-4 sm:gap-6 sm:p-6 md:flex-row md:items-center">
                <div className="flex flex-col items-center gap-2 sm:gap-3">
                    {itemImage && (
                        <div
                            className="relative h-24 w-24 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg transition-transform hover:scale-105 sm:h-28 sm:w-28 md:h-32 md:w-32"
                            onClick={() => setShowModal(true)}
                        >
                            <Image
                                src={`${itemImage}?${getModifiedCacheBuster(5)}`}
                                alt={item.name}
                                width={128}
                                height={128}
                                className="h-full w-full object-cover"
                            />
                            {isUnavailable && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                                    <span className="text-xs font-bold text-white">OUT OF STOCK</span>
                                </div>
                            )}
                        </div>
                    )}

                    <h3 className="text-center text-lg font-bold text-foreground sm:text-xl md:text-2xl">
                        {item.name}
                    </h3>
                </div>

                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:justify-start">
                    {tiers.map((tier) => (
                        <TierCard
                            key={tier.quantity}
                            item={item}
                            tier={tier}
                            isUnavailable={isUnavailable}
                        />
                    ))}
                </div>
            </div>
            <ItemDetails
                show={showModal}
                onHide={() => setShowModal(false)}
                id={item.id}
                available={!isUnavailable}
            />
        </>
    );
}
