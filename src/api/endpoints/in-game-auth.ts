import { AxiosInstance } from 'axios';

type ReturnType = {
    status: boolean;
    token: string;
};

export const inGameAuth = (fetcher: AxiosInstance) => async (username: string) => {
    const url = `/game_auth/check/${username}`;
    return (await fetcher.post<ReturnType>(url)).data;
};
