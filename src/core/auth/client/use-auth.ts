import { useUserStore } from '@/stores/user';

export const useAuth = () => {
    const { user, loading } = useUserStore();

    return { user, loading };
};
