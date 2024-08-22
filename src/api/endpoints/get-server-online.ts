import { AxiosInstance } from 'axios';

type ReturnType = {
    onlinePlayers: number;
    maxPlayers: number;
};

export const getServerOnline = (fetcher: AxiosInstance) => async (ip: string, port: string) => {
    const url = `https://minestorecms.com/api/getOnline/${ip}${port ? `/${port}` : ''}`;
    return (await fetcher.get<ReturnType>(url)).data;
};
