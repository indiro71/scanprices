import { useCallback, useEffect, useState } from 'react';
import { storageName } from './auth.hook';

interface userDataFields {
  token?: string;
}

export const useHttp = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState(null);
  const apiServer = process.env.NEXT_PUBLIC_REACT_APP_API_SERVER;
  let userData: userDataFields = {};
  useEffect(() => {
    userData = JSON.parse(localStorage.getItem(storageName));
  });

  async function request<T>(
    url: string,
    method: string = 'GET',
    body = null,
    headers: {
      [key: string]: string;
    } = {}): Promise<T> {
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
        throw new Error(data.message || data.error || 'Some error');
      }

      setLoading(false);

      return data;
    } catch (e) {
      setLoading(false);
      setError(e.message);
      throw e;
    }
  }

  const clearError = useCallback(() => setError(null), []);

  return {loading, request, error, clearError};
};