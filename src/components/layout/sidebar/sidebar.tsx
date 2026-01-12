import { FC } from 'react';
import { TCategories } from '@/types/categories';
import { TSettings } from '@/types/settings';
import { CategoryMenu } from './parts/category-menu/category-menu';
import { ExtraWidget } from './parts/extra-widget/extra-widget';

type SidebarProps = {
    settings: TSettings;
    categories: TCategories;
};

export const Sidebar: FC<SidebarProps> = ({ settings, categories }) => {
    return (
        <div className="w-full flex-col lg:w-[320px] xl:w-[400px]">
            <CategoryMenu categories={categories} />
            <ExtraWidget settings={settings} />
        </div>
    );
};
