import { TItem } from './item';

export type TProfile = {
    display_group: number | boolean;
    uuid: string;
    username: string;
    displayname: string;
    group: string;
    created: string;
    top_item_name: string | null;
    top_item_id: number;
    items: TItem[];
    money_spent: number;
    status: string;
};
