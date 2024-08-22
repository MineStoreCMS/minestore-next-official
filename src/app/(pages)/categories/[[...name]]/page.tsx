import { fetcher } from '@/api/server/fetcher';
import { getEndpoints } from '@/api';
import { joinClasses } from '@helpers/join-classes';
import { Alert } from '@layout/alert/alert';
import { TCategory, TSubCategory } from '@/types/category-details';
import { Comparison } from '../comparison/comparasion';
import { TItem } from '@/types/item';
import { Card } from '@layout/card/card';
import { Suspense } from 'react';
import { SkeletonCategory } from '../components/skeleton-category';

const { getCategoryDetails } = getEndpoints(fetcher);

type TCategoryHeader = {
    category: TCategory;
    subCategory?: TSubCategory;
};

type TProductListContainer = {
    items: TItem[];
    category: TCategory;
    subcategory?: TSubCategory;
};

export default async function Page({ params }: { params: { name: string[] } }) {
    const [categoryPath] = params.name;

    const response = await getCategoryDetails(categoryPath).catch((error) => {
        console.error('Error fetching category details:', error);
        return undefined;
    });

    if (!response) {
        return <></>;
    }

    const { category, items, subcategories } = response;

    const subCategory = subcategories?.find((x) => x.category.url === params.name.join('/'));

    const isComparison = subCategory?.category.is_comparison || category.is_comparison;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            description: item.description
        }))
    };

    return (
        <div className="w-full flex-col rounded-[10px] bg-card">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <Suspense fallback={<SkeletonCategory />}>
                <CategoryHeader category={category} subCategory={subCategory} />

                {isComparison ? (
                    <Comparison
                        categoryItems={items}
                        category={category}
                        subCategory={subCategory}
                    />
                ) : (
                    <ProductListContainer
                        items={items}
                        category={category}
                        subcategory={subCategory}
                    />
                )}
            </Suspense>
        </div>
    );
}

function CategoryHeader({ category, subCategory }: TCategoryHeader) {
    const title = subCategory?.category.name || category.name;
    const description = subCategory?.category.description || category.description;

    return (
        <div className="w-full flex-col p-4">
            <Alert />

            <h1 className="mt-4 text-center text-[34px] text-primary">{title}</h1>
            <span
                className="text-center text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: description }}
            />

            <hr className="mt-5 border-[3px] border-primary" />
        </div>
    );
}

function ProductListContainer({ items, category, subcategory }: TProductListContainer) {
    const categoryItems = subcategory?.items || items;
    const categoryListing = subcategory?.category.is_listing || category.is_listing;

    const gridClasses = joinClasses('mt-8 grid gap-4 p-4', {
        'grid-cols-[repeat(auto-fill,minmax(min(16rem,100%),1fr))]': !categoryListing
    });

    return (
        <div className={gridClasses}>
            {categoryItems.map((item, index) => (
                <Card
                    key={index}
                    item={item}
                    direction={categoryListing ? 'row' : 'col'}
                    className={joinClasses({ 'w-full': categoryListing })}
                />
            ))}
        </div>
    );
}
