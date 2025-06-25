import { AuthForm } from './components/auth-from';
import { InGameAuthForm } from './components/in-game-auth-form';
import { ClassicAuthSwitcher } from './components/classic-auth-switcher';
import { getEndpoints } from '@/api';
import { fetcher } from '@/api/server/fetcher';

const { getSettings } = getEndpoints(fetcher);

export default async function Auth() {
    const settings = await getSettings();
    const initialType = settings?.auth_type;
    return (
        <div className="flex-col rounded-[10px] bg-card p-4">
            {initialType === 'ingame' ? <InGameAuthForm /> : initialType === 'register' ? <ClassicAuthSwitcher initialForm="login" /> : <AuthForm />}
        </div>
    );
}
