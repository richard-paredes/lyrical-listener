import React, {lazy, Suspense, useEffect, useState} from 'react';
import {Layout} from "../components/Layout";
import {
    Container,
    Flex,
    FormControl,
    Heading,
    Input, Skeleton,
    SkeletonText,
    Text,
    useColorModeValue
} from "@chakra-ui/react";
import SpotifyWebApi from 'spotify-web-api-node';
import {RouteComponentProps} from "react-router";
import {SearchResult} from "../types/SearchResult";
import { TrackSearchResult } from '../components/TrackSearchResult';
const TrackPlayer = lazy(() => import('../components/TrackPlayer'));

const spotifyApiClient = new SpotifyWebApi({
    clientId: process.env.REACT_APP_SPOTIFY_CLIENT_ID
});

interface HomeProps extends RouteComponentProps {
    accessToken: string;
    isLoading: boolean;
}
export const Home: React.FC<HomeProps> = ({accessToken, isLoading}) => {
    
    useEffect(() => {
        if (!accessToken) return;
        spotifyApiClient.setAccessToken(accessToken);
    }, [accessToken]);

    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    
    useEffect(() => {
        if (!search) return setSearchResults([]);
        if (!accessToken) return;
        let cancel = false;
        spotifyApiClient.searchTracks(search)
            .then(res => {
                if (cancel) return;
                setSearchResults(() => !res.body.tracks ? [] : res.body.tracks.items.map(track => {
                    const smallestAlbumImage = track.album.images.reduce((smallest, image) => image.height && smallest.height && image.height < smallest.height ? image : smallest, track.album.images[0]);
                    return {
                        artist: track.artists[0].name,
                        title: track.name,
                        uri: track.uri,
                        albumUrl: smallestAlbumImage.url
                    };
                }))
            });

        return () => {
            cancel = true
        };
    }, [search, accessToken]);

    const [currentTrack, setCurrentTrack] = useState<SearchResult>();
    const chooseTrack = (track: SearchResult) => {
        setCurrentTrack(track);
    };

    const [lyrics, setLyrics] = useState('');
    const [fetchingLyrics, setFetchingLyrics] = useState(false);
    useEffect(() => {
        if (!currentTrack) return;
        setFetchingLyrics(true);
        fetch('/api/spotify/lyrics?' + new URLSearchParams({
            'trackTitle': currentTrack.title,
            'artist': currentTrack.artist
        }))
            .then(res => {
                if (!res.ok) throw new Error("Network failed to get lyrics");
                return res.text();
            })
            .then(data => {
                setLyrics(data ? data : 'No lyrics found!');
            })
            .catch(err => {
                setLyrics('No lyrics found!');
            })
            .finally(() => setFetchingLyrics(false));
    }, [currentTrack])

    const searchContainerBg = useColorModeValue("gray.100", "gray.700");
    const lyricsContainerBg = useColorModeValue("gray.200", "gray.600");
    
    return (
        <Layout isLoading={isLoading}>
            <Flex flexDir={"column"} h={["calc(100vh - 50px)", "calc(100vh - 50px)", "calc(100vh - 80px)", "calc(100vh - 80px)"]}>
                <Flex flexDir={["column", "column", "row", "row"]} maxH={"calc(100% - 100px)"} rounded={"md"}>
                    <Container bgColor={searchContainerBg} w={["auto", "auto", "100%", "100%"]} maxW={"100%"} p={6} mx={2} overflowY={"auto"} rounded={"md"} my={[2, 2, 0, 0]}>
                        <FormControl>
                            <Input type={"search"} placeholder={"Search songs or artists"} value={search}
                                   onChange={e => setSearch(e.currentTarget.value)}/>
                        </FormControl>
                        {searchResults.length > 0 && (
                            <Container overflowY={"auto"} maxW={"100%"} px={6} mt={10}>
                                {searchResults.map(track => (
                                    <TrackSearchResult track={track} key={track.uri} setTrack={chooseTrack} isSelected={track===currentTrack}/>
                                ))}
                            </Container>
                        )}
                    </Container>
                    <Flex overflowY={"auto"} flexDir={"column"} w={["auto", "auto", "100%", "100%"]} maxW={"100%"} bgColor={lyricsContainerBg} p={6} mx={2} my={[2, 2, 0, 0]} rounded={"md"}>
                        <Heading size={"md"} mb={2}>{currentTrack ? `${currentTrack.title} by ${currentTrack.artist}` : 'Search for a song to find its lyrics'}</Heading>
                        <SkeletonText isLoaded={!fetchingLyrics} noOfLines={50} spacing={"5"}>
                            <Text dangerouslySetInnerHTML={{__html: lyrics}}/>
                        </SkeletonText>
                    </Flex>
                </Flex>
                <Suspense fallback={<Skeleton w={"100%"} mt={"auto"} />}>
                    <TrackPlayer accessToken={accessToken} trackUri={currentTrack?.uri} />
                </Suspense>
            </Flex>
        </Layout>
    );
}
