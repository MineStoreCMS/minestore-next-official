import { AxiosInstance } from 'axios';
import { TProfile } from '@/types/profile';

type ReturnType = TProfile;

export const getProfile = (fetcher: AxiosInstance) => async (name: string) => {
    const url = `/profile/${name}`;
    return (await fetcher.get<ReturnType>(url)).data;
};
