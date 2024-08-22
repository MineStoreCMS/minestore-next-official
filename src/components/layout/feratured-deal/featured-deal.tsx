'use client';

import { FC, useState } from 'react';
import { Price } from '@/components/base/price/price';
import { TSettings } from '@/types/settings';
import { ItemDetails } from '@layout/item-details/item-details';
import Image from 'next/image';
import { useUserStore } from '@/stores/user';
import { notify } from '@/core/notifications';
import { imagePath } from '@helpers/image-path';

type FeaturedDealProps = {
    item: TSettings['featuredDeal_items'][number];
};

export const FeaturedDeal: FC<FeaturedDealProps> = ({ item }) => {
    const [show, setShow] = useState(false);

    const { user } = useUserStore();

    const handleClick = () => {
        if (!user) {
            notify('Please authorize!', 'red');
            return;
        }
        setShow(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            handleClick();
        }
    };

    return (
        <>
            <div
                onClick={handleClick}
                role="button"
                tabIndex={0}
                onKeyDown={handleKeyDown}
                className="cursor-pointer flex-col items-center gap-2 rounded border-2 border-accent-foreground/10 bg-accent p-3 md:flex-row md:gap-4 md:p-6"
            >
                <FeaturedImage item={item} />

                <div className="flex-col text-center md:text-left">
                    <h3 className="text-xl font-bold text-accent-foreground">{item.name}</h3>
                    <Price
                        value={item.price}
                        className="flex gap-2 font-bold"
                        originalPrice={item.original_price}
                        discount={item.discount}
                        isVirtual={item.is_virtual_currency_only}
                    />
                </div>
            </div>

            {user && <ItemDetails show={show} onHide={() => setShow(false)} id={item.id} />}
        </>
    );
};

function FeaturedImage({ item }: FeaturedDealProps) {
    if (!item.image) return null;

    const imageSRC = imagePath(item.image) as string;

    return <Image src={imageSRC} width={64} height={64} alt="" />;
}
