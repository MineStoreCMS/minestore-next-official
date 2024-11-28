import { Price } from '@/components/base/price/price';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TItem } from '@/types/item';
import { imagePath } from '@helpers/image-path';
import { joinClasses } from '@helpers/join-classes';
import { getModifiedCacheBuster } from '@helpers/cache-buster';
import { AlertTriangle, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

type CardHeaderProps = {
    item: TItem;
    direction?: 'row' | 'col';
};

export function CardHeader({ item, direction }: CardHeaderProps) {
    const price = item.is_virtual_currency_only ? item.virtual_price || 0 : item.price;
    const isPriceVirtual = item.is_virtual_currency_only;

    const cardHeaderClasses = joinClasses(
        'gap-4',
        direction === 'col' && 'grid mt-auto',
        direction === 'col' && !item.image && 'mt-auto',
        direction === 'row' && 'flex-col md:flex-row items-center'
    );

    return (
        <div className={cardHeaderClasses}>
            <FeaturedBadge item={item} className={direction === 'row' ? 'absolute -top-4' : ''} />

            {direction === 'col' ? <QuantityBadge item={item} /> : null}

            <CardHeaderImage
                item={item}
                direction={direction}
                className={direction === 'row' && item.featured ? 'mt-4 md:mt-0' : ''}
            />
            <div className={direction === 'col' ? 'text-center' : 'text-center md:text-start'}>
                {direction === 'row' ? <QuantityBadge item={item} className="mb-2" /> : null}
                <h3 className="text-xl break-words break-all font-bold text-accent-foreground">{item.name}</h3>
               <Price
                  originalPrice={item.original_price}
                  discount={item.discount}
                    value={price}
                    isVirtual={isPriceVirtual}
                    className={`flex items-center gap-2 text-base font-bold ${direction === 'col' ? 'justify-center' : ''}`}
                />
            </div>
        </div>
    );
}

function QuantityBadge({ item, className }: { item: TItem; className?: string }) {
    const t = useTranslations('card');

    const hasGlobalLimit =
        item.quantityGlobalLimit != null && item.quantityGlobalCurrentLimit != null;
    const hasUserLimit = item.quantityUserLimit != null && item.quantityUserCurrentLimit != null;

    if (!hasGlobalLimit && !hasUserLimit) return null;

    const {
        quantityGlobalLimit = 0,
        quantityGlobalCurrentLimit = 0,
        quantityUserLimit = 0,
        quantityUserCurrentLimit = 0
    } = item;

    const globalQuantityLeft = hasGlobalLimit
        ? quantityGlobalLimit - quantityGlobalCurrentLimit
        : 0;
    const userQuantityLeft = hasUserLimit ? quantityUserLimit - quantityUserCurrentLimit : 0;

    const quantityLeft = hasUserLimit ? userQuantityLeft : globalQuantityLeft;

    return (
        <div className="flex flex-wrap items-center gap-2">
            {hasUserLimit && userQuantityLeft > 0 && (
                <Badge
                    variant="success"
                    className={joinClasses(
                        'mx-auto max-w-[220px] justify-center gap-2 p-2',
                        className
                    )}
                >
                    <Check size={16} />
                    <p>{t('available-for-you')}</p>
                </Badge>
            )}
            <Badge
                variant="destructive"
                className={joinClasses('mx-auto max-w-[220px] justify-center gap-2 p-2', className)}
            >
                <AlertTriangle size={16} />
                <p>
                    {quantityLeft} {t('items-left')}
                </p>
            </Badge>
        </div>
    );
}

function CardHeaderImage({
    item,
    direction,
    className
}: {
    item: TItem;
    direction?: 'row' | 'col';
    className?: string;
}) {
    const image = imagePath(item.image);
    if (!image) return null;

    const cacheBuster = getModifiedCacheBuster(5);
    const imageWithCacheBuster = `${image}?${cacheBuster}`;

    const imageSize = direction === 'row' ? 64 : 140;

    return (
        <div>
            <Image
                src={imageWithCacheBuster}
                alt={item.name}
                width={imageSize}
                height={imageSize}
                className={cn(
                    `mx-auto object-contain w-[${imageSize}px] h-[${imageSize}px]`,
                    className
                )}
            />
        </div>
    );
}

function FeaturedBadge({ item, className }: { item: TItem; className?: string }) {
    const t = useTranslations('card');
    if (!item.featured) return null;

    return (
        <Badge variant="default" className={cn('mx-auto w-max px-4 py-2', className)}>
            {t('featured')}
        </Badge>
    );
}
