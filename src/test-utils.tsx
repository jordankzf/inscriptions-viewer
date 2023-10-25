import { ThemeProvider } from 'styled-components';
import Theme from './theme';
import { ReactNode } from 'react';
import GlobalStyle from './theme/global';
import { render } from '@testing-library/react'
import { JSX } from 'react/jsx-runtime';

const AllTheProviders = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <GlobalStyle />
            <ThemeProvider theme={Theme}>
                {children}
            </ThemeProvider>
        </>
    )
}

const customRender = (ui: JSX.Element) =>
    render(ui, { wrapper: AllTheProviders })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }