import {createContext} from "react";

interface SpotifyAuthContextValue {
    accessToken: string;
    isAuthenticating: boolean;
}
const defaultSpotifyContextValue = {
    accessToken: '',
    isAuthenticating: false
};

export const SpotifyAuthContext = createContext<SpotifyAuthContextValue>(defaultSpotifyContextValue);