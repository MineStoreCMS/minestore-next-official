import { AxiosInstance } from 'axios';

type ReturnType = {
    status: boolean;
};

export const inGameAuthAttempt = (fetcher: AxiosInstance) => async (username: string) => {
    const url = `/game_auth/init/${username}`;
    return (await fetcher.post<ReturnType>(url)).data;
};
