import React from "react";
import {Button, Container, Flex, Heading, Image, Text} from "@chakra-ui/react";
import { SearchResult } from "../types/SearchResult";

interface TrackSearchResultProps {
    track: SearchResult
    setTrack: (track: SearchResult) => void;
    isSelected: boolean;
}

export const TrackSearchResult: React.FC<TrackSearchResultProps> = ({track, setTrack, isSelected}) => {
    const handlePlay = () => {
        setTrack(track);
    }
    return (
        <Button as={Flex} my={2} onClick={handlePlay} w={"100%"} h={"auto"} p={1} whiteSpace={"normal"} isActive={isSelected}>
            <Image src={track.albumUrl} h={"64px"} w={"64px"} rounded={"lg"}/>
            <Container ml={"2rem"}>
                <Heading size={"md"}>
                    {track.title}
                </Heading>
                <Text size={"sm"}>
                    {track.artist}
                </Text>
            </Container>
        </Button>
    );
};