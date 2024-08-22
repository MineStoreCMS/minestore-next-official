import { getEndpoints } from '@/api';
import { fetcher } from '@/api/server/fetcher';
import { ProfileView } from '../profile-view';
import { handleUnauthorized } from '@/api/server/handlers';

const { getProfile, getUser } = getEndpoints(fetcher);

interface PageProps {
    params: { name?: string };
}

export default async function Page({ params }: PageProps) {
    try {
        const profile = await fetchProfile(params.name);
        if (!profile || profile.status === 'error') {
            const errorMessage =
                profile?.status === 'error'
                    ? 'Profile module is disabled.'
                    : 'Error fetching profile';
            return <div>{errorMessage}</div>;
        }
        return <ProfileView profile={profile} />;
    } catch (error) {
        return <div>An unexpected error occurred</div>;
    }
}

async function fetchProfile(name?: string) {
    if (name) {
        return getProfile(name).catch(handleUnauthorized);
    }
    const user = await getUser().catch(handleUnauthorized);
    if (!user) throw new Error('Unauthorized or no user data available');
    return getProfile(user.username).catch(handleUnauthorized);
}
