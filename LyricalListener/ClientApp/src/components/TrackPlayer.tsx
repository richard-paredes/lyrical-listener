import React, {useEffect, useState} from 'react';
import SpotifyWebPlayer from "react-spotify-web-playback";
import {Skeleton} from "@chakra-ui/react";

export interface TrackPlayerProps {
    accessToken?: string;
    trackUri?: string;
}

export const TrackPlayer: React.FC<TrackPlayerProps> = ({accessToken, trackUri}) => {
    const [play, setPlay] = useState(false);

    useEffect(() => {
        setPlay(true);
    }, [trackUri]);
    
    return (
        <Skeleton mx={0} maxW={"100%"} w={"100%"} mt={"auto"} isLoaded={!!accessToken}>
            <SpotifyWebPlayer token={accessToken ?? ''} showSaveIcon uris={trackUri ? [trackUri] : []} play={play}
                              callback={state => !state.isPlaying && setPlay(false)}/>
        </Skeleton>
    )
};

export default TrackPlayer;