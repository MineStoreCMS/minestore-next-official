'use client';

import { useState } from 'react';
import { TItem } from '@/types/item';
import { useCartStore } from '@/stores/cart';
import { ItemDetails } from '@layout/item-details/item-details';
import { CardLayout } from './card-layout';
import { CardHeader } from './card-header';
import { CardActions } from './card-actions';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type CardProps = {
    item: TItem;
    direction?: 'row' | 'col';
    calledFromCheckout?: boolean;
    className?: string;
};

export function Card({ item, direction = 'col' }: CardProps) {
    const [showModal, setShowModal] = useState(false);

    const { items } = useCartStore();

    const isItemInCart = items.some((x) => x.id === item.id);
    const isItemUnavailable = !item.is_unavailable;

    const path = usePathname();

    return (
        <div className={cn('relative', direction === 'col' ? 'h-full' : '')}>
            <CardLayout direction={direction} className={item.featured ? 'featured-package' : ''}>
                <CardHeader item={item} direction={direction} />
                <CardActions
                    item={item}
                    direction={direction}
                    isItemInCart={isItemInCart}
                    setShowModal={setShowModal}
                    available={isItemUnavailable}
                    displayFull={direction === 'col'}
                />
            </CardLayout>
            <ItemDetails
                show={showModal}
                onHide={() => setShowModal(false)}
                id={item.id}
                available={isItemUnavailable}
                route={path === '/checkout' ? 'checkout' : undefined}
            />
        </div>
    );
}
