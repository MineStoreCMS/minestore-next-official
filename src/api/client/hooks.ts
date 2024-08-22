import { useEffect, useState } from 'react';

export const useFetcher = <TResponse extends object | string = object | string>(
    callback: () => Promise<TResponse>
) => {
    const [response, setResponse] = useState<TResponse | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        callback()
            .then((data) => {
                setResponse(data);
            })
            .catch((err) => {
                setError(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [callback]);

    return {
        loading,
        response,
        error
    };
};
