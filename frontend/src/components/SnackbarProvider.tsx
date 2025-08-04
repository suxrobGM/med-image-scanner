"use client";

import {ReactNode} from "react";
import {SnackbarProvider as NotistackSnackbarProvider} from "notistack";

export function SnackbarProvider({children}: {children: ReactNode}) {
  return <NotistackSnackbarProvider>{children}</NotistackSnackbarProvider>;
}
