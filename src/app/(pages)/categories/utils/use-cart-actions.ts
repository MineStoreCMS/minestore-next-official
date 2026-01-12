import { notify } from '@/core/notifications';
import { useCartStore } from '@/stores/cart';
import { getEndpoints } from '@/api';
import { fetcher } from '@/api/client/fetcher';
import { useUserStore } from '@/stores/user';
import { TItem } from '@/types/item';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

const { addToCart, getCart, removeItemFromCart, getItem } = getEndpoints(fetcher);

type THandleAddItem = {
    id: number;
    calledFromCheckout: boolean;
    payment_type: 'regular' | 'subscription' | 'gift';
    itemType: 'regular' | 'subscription';
    gift_to?: string;
    tier_quantity?: number;
};

export const useCartActions = () => {
    const router = useRouter();
    const t = useTranslations('actions');

    const { user } = useUserStore();
    const { items, setCart } = useCartStore();

    const handleAddItem = async ({
        id,
        calledFromCheckout,
        payment_type,
        itemType,
        gift_to,
        tier_quantity
    }: THandleAddItem) => {
        const currentItem = await getItem(id);

        if (!user) {
            notify(t('please-authorize'), 'red');
            const currentPath = window.location.pathname;
            router.push(`/auth?returnUrl=${encodeURIComponent(currentPath)}`);
            return;
        }

        if (!isCartCompatibleForItem(currentItem, itemType)) {
            return;
        }

        try {
            await addToCart({
                id,
                payment_type,
                promoted: calledFromCheckout,
                ...(payment_type === 'gift' && gift_to ? { gift_to } : {}),
                ...(tier_quantity !== undefined ? { tier_quantity } : {})
            });

            const response = await getCart();

            setCart(response);

            const notificationMessage = t('item-added-to-cart');
            const notificationColor = 'green';

            notify(notificationMessage, notificationColor);

            if (payment_type === 'subscription' && !calledFromCheckout) {
                router.push('/checkout');
            }
        } catch (error) {
            console.error('Error while adding item:', error);
        }
    };

    function isCartCompatibleForItem(currentItem: TItem, itemType: 'regular' | 'subscription') {
        const cartContainsSubs = items.some((x) => x.payment_type === 1);
        const cartContainsRegular = items.some((x) => x.payment_type === 0);

        const showError = (message: string) => {
            notify(message, 'red');
            return false;
        };

        if (!currentItem) {
            return showError(t('item-not-found'));
        }

        const {
            quantityGlobalCurrentLimit,
            quantityGlobalLimit,
            quantityUserLimit,
            quantityUserCurrentLimit
        } = currentItem;

        const isSubscription = itemType === 'subscription';

        const isQuantityGlobalLimitReached =
            quantityGlobalLimit !== null && quantityGlobalCurrentLimit === quantityGlobalLimit;

        const isQuantityUserLimitReached =
            quantityUserLimit !== null && quantityUserCurrentLimit === quantityUserLimit;

        if (isQuantityGlobalLimitReached) {
            return showError(t('item-out-of-stock'));
        }

        if (isQuantityUserLimitReached) {
            return showError(t('reached-stock-limit'));
        }

        if (isSubscription && cartContainsRegular) {
            return showError(t('cant-mix-normal-and-subscription'));
        }

        if (!isSubscription && cartContainsSubs) {
            return showError(t('cant-mix-normal-and-subscription'));
        }

        if (isSubscription && cartContainsSubs) {
            return showError(t('cant-add-more-than-one-subscription'));
        }

        return true;
    }

    const handleRemoveItem = async (id: number) => {
        try {
            // If id is an item.id (from catalog), find the cart item's cid
            // If id is already a cid (from cart), use it directly
            const cartItem = items.find((x) => x.id === id || x.cid === id);

            if (!cartItem) {
                console.error('Item not found in cart');
                return;
            }

            await removeItemFromCart(cartItem.cid);

            const response = await getCart();

            setCart(response);

            const notificationMessage = t('item-removed-from-cart');
            const notificationColor = 'red';

            notify(notificationMessage, notificationColor);
        } catch (error) {
            console.error('Error while removing item:', error);
        }
    };

    return {
        handleAddItem,
        handleRemoveItem
    };
};
