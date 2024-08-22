import { getEndpoints } from '@/api';
import { fetcher } from '@/api/client/fetcher';
import { notify } from '@/core/notifications';
import { useCartStore } from '@/stores/cart';
const { getCart, setProductVariable, setSelectedServer, setCustomPrice } = getEndpoints(fetcher);

export type TSetProductVariable = {
    id: number;
    var_id: number;
    var_value: number | string;
};

export type TSetProductServer = {
    id: number;
    server_id: number;
};

export type TSetCustomPrice = {
    id: number;
    price: number;
};

export const useCartItemPreferences = () => {
    const { setCart } = useCartStore();

    const handleSetProductVariable = async ({ id, var_id, var_value }: TSetProductVariable) => {
        try {
            await setProductVariable({ id, var_id, var_value });
            const cart = await getCart();
            setCart(cart);

            notify('Product variable set!', 'green');
        } catch (error) {
            console.error('Error while setting product variable:', error);
            notify('Error while setting product variable!', 'red');
        }
    };

    const handleSelectServer = async ({ id, server_id }: TSetProductServer) => {
        try {
            await setSelectedServer({ id, server_id });
            const cart = await getCart();
            setCart(cart);

            notify('Server selected!', 'green');
        } catch (error) {
            console.error('Error while setting server:', error);
            notify('Error while setting server!', 'red');
        }
    };

    const handleSetCustomPrice = async ({ id, price }: TSetCustomPrice) => {
        try {
            await setCustomPrice({ id, price });
            const cart = await getCart();
            setCart(cart);

            notify('Custom price set!', 'green');
        } catch (error) {
            console.error('Error while setting custom price:', error);
            notify('Error while setting custom price!', 'red');
        }
    };

    return {
        handleSetProductVariable,
        handleSelectServer,
        handleSetCustomPrice
    };
};
