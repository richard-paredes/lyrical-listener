import React from 'react';
import {Link} from 'react-router-dom';
import {Layout} from "../components/Layout";
import {Button, Flex, Heading} from "@chakra-ui/react";

interface NotFoundProps {
    isLoading: boolean;
}

export const NotFound: React.FC<NotFoundProps> = ({isLoading}) => {
    return <Layout isLoading={isLoading}>
        <Flex>
            <Heading>This page doesn't exist!</Heading>
            <Button as={Link} to={"/"} variant={"solid"}>Head back home</Button>
        </Flex>
    </Layout>
} 