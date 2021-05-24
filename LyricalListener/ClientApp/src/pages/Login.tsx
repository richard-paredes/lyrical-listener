import {
    Button,
    Flex, 
    Link,
    useColorModeValue
} from '@chakra-ui/react';
import React from "react";
import {Layout} from "../components/Layout";

const scopes = process.env.REACT_APP_SPOTIFY_SCOPES;
const redirect_uri = window.location.origin + '/';

const AUTH_URL = process.env.REACT_APP_SPOTIFY_AUTH_URL +
'?response_type=code' +
'&client_id=' + process.env.REACT_APP_SPOTIFY_CLIENT_ID +
(scopes ? '&scope=' + encodeURIComponent(scopes) : '') + 
(redirect_uri ? '&redirect_uri=' + encodeURIComponent(redirect_uri) : '');

interface LoginProps {
    isLoading: boolean;
}

export const Login: React.FC<LoginProps> = ({isLoading}) => {
    const formBackground = useColorModeValue("gray.100", "gray.900");
    return (
        <Layout isLoading={isLoading}>
            <Flex alignItems={"center"} justifyContent={"center"} m={"auto"}>
                <Flex direction={"column"} background={formBackground} p={12} rounded={6}>
                    <Button as={Link} href={AUTH_URL} colorScheme={"green"}>
                        Login With Spotify
                    </Button>
                </Flex>
            </Flex>
        </Layout>
    )
}