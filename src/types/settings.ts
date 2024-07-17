import { TCurrency } from './currency';

type AuthType = 'username' | 'ingame';

export type TSettings = {
    auth_type: AuthType;
    header: Array<{
        id: number;
        name: string;
        url: string;
        icon: string;
    }>;
    footer: Array<{
        id: number;
        name: string;
        url: string;
        icon: string;
    }>;
    website_name: string;
    website_description: string;
    server: {
        ip: string;
        port: string;
    };
    is_featuredDeal: number | boolean;
    is_profile_enabled: number | boolean;
    featuredDeal_items: Array<{
        name: string;
        price: number;
        discount: number;
        active: boolean;
        is_subs: boolean;
        image: string | null;
        id: number;
        featured: boolean;
        is_unavailable: boolean;

        // Optional properties with clear types
        virtual_price?: number | null;
        is_virtual_currency_only?: boolean;
        quantityGlobalLimit?: number;
        quantityGlobalCurrentLimit?: number;
        quantityUserLimit?: number;
        quantityUserCurrentLimit?: number;
        original_price?: number;
        description?: string;
    }>;
    details: number | boolean;
    content: string;
    goals: Array<{
        name: string;
        current_amount: number;
        goal_amount: number;
    }>;
    top: {
        avatar: string;
        username: string;
    };
    recentDonators: Array<{
        amount: number;
        username: string;
        avatar: string;
        currency: string;
    }>;
    discord_url: string;
    discord_id: string;
    is_ref: number;
    block_1: string;
    block_2: string;
    block_3: string;
    socials: {
        facebook?: string;
        instagram?: string;
        discord?: string;
        twitter?: string;
        steam?: string;
        tiktok?: string;
    };
    is_virtual_currency: number;
    virtual_currency: string;
    system_currency: TCurrency;
    currencies: Array<TCurrency>;
    languages: Array<{
        code: string;
        name: string;
    }>;
    system_language: {
        code: string;
        name: string;
    };
};
