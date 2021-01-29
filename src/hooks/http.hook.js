import { useCallback, useState } from 'react';
import { storageName } from './auth.hook';

export const useHttp = () => {
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);
    const apiServer = process.env.REACT_APP_API_SERVER;
    const userData = JSON.parse(localStorage.getItem(storageName));

    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true);
        try {
            if (body) {
                body = JSON.stringify(body);
                headers['Content-Type'] = 'application/json';
            }

            if (userData?.token) {
                headers['Authorization'] = userData.token;
            }

            const response = await fetch(apiServer + url, {
                method, body, headers
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Что-то пошло не так');
            }

            setLoading(false);

            return data;
        } catch (e) {
            setLoading(false);
            setError(e.message);
            throw e;
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return { loading, request, error, clearError };
}