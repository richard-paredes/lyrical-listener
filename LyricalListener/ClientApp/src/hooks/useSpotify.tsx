import {useCallback, useEffect, useState} from 'react';
import {useHistory} from "react-router";
import {AuthResponse} from "../types/AuthResponse";

export const useSpotify = () => {
    const history = useHistory();
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [authorizationCode, setAuthorizationCode] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [refreshToken, setRefreshToken] = useState('');
    const [expiresIn, setExpiresIn] = useState(0);
    
    const saveAuthResponseToLocalStorage = (authResponse: AuthResponse) => {
        localStorage.setItem("ll_spotify", JSON.stringify(authResponse));
    };
    
    useEffect(() => {
        const spotifyAuthCode = new URLSearchParams(window.location.search).get('code') ?? '';
        if (spotifyAuthCode) setAuthorizationCode(spotifyAuthCode);
    }, []);
    
    useEffect(() => {
        if (!!accessToken) {
            history.push('/home');
            return;
        }
    }, [history, accessToken]);


    const fetchAccessTokenByRefresh = useCallback((refresh_token: string) => {
        setIsAuthenticating(true);
        
        fetch('/api/spotify/auth/refresh', {
            method: 'POST',
            body: JSON.stringify(refresh_token),
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        })
            .then((response) => {
                if (!response.ok) throw new Error("Network response included an error");
                return response.json();
            })
            .then((data) => {
                setAccessToken(data.accessToken);
                setExpiresIn(data.expiresIn);
            })
            .catch((error) => {
                history.push('/');
            })
            .finally(() => {
                setIsAuthenticating(false)
            });
    }, [history]);
    
    useEffect(() => {
        if (authorizationCode) return;
        
        const authResponseString = localStorage.getItem('ll_spotify');
        if (authResponseString == null || !authResponseString) {
            history.push('/');
            return;
        }
        
        const authResponse = JSON.parse(authResponseString);
        
        setRefreshToken(authResponse.refreshToken);
        fetchAccessTokenByRefresh(authResponse.refreshToken);
    }, [authorizationCode, history, fetchAccessTokenByRefresh]);

    useEffect(() => {
        if (!authorizationCode) return;
        setIsAuthenticating(true);
        
        fetch("/api/spotify/auth", {
            method: 'POST',
            body: JSON.stringify(authorizationCode),
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        })
            .then((response) => {
                if (!response.ok) throw new Error("Network response included an error");
                return response.json();
            })
            .then((data) => {
                setAccessToken(data.accessToken);
                setRefreshToken(data.refreshToken);
                setExpiresIn(data.expiresIn);
                
                saveAuthResponseToLocalStorage({ accessToken: data.accessToken, refreshToken: data.refreshToken, expiresIn: data.expiresIn });
            })
            .catch((error) => {
                history.push('/');
            })
            .finally(() => {
                setIsAuthenticating(false);
            });
    }, [authorizationCode, history]);

    useEffect(() => {
        if (!refreshToken || !expiresIn) return;
        const interval = setInterval(() => fetchAccessTokenByRefresh(refreshToken), (expiresIn - 60) * 1000);

        return () => clearInterval(interval);
    }, [refreshToken, expiresIn, fetchAccessTokenByRefresh, history]);
    
    return {accessToken, isAuthenticating};
};