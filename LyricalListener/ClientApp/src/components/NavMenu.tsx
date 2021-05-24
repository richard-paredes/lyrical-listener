import React from 'react';
import {Flex, Heading, IconButton, useColorMode} from "@chakra-ui/react";
import {MoonIcon, SunIcon} from "@chakra-ui/icons";

export const NavMenu = () => {
    const {colorMode, toggleColorMode} = useColorMode();

    return (
        <Flex w={"100%"} align={"center"} justify={"space-between"} p={[1,1,4,4]}>
            <Heading>
                Lyrical Listener
            </Heading>
            <Flex
                align={"center"}
                justify={"flex-end"}>
                <Flex>
                    <IconButton onClick={toggleColorMode} variant={"ghost"} icon={(colorMode === "dark" ? <SunIcon /> : <MoonIcon />)} aria-label={"Toggle Color Mode"}/>
                </Flex>
            </Flex>
        </Flex>
    );

}
