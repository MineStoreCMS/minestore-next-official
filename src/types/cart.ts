export type Line = {
    name: string;
    value: string;
    price: number;
};

export type TCart = {
    cart: {
        clear_price: number;
        coupon_code: string;
        coupon_type: 0 | 1;
        coupon_value: number;
        coupon_id: null | number;
        created_at: string;
        gift_code: string;
        gift_id: number;
        gift_sum: number;
        id: number;
        is_active: 0 | 1;
        items: number;
        price: number;
        referral: null | string;
        referral_code: string;
        tax: number;
        updated_at: string;
        user_id: number;
        virtual_price: number;
    };
    items: Array<{
        name: string;
        image: string;
        cid: number;
        price: number;
        virtual_price: number;
        is_virtual_currency_only: number;
        id: number;
        payment_type: number;
        vars: Array<CartItemsVar>;
        count: number;
        quantityGlobalLimit: number | null;
        quantityGlobalCurrentLimit: number | null;
        quantityUserLimit: number | null;
        quantityUserCurrentLimit: number | null;
        is_unavailable: boolean;
        allow_select_server: number;
        allowed_servers: Array<{
            server_id: number;
            server_name: string;
        }>;
        selected_server: number;
        is_any_price: number;
        min_price: number;
        is_subs: number;
    }>;
};

type CartItemsVar = {
    id: number;
    name: string;
    identifier: string;
    description: string;
    type: 0 | 1 | 2;
    variables: Array<{
        name: string;
        price: string | number;
        value: string;
    }>;
    use: string | number;
};
