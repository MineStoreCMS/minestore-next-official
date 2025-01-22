import { AxiosInstance } from 'axios';
import { TDiscordAuth } from '@/types/discord-auth';

type ReturnType = TDiscordAuth;

export const getDiscordAuth = (fetcher: AxiosInstance) => async () => {
   const url = '/auth/discord';
   return (await fetcher.get<ReturnType>(url)).data;
};
