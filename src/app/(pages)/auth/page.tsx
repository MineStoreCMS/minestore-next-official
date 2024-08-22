import { AuthForm } from './components/auth-from';
import { InGameAuthForm } from './components/in-game-auth-form';

import { getEndpoints } from '@/api';
import { fetcher } from '@/api/server/fetcher';

const { getSettings } = getEndpoints(fetcher);

export default async function Auth() {
    const settings = await getSettings();

    return (
        <div className="flex-col rounded-[10px] bg-card p-4">
            {settings?.auth_type === 'ingame' ? <InGameAuthForm /> : <AuthForm />}
        </div>
    );
}
