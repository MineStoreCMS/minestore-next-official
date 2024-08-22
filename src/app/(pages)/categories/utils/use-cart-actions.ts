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
    payment_type: 'regular' | 'subscription';
    itemType: 'regular' | 'subscription';
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
        itemType
    }: THandleAddItem) => {
        const currentItem = await getItem(id);

        if (!user) {
            notify(t('please-authorize'), 'red');
            return;
        }

        if (!isCartCompatibleForItem(currentItem, itemType)) {
            return;
        }

        try {
            await addToCart({
                id,
                payment_type,
                promoted: calledFromCheckout
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
            await removeItemFromCart(id);

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
