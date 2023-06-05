import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';

axios.defaults.baseURL = 'http://localhost:4000/api/v1'
export const useAxios = (
    config: AxiosRequestConfig<any>,
    loadOnStart: boolean = true
): [boolean, AxiosResponse | undefined, string, () => void] => {
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<AxiosResponse>();
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (loadOnStart) sendRequest();
        else setLoading(false);
    }, []);

    const request = () => {
        sendRequest();
    };

    const sendRequest = () => {
        setLoading(true);

        axios(config)
            .then((response) => {
                setError('');
                setData(response);
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => setLoading(false));
    };

    return [loading, data, error, request];
};