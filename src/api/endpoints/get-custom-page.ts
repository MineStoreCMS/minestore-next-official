import { AxiosInstance } from 'axios';

type ReturnType = {
    success: boolean;
    page: {
        id: number;
        url: string;
        name: string;
        content: string;
        created_at: string;
        updated_at: string;
    };
};

export const getCustomPage = (fetcher: AxiosInstance) => async (pageURL: string) => {
    const url = `/pages/get`;
    return (
        await fetcher.post<ReturnType>(url, {
            url: pageURL
        })
    ).data;
};
