import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import { getEndpoints } from '@/api';
import { fetcher } from '@/api/client/fetcher';
import { TCart } from '@/types/cart';
import { Price } from '@/components/base/price/price';
import { ItemDetails } from '@layout/item-details/item-details';
import { useCartStore } from '@/stores/cart';
import { TableRow, TableCell } from '@/components/ui/table';
import { InfoIcon, Trash2, Gift } from 'lucide-react';
import { ItemPreferences } from './item-preferences';
import { notify } from "@/core/notifications";
import { useTranslations } from 'next-intl';

const { updateItemCount, removeItemFromCart, getCart } = getEndpoints(fetcher);

type CartItemProps = {
    item: TCart['items'][number];
};

export const CartItem: FC<CartItemProps> = ({ item }) => {
    const { setCart } = useCartStore();
    const [quantity, setQuantity] = useState(item.count);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setQuantity(item.count);
    }, [item.count]);

    const [show, setShow] = useState(false);

    const isPriceVirtual = item.is_virtual_currency_only === 1;
    const price = isPriceVirtual ? item.virtual_price : item.price;
    const t = useTranslations('checkout');
    const tActions = useTranslations('actions');

    const handleRemoveItemFromCart = async (id: number) => {
        try {
            setLoading(true);
            await removeItemFromCart(id);
            const cart = await getCart();
            setCart(cart);
            notify(tActions('item-removed-from-cart'), 'red');
        } catch (e) {
            console.error('Error removing item from cart', e);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantity = async (id: number, quantity: number) => {
        try {
            setLoading(true);
            const response = await updateItemCount(id, quantity);
            if (response.success) {
               setQuantity(quantity);
               await new Promise(resolve => setTimeout(resolve, 500));
            } else {
               if (response.message?.includes('does not exist')) {
                  const cart = await getCart();
                  setCart(cart);
               }
               notify(response.message ?? 'Unexpected error. Try again later.', 'red');
               return;
            }

            const cart = await getCart();
            setCart(cart);
        } catch (e) {
            console.error(e);

            try {
                const cart = await getCart();
                setCart(cart);
            } catch (refreshError) {
                console.error('Error refreshing cart:', refreshError);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TableRow>
                <TableCell className="hidden md:block">
                    {item.image ? (
                        <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}${item.image}`}
                            alt=""
                            width={80}
                            height={80}
                            className="h-20 w-20 object-contain"
                        />
                    ) : (
                        <div className="h-20 w-20 rounded-md bg-card-foreground/5"></div>
                    )}
                </TableCell>
                <TableCell className="text-balance text-sm font-bold text-card-foreground md:text-lg">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span>{item.name}</span>
                        {item.tier_quantity && (
                            <span className="rounded-md bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground md:text-sm">
                                x{item.tier_quantity}
                            </span>
                        )}
                    </div>
                    {item.gift && (
                        <div className="mt-1 flex flex-wrap items-center gap-1 text-xs md:text-sm text-muted-foreground">
                            <Gift className="h-4 w-4 md:h-5 md:w-5" />
                            <span className="hidden md:inline mr-1">{ t('gift-to') }</span>
                            <Image
                              src={item.gift.avatar}
                              alt={item.gift.gifted_to}
                              width={20}
                              height={20}
                              className="inline-block h-4 w-4 md:h-5 md:w-5 rounded object-cover border border-accent"
                              onError={(e) => {
                                 (e.target as HTMLImageElement).src = '/steve-icon.png';
                              }}
                            />
                            <span className="text-primary break-all">{item.gift.gifted_to}</span>
                        </div>
                    )}
                </TableCell>
                <TableCell>
                    <Price
                        value={price}
                        isVirtual={isPriceVirtual}
                        className="text-sm md:text-lg md:font-bold"
                    />
                </TableCell>
                <TableCell className="text-right">
                    <div className="flex items-center justify-center gap-2">
                        <div>
                            <button
                                aria-label="Decrease quantity"
                                hidden={!!item.is_subs}
                                className="h-6 w-6 rounded text-xl font-bold leading-6 text-primary transition disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={quantity === 1 || loading}
                                onClick={() => {
                                    if (quantity === 1) return;
                                    handleQuantity(item.cid, quantity - 1);
                                }}
                            >
                                -
                            </button>
                        </div>
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-accent text-center text-sm font-bold text-accent-foreground md:h-8 md:w-8 md:text-lg">
                            {quantity}
                        </div>
                        <div>
                            <button
                                aria-label="Increase quantity"
                                hidden={!!item.is_subs}
                                className="h-4 w-4 rounded text-xl font-bold leading-6 text-primary transition disabled:cursor-not-allowed disabled:opacity-50 md:h-8 md:w-8"
                                disabled={loading}
                                onClick={() => handleQuantity(item.cid, quantity + 1)}
                            >
                                +
                            </button>
                        </div>
                    </div>
                </TableCell>
                <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                        <button
                            aria-label="Show item details"
                            onClick={() => setShow(true)}
                            className="flex h-6 w-6 items-center justify-center rounded bg-card-foreground/10 text-base font-bold text-card-foreground md:h-8 md:w-8 md:text-lg"
                        >
                            <InfoIcon aria-hidden={true} size={20} />
                        </button>
                        <button
                            onClick={() => handleRemoveItemFromCart(item.cid)}
                            aria-label="Remove item from cart"
                            className="flex h-6 w-6 items-center justify-center rounded bg-red-500 text-base font-bold text-red-900 transition disabled:cursor-not-allowed disabled:opacity-50 md:h-8 md:w-8 md:text-lg"
                            disabled={loading}
                        >
                            <Trash2 aria-hidden={true} size={20} />
                        </button>
                    </div>
                </TableCell>
            </TableRow>

            <ItemPreferences item={item} />

            <ItemDetails show={show} onHide={() => setShow(false)} id={item.id} route="checkout" />
        </>
    );
};
