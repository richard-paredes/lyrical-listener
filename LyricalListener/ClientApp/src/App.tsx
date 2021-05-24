import React from 'react';
import {Route, Switch} from 'react-router';
import {Home} from './pages/Home';
import {Login} from "./pages/Login";
import {NotFound} from "./pages/NotFound";
import {useSpotify} from "./hooks/useSpotify";
import {SpotifyAuthContext} from './SpotifyAuthContext';

export const App = () => {
    const {accessToken, isAuthenticating} = useSpotify();
    return (
        <SpotifyAuthContext.Provider value={{accessToken, isAuthenticating}}>
            <Switch>
                <Route exact path='/' render={(props) => <Login isLoading={isAuthenticating} />}>
                </Route>
                <Route exact path='/home' render={(props) => <Home {...props} accessToken={accessToken} isLoading={isAuthenticating} />}>
                </Route>
                <Route path="*" render={(props) => <NotFound isLoading={isAuthenticating} />} />
            </Switch>
        </SpotifyAuthContext.Provider>
    );

}
