import {ReactNode} from "react";
import type {Metadata} from "next";
import {Inter} from "next/font/google";
import {NextIntlClientProvider} from "next-intl";
import {getLocale, getMessages} from "next-intl/server";
import {CssBaseline} from "@mui/material";
import {AppRouterCacheProvider} from "@mui/material-nextjs/v13-appRouter";
import {
  ConfirmDialogProvider,
  MuiXLicense,
  ThemeProvider,
  SnackbarProvider,
} from "@/components";

interface RootLayoutProps {
  children: ReactNode;
}

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Med Scanner",
  description: "Med Scanner app",
};

export default async function RootLayout(props: RootLayoutProps) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        {process.env.NODE_ENV === "production" && (
          <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        )}
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <AppRouterCacheProvider>
          <ThemeProvider>
            <CssBaseline />
            <SnackbarProvider>
              <ConfirmDialogProvider>
                <NextIntlClientProvider messages={messages}>
                  {props.children}
                  <MuiXLicense />
                </NextIntlClientProvider>
              </ConfirmDialogProvider>
            </SnackbarProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
