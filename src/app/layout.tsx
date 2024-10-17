'use client'
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import theme from "@/theme";
import { ThemeProvider } from "@emotion/react";
import Navbar from "./_Components/Navbar";
import { Container } from "@mui/material";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
            <ToastContainer/>;
            <Navbar/>
            <Container maxWidth={'md'} sx={{pt:10}}>{children}</Container>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </Provider>
        </body>
    </html>
  );
}
