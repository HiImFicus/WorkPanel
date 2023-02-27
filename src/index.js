import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { RouterProvider } from "react-router-dom";
import rootRouter from "./components/router";

const root = ReactDOM.createRoot(document.getElementById('root'));
const theme = 'dark';
root.render(
  <React.StrictMode>
    <MantineProvider theme={{ colorScheme: theme }} withGlobalStyles withNormalizeCSS>
      <RouterProvider router={rootRouter} />
    </MantineProvider>
  </React.StrictMode>
);
