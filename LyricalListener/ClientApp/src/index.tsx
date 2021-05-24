import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import registerServiceWorker from './registerServiceWorker';
import {ChakraProvider, ColorModeScript} from "@chakra-ui/react";
import theme from "./theme";

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

ReactDOM.render(
    <ChakraProvider theme={theme}>
        <BrowserRouter basename={baseUrl ?? ""}>
            <App />
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        </BrowserRouter>
    </ChakraProvider>,
  rootElement);

registerServiceWorker();

