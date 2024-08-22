import { fetcher } from '@/api/server/fetcher';
import { getEndpoints } from '@/api';
import { redirect } from 'next/navigation';

const { getCustomPage } = getEndpoints(fetcher);

export default async function Page({
    params
}: {
    params: {
        slug: string[];
    };
}) {
    const slug = params.slug.join('/');

    const response = await getCustomPage(slug);

    const { page, success } = response;

    if (!success) {
        redirect('/');
    }

    return (
        <div className="flex-col rounded-[10px] bg-card p-6">
            <h1>{slug}</h1>
            <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>
    );
}
