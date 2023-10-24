import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Main from './screens/Main';
import Detail from './screens/Detail';
import { ThemeProvider } from 'styled-components';
import Theme from './theme';
import GlobalStyle from './theme/global';

const router = createBrowserRouter([
  {
    path: "/:address",
    element: <Main />,
  },
  {
    path: "/",
    element: <Main />,
  },
  {
    path: "/detail/:address/:id",
    element: <Detail />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <GlobalStyle />                  <ThemeProvider theme={Theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
