import React from 'react';
import {NavMenu} from './NavMenu';
import {Container, Flex, Skeleton} from "@chakra-ui/react";


interface LayoutProps {
    isLoading: boolean;
}

export const Layout: React.FC<LayoutProps> = ({isLoading, children}) => {
    return (
        <Flex maxWidth={"100%"} w={"100%"} ml={0} mr={0} minH={"100vh"} px={0} flexDir={"column"}>
            <NavMenu/>
            <Skeleton maxW={"100%"} w={"100%"} px={0} m={"auto 0"} isLoaded={!isLoading}>
                <Container maxW={"100%"} px={0} m={"auto"}>
                    {children ? children : null}
                </Container>
            </Skeleton>
        </Flex>
    );

}
