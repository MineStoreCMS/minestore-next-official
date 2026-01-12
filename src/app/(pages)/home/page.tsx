import { getEndpoints } from '@/api';
import { fetcher } from '@/api/server/fetcher';
import { Alert } from '@layout/alert/alert';
import { FeaturedDeals } from './components/featured-deals';
import { Content } from './components/content';
import { Modules } from './components/modules';

const { getFeaturedDeals, getSettings } = getEndpoints(fetcher);

export default async function Home() {
    const featuredDeals = await getFeaturedDeals();
    const settings = await getSettings();

    return (
        <>
            {settings?.is_featuredDeal ? <FeaturedDeals featuredDeals={featuredDeals} /> : null}

            <div className="flex-col rounded-[10px] bg-card">
                <div className="p-4">
                    <Alert />

                    <Content />
                </div>

                <Modules />
            </div>
        </>
    );
}
