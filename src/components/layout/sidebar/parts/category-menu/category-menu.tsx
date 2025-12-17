import { FC } from 'react';
import { MenuItem } from './components/menu-item';
import { TCategories } from '@/types/categories';
import { getServerTranslations } from '@/core/i18n/server';
import { imagePath } from '@helpers/image-path';
import { getCacheBuster } from '@helpers/cache-buster';
import { TSettings } from '@/types/settings';

type CategoryMenuProps = {
    categories: TCategories;
    headerItems?: TSettings['header'];
};

export const CategoryMenu: FC<CategoryMenuProps> = async ({ categories, headerItems = [] }) => {
    const t = await getServerTranslations('sidebar');
    const cacheBuster = getCacheBuster();

    return (
        <aside className="h-fit rounded-[10px] bg-card p-6">
            <ul className="space-y-8">
                <MenuItem name={t('home')} image="/icons/home.svg" url="/" />

                {categories.map((category) => (
                    <MenuItem
                        key={category.idx}
                        name={category.name}
                        image={imagePath(category.img) ? `${imagePath(category.img)}?${cacheBuster}` : null}
                        url={`/categories/${category.url}`}
                        subItems={category.subcategories}
                    />
                ))}

                {headerItems.map((item) => (
                    <MenuItem
                        key={item.id}
                        name={item.name}
                        image={item.icon}
                        url={item.url}
                        isPageLink={true}
                    />
                ))}
            </ul>
        </aside>
    );
};
